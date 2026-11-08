
const mongoose = require("mongoose");
const Email = require("../models/emailModel");
const transporter = require("../config/mailer");

// Send Bulk Email with Automatic Batch Processing
const sendBulkEmail = async (req, res) => {
    let emailRecord;

    const BATCH_SIZE = 50;
    const MAX_RECIPIENTS = 500;

    try {
        const { subject, body, recipients } = req.body || {};

        // Validate authenticated account
        if (
            !req.accountId ||
            !["Admin", "User"].includes(req.accountModel)
        ) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        // Validate subject and body
        if (
            typeof subject !== "string" ||
            typeof body !== "string" ||
            !subject.trim() ||
            !body.trim()
        ) {
            return res.status(400).json({
                message: "Subject and body are required"
            });
        }

        // Validate recipients
        if (!Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({
                message: "At least one recipient is required"
            });
        }

        if (!recipients.every(email => typeof email === "string")) {
            return res.status(400).json({
                message: "All recipients must be valid email strings"
            });
        }

        // Normalize and remove duplicates
        const emailList = [
            ...new Set(
                recipients.map(email => email.trim().toLowerCase())
            )
        ];

        // Check empty email addresses
        if (emailList.some(email => !email)) {
            return res.status(400).json({
                message: "Recipient email addresses cannot be empty"
            });
        }

        // Maximum recipient limit
        if (emailList.length > MAX_RECIPIENTS) {
            return res.status(400).json({
                message: `Maximum ${MAX_RECIPIENTS} unique recipients allowed`
            });
        }

        // Validate email format
        const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        const invalidEmails = emailList.filter(
            email => !emailRegex.test(email)
        );

        if (invalidEmails.length > 0) {
            return res.status(400).json({
                message: "Invalid email addresses",
                invalidEmails
            });
        }

        // Create pending email record with account ownership
        emailRecord = await Email.create({
            subject: subject.trim(),
            body: body.trim(),
            recipients: emailList,
            status: "pending",
            sentAt: null,
            createdBy: req.accountId,
            createdByModel: req.accountModel
        });

        const acceptedSet = new Set();
        const rejectedSet = new Set();

        // Normalize Nodemailer addresses
        const normalizeAddress = item => {
            const address =
                typeof item === "string"
                    ? item
                    : item?.address || "";

            return address.trim().toLowerCase();
        };

        // Calculate total batches
        const totalBatches = Math.ceil(
            emailList.length / BATCH_SIZE
        );

        // Process batches one by one
        for (
            let i = 0;
            i < emailList.length;
            i += BATCH_SIZE
        ) {
            const batch = emailList.slice(
                i,
                i + BATCH_SIZE
            );

            console.log(
                `Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${totalBatches}`
            );

            try {
                const info = await transporter.sendMail({
                    from: process.env.SMTP_USER,
                    to: process.env.SMTP_USER,
                    bcc: batch,
                    subject: subject.trim(),
                    text: body.trim()
                });

                const batchAccepted = new Set(
                    (info.accepted || []).map(normalizeAddress)
                );

                const batchRejected = new Set(
                    (info.rejected || []).map(normalizeAddress)
                );

                batch.forEach(email => {
                    if (batchRejected.has(email)) {
                        rejectedSet.add(email);
                    } else if (batchAccepted.has(email)) {
                        acceptedSet.add(email);
                    } else {
                        rejectedSet.add(email);
                    }
                });

            } catch (batchError) {
                console.error("Batch sending error:", batchError);

                batch.forEach(email => {
                    rejectedSet.add(email);
                });
            }
        }

        // Convert results into arrays
        const acceptedRecipients = [...acceptedSet];
        const rejectedRecipients = [...rejectedSet];

        // Determine overall status
        let status;

        if (
            acceptedRecipients.length === emailList.length &&
            rejectedRecipients.length === 0
        ) {
            status = "sent";
        } else if (acceptedRecipients.length > 0) {
            status = "partial";
        } else {
            status = "failed";
        }

        // Update MongoDB record
        emailRecord.status = status;

        emailRecord.sentAt =
            status === "failed" ? null : new Date();

        await emailRecord.save();

        return res.status(200).json({
            message: "Bulk email processing completed",
            status: emailRecord.status,
            emailId: emailRecord._id,
            accepted: acceptedRecipients,
            rejected: rejectedRecipients,
            totalRecipients: emailList.length,
            totalBatches,
            batchSize: BATCH_SIZE
        });

    } catch (error) {
        console.error("Email sending error:", error);

        if (emailRecord) {
            try {
                emailRecord.status = "failed";
                emailRecord.sentAt = null;

                await emailRecord.save();

            } catch (saveError) {
                console.error(
                    "Failed to update email record:",
                    saveError
                );
            }
        }

        return res.status(500).json({
            message: "Failed to process bulk email"
        });
    }
};


// Get Email History
const getEmailHistory = async (req, res) => {
    try {
        const filter = req.role === "Admin"
            ? {}
            : {
                createdBy: req.accountId,
                createdByModel: "User"
            };

        const emails = await Email.find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Email history fetched successfully",
            totalEmails: emails.length,
            emails
        });

    } catch (error) {
        console.error("Email history error:", error);

        return res.status(500).json({
            message: "Failed to fetch email history"
        });
    }
};


// Get Dashboard Statistics
const getEmailStats = async (req, res) => {
    try {
        const filter = req.role === "Admin"
            ? {}
            : {
                createdBy: new mongoose.Types.ObjectId(req.accountId),
                createdByModel: "User"
            };

        const [
            totalEmails,
            successfulEmails,
            partialEmails,
            failedEmails,
            recipientStats
        ] = await Promise.all([
            Email.countDocuments(filter),

            Email.countDocuments({
                ...filter,
                status: "sent"
            }),

            Email.countDocuments({
                ...filter,
                status: "partial"
            }),

            Email.countDocuments({
                ...filter,
                status: "failed"
            }),

            Email.aggregate([
                {
                    $match: filter
                },
                {
                    $group: {
                        _id: null,
                        totalRecipients: {
                            $sum: {
                                $size: {
                                    $ifNull: ["$recipients", []]
                                }
                            }
                        }
                    }
                }
            ])
        ]);

        return res.status(200).json({
            message: "Dashboard statistics fetched successfully",
            totalEmails,
            totalRecipients:
                recipientStats[0]?.totalRecipients || 0,
            successfulEmails,
            partialEmails,
            failedEmails
        });

    } catch (error) {
        console.error("Dashboard statistics error:", error);

        return res.status(500).json({
            message: "Failed to fetch dashboard statistics"
        });
    }
};


// Get Daily Email Analytics
const getDailyAnalytics = async (req, res) => {
    try {
        const startDate = new Date();

        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);

        const filter = req.role === "Admin"
            ? {}
            : {
                createdBy: new mongoose.Types.ObjectId(req.accountId),
                createdByModel: "User"
            };

        const analytics = await Email.aggregate([
            {
                $match: {
                    ...filter,
                    createdAt: {
                        $gte: startDate
                    },
                    status: {
                        $in: ["sent", "partial", "failed"]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                            timezone: "Asia/Kolkata"
                        }
                    },

                    sent: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "sent"] },
                                1,
                                0
                            ]
                        }
                    },

                    partial: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "partial"] },
                                1,
                                0
                            ]
                        }
                    },

                    failed: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "failed"] },
                                1,
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    sent: 1,
                    partial: 1,
                    failed: 1
                }
            }
        ]);

        return res.status(200).json({
            message: "Daily analytics fetched successfully",
            analytics
        });

    } catch (error) {
        console.error("Daily analytics error:", error);

        return res.status(500).json({
            message: "Failed to fetch daily analytics"
        });
    }
};


module.exports = {
    sendBulkEmail,
    getEmailHistory,
    getEmailStats,
    getDailyAnalytics
};
