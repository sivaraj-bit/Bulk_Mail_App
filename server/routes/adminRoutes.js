
const express = require("express");
const router = express.Router();

const {
    registerAdmin,
    loginAdmin
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");
const { loginLimiter } = require("../middleware/rateLimiter");

// Only logged-in Admins can create another Admin
router.post(
    "/register",
    authMiddleware,
    adminOnly,
    registerAdmin
);

// Admin login
router.post("/login", loginLimiter, loginAdmin);

module.exports = router;
