const jwt = require("jsonwebtoken");
const User = require('../models/User');

async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({message: "Missing or invalid token"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}



function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) 
            return res.status(403).json({message: "Forbidden: Access denied"});
        
        next();
    };
}

module.exports = {authenticate, authorizeRoles};