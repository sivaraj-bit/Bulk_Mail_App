
const adminOnly = (req, res, next) => {
    if (req.role !== "Admin") {
        return res.status(403).json({
            message: "Access denied. Admin privileges required."
        });
    }

    next();
};

module.exports = adminOnly;
