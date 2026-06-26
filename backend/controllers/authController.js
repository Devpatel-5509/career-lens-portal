const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =====================
// REGISTER
// =====================
exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================
// LOGIN  ✅ FIXED
// =====================
exports.login = async (req, res) => {
  const { email, password } = req.body; // ✅ phone REMOVED

  try {
    // ✅ Find user by EMAIL ONLY
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ JWT PAYLOAD
    const payload = {
      userId: user._id,
    };

    // ✅ SIGN TOKEN
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, // 🔐 ENV VARIABLE
      { expiresIn: "1d" }
    );

    // ✅ SEND TOKEN + USER (FRONTEND NEEDS BOTH)
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
