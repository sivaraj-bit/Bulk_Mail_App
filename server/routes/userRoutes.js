
const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controllers/userController");

const { loginLimiter } = require("../middleware/rateLimiter");

// User Registration
router.post("/register", registerUser);

// User Login - Maximum 5 attempts per 15 minutes
router.post("/login", loginLimiter, loginUser);

module.exports = router;
