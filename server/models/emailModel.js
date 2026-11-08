
const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            required: true,
            trim: true
        },

        body: {
            type: String,
            required: true,
            trim: true
        },

        recipients: {
            type: [String],
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "sent", "partial", "failed"],
            default: "pending"
        },

        sentAt: {
            type: Date,
            default: null
        },

        // Owner of this email record
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "createdByModel"
        },

        createdByModel: {
            type: String,
            required: true,
            enum: ["Admin", "User"]
        }
    },
    { timestamps: true }
);

const Email = mongoose.model("Email", emailSchema);

module.exports = Email;
