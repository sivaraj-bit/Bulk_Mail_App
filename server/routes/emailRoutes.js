
const express = require("express");
const router = express.Router();

const {
    sendBulkEmail,
    getEmailHistory,
    getEmailStats,
    getDailyAnalytics
} = require("../controllers/emailController");

const authMiddleware = require("../middleware/authMiddleware");
const { emailLimiter } = require("../middleware/rateLimiter");

// Protect all email routes
router.use(authMiddleware);

// Send Bulk Email - Maximum 10 requests per 15 minutes
router.post("/send", emailLimiter, sendBulkEmail);

// Get Email History
router.get("/history", getEmailHistory);

// Get Dashboard Statistics
router.get("/stats", getEmailStats);

// Get Daily Analytics
router.get("/analytics/daily", getDailyAnalytics);

module.exports = router;
