const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prismaClient");
const generateToken = require("../utils/generateToken");

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating a user in DB if new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "MEMBER",
      },
    });

    // Generating token for user
    const token = generateToken(user.id);

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Generate token
    const token = generateToken(user.id);

    return res.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
};

module.exports = { register, login };
