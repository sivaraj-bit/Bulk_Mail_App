
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Common Login for Admin and User
const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        // Validate input
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Find account in both collections
        const adminAccount = await Admin.findOne({
            email: normalizedEmail
        });

        const userAccount = await User.findOne({
            email: normalizedEmail
        });

        let account = null;
        let role = null;

        // Check Admin password
        if (adminAccount) {
            const isAdminPasswordValid = await bcrypt.compare(
                password,
                adminAccount.password
            );

            if (isAdminPasswordValid) {
                account = adminAccount;
                role = "Admin";
            }
        }

        // If Admin login did not match, check User
        if (!account && userAccount) {
            const isUserPasswordValid = await bcrypt.compare(
                password,
                userAccount.password
            );

            if (isUserPasswordValid) {
                account = userAccount;
                role = "User";
            }
        }

        // Invalid credentials
        if (!account) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is missing");
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: account._id.toString(),
                role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
                algorithm: "HS256"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            role,
            account: {
                id: account._id,
                name: account.name,
                email: account.email
            }
        });

    } catch (error) {
        console.error("Common Login Error:", error);

        return res.status(500).json({
            message: "Login failed. Please try again."
        });
    }
};

module.exports = { login };
