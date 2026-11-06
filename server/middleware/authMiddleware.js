
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Check JWT secret
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing");
            return res.status(500).json({
                message: "Server configuration error"
            });
        }

        // Get authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                algorithms: ["HS256"]
            }
        );

        // Validate admin ID
        if (!decoded.id) {
            return res.status(401).json({
                message: "Invalid token payload"
            });
        }

        // Store admin ID
        req.adminId = decoded.id;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;
