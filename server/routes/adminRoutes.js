
const express = require("express");
const router = express.Router();

const {
    registerAdmin,
    loginAdmin
} = require("../controllers/adminController");

const { loginLimiter } = require("../middleware/rateLimiter");

// Login - Maximum 5 attempts per 15 minutes
router.post("/login", loginLimiter, loginAdmin);

// Registration disabled after initial admin setup
// router.post("/register", registerAdmin);

module.exports = router;
