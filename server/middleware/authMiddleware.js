
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing");

            return res.status(500).json({
                message: "Server configuration error"
            });
        }

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ["HS256"] }
        );

        if (!decoded.id) {
            return res.status(401).json({
                message: "Invalid token payload"
            });
        }

        // Existing Admin tokens without a role remain valid.
        const role = decoded.role || "Admin";

        if (!["Admin", "User"].includes(role)) {
            return res.status(403).json({
                message: "Invalid account role"
            });
        }

        // Store authenticated account information.
        req.accountId = decoded.id;
        req.accountModel = role;
        req.role = role;

        // Keep compatibility with existing Admin controllers.
        if (role === "Admin") {
            req.adminId = decoded.id;
        }

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;
