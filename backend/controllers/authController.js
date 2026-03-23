const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendNotificationEmail } = require("../utils/emailNotifier");
const logger = require("../config/logger"); // ✅ FIXED
// Use winston from config
exports.register = async (req, res) => {
  try {
    console.log("Register payload:", req.body); // Debug

    const { email, password, role, name, phone, location } = req.body;

    if (!email || !password || !role || !name || !phone || !location) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!["farmer", "buyer"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({
      email,
      password,
      role,
      accountDetails: { name, phone, location },
    });

    await user.save();

    await sendNotificationEmail(
      user.email,
      "Welcome to AgriChain Trace!",
      `Hello ${name}, your account as ${role} is ready!`,
    );

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }, // longer for dev – change to '7d' in production
    );

    res.status(201).json({ token, user: user.toJSON() });
  } catch (error) {
    console.error("Register error:", error);
    logger.error("Register error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.json({ token, user: user.toJSON() });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("notifications");
    res.json(user.toJSON());
  } catch (error) {
    logger.error("Profile fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        accountDetails: { ...updates.accountDetails },
        notifications: req.user.notifications,
      },
      { new: true },
    );
    res.json(user.toJSON());
  } catch (error) {
    logger.error("Profile update error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
