const jwt = require("jsonwebtoken");
const prisma = require("../config/prismaClient");

const useProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user details
      req.user = await prisma.user.findUnique({ where: { id: decoded.userId } });

      if (!req.user) {
        return res.status(401).json({ error: "User not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  } else {
    return res.status(401).json({ error: "No token, authorization denied" });
  }
};

module.exports = useProtect;
