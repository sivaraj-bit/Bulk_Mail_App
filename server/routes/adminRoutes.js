
const express = require("express");
const router = express.Router();

const {
    registerAdmin,
    loginAdmin
} = require("../controllers/adminController");

const { loginLimiter } = require("../middleware/rateLimiter");

// Admin Registration
router.post("/register", registerAdmin);

// Admin Login
router.post("/login", loginLimiter, loginAdmin);

module.exports = router;
