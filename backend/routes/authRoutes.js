const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 mins
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { error: "Too many requests" },
});

router.post("/register", limiter, register);
router.post("/login", limiter, login);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

module.exports = router;
