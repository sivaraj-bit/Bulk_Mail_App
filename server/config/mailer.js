
const BREVO_API_URL = "https://api.brevo.com/v3";

const getHeaders = () => {
    if (!process.env.BREVO_API_KEY) {
        throw new Error("BREVO_API_KEY is missing");
    }

    return {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY
    };
};

// Convert Nodemailer-style recipients into Brevo format
const normalizeRecipients = (value) => {
    if (!value) return [];

    const recipients = Array.isArray(value) ? value : [value];

    return recipients
        .filter(Boolean)
        .map((recipient) => {
            if (typeof recipient === "string") {
                const match = recipient.match(/^(.*?)\s*<([^<>]+)>$/);

                if (match) {
                    return {
                        name: match[1].replace(/^["']|["']$/g, "").trim(),
                        email: match[2].trim()
                    };
                }

                return { email: recipient.trim() };
            }

            if (typeof recipient === "object") {
                const email = recipient.email || recipient.address;

                if (!email) {
                    throw new Error("Invalid recipient email address");
                }

                return {
                    email,
                    ...(recipient.name ? { name: recipient.name } : {})
                };
            }

            throw new Error("Unsupported recipient format");
        });
};

// Make a request to Brevo
const brevoRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${BREVO_API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...getHeaders(),
            ...options.headers
        },
        signal: AbortSignal.timeout(30000)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message =
            data.message ||
            data.code ||
            `HTTP ${response.status}`;

        throw new Error(`Brevo API error: ${message}`);
    }

    return data;
};

// Send email using Brevo API
const sendMail = async (options) => {
    const senderEmail = process.env.BREVO_SENDER_EMAIL;

    if (!senderEmail) {
        throw new Error("BREVO_SENDER_EMAIL is missing");
    }

    const to = normalizeRecipients(options.to);
    const cc = normalizeRecipients(options.cc);
    const bcc = normalizeRecipients(options.bcc);

    if (to.length === 0) {
        throw new Error("At least one 'to' recipient is required");
    }

    const payload = {
        sender: {
            email: senderEmail,
            name: process.env.BREVO_SENDER_NAME || "BulkMail"
        },
        to,
        subject: options.subject || "No subject"
    };

    if (cc.length) payload.cc = cc;
    if (bcc.length) payload.bcc = bcc;

    if (options.html) {
        payload.htmlContent = options.html;
    } else if (options.text) {
        payload.textContent = options.text;
    } else {
        throw new Error("Email body is required");
    }

    if (options.replyTo) {
        const replyTo = normalizeRecipients(options.replyTo)[0];

        payload.replyTo = replyTo;
    }

    const result = await brevoRequest("/smtp/email", {
        method: "POST",
        body: JSON.stringify(payload)
    });

    // Preserve the result shape expected by the existing controller.
    const accepted = bcc.length ? bcc : to;

    return {
        accepted: accepted.map((recipient) => recipient.email),
        rejected: [],
        messageId: result.messageId,
        response: JSON.stringify(result)
    };
};

// Check Brevo API connection and credentials
const verify = async (callback) => {
    const verification = brevoRequest("/account");

    if (typeof callback === "function") {
        verification
            .then(() => callback(null, true))
            .catch((error) => callback(error, false));

        return;
    }

    return verification;
};

module.exports = {
    sendMail,
    verify
};
