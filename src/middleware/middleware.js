const jwt = require("jsonwebtoken");
const prisma = require("../db-config/prismaClient");

const userProtect = async (req, res, next) => {
  try {
    // Extract token from cookies (instead of Authorization header)
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details from database
    req.user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};


const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admins only." });
  }
};

module.exports = {userProtect, isAdmin};
