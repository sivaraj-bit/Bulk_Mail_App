
require("dotenv").config(); // Load environment variables FIRST

const express = require("express");
const cors = require("cors");
const emailRoutes = require("./routes/emailRoutes");
const adminRoutes = require("./routes/adminRoutes");

const connectDB = require("./config/db");
const transporter = require("./config/mailer");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/emails", emailRoutes);
app.use("/api/admin", adminRoutes);

// Connect MongoDB
connectDB();

// Debug SMTP credentials (temporary)
console.log("SMTP_USER loaded:", Boolean(process.env.SMTP_USER));
console.log("SMTP_PASS loaded:", Boolean(process.env.SMTP_PASS));

// Verify SMTP connection
transporter.verify((error, success) => {
    if (error) {
        console.log("SMTP connection failed:", error.message);
    } else {
        console.log("SMTP server is ready!");
    }
});

// Test API
app.get("/", (req, res) => {
    res.send("Bulk Mail Application API is running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
