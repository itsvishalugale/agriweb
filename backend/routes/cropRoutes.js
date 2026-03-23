const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  uploadCrop,
  getMyCrops,
  getAvailableCrops,
  getCropById,
  traceCrop,
  updateProgress,
} = require("../controllers/cropController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Rate limiting for uploads
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5, // 5 uploads per window
});

router.post(
  "/upload",
  auth,
  role(["farmer"]),
  uploadLimiter,
  upload,
  uploadCrop,
);
router.get("/my", auth, getMyCrops);
router.get("/available", auth, getAvailableCrops);
router.get("/:id", auth, getCropById);
router.get("/trace/:id", auth, traceCrop);
router.post("/progress", auth, role(["farmer"]), updateProgress);

module.exports = router;
