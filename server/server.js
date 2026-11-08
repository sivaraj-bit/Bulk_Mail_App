
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const emailRoutes = require("./routes/emailRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const connectDB = require("./config/db");
const transporter = require("./config/mailer");

const app = express();

// Trust Render reverse proxy
app.set("trust proxy", 1);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/emails", emailRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("Bulk Mail Application API is running!");
});

const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

   transporter.verify((error) => {
    if (error) {
        console.error("Brevo API connection failed:", error.message);
    } else {
        console.log("Brevo API connected successfully!");
    }
});


    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
