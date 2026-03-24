const Crop = require("../models/Crop");
const { sendNotificationEmail } = require("../utils/emailNotifier");
const logger = require("../config/logger"); // ✅ FIXED
const crypto = require("crypto"); // ✅ NEW

// Mock AI prediction
const predictCropProgress = () => {
  const stages = ["seedling", "vegetative", "flowering", "mature"];
  return {
    stage: stages[Math.floor(Math.random() * stages.length)],
    confidence: Number((Math.random() * 100).toFixed(2)),
  };
};

exports.uploadCrop = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const imageFilename = req.file.filename;

    const progress = predictCropProgress();

    // ✅ GENERATE UNIQUE batchId
    const batchId = `BATCH-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

    const crop = new Crop({
      name,
      description,
      price: Number(price),
      imageFilename,
      farmer: req.user.id,
      batchId, // ✅ FIXED
      progress,
      traceHistory: [{ event: "Crop uploaded", user: req.user.id }],
    });

    await crop.save();

    await sendNotificationEmail(
      req.user.email,
      "Crop Uploaded Successfully",
      `Your crop "${name}" has been added. Batch ID: ${batchId}`,
    );

    res.status(201).json({ crop });
  } catch (error) {
    logger.error("Upload crop error:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
};

exports.getMyCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user.id })
      .populate("farmer", "accountDetails")
      .sort({ createdAt: -1 });

    res.json(crops);
  } catch (error) {
    logger.error("My crops fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAvailableCrops = async (req, res) => {
  try {
    const { search, minPrice, maxPrice } = req.query;

    let query = { available: true };

    if (search) query.$text = { $search: search };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const crops = await Crop.find(query)
      .populate("farmer", "accountDetails.name location")
      .sort({ createdAt: -1 });

    res.json(crops);
  } catch (error) {
    logger.error("Available crops fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate("farmer");

    if (!crop) {
      return res.status(404).json({ error: "Crop not found" });
    }

    res.json(crop.toJSON());
  } catch (error) {
    logger.error("Crop fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.traceCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate(
      "traceHistory.user",
      "accountDetails.name",
    );

    if (!crop) {
      return res.status(404).json({ error: "Crop not found" });
    }

    crop.traceHistory.push({
      event: "Trace accessed",
      user: req.user.id,
    });

    await crop.save();

    res.json({
      batchId: crop.batchId, // ✅ IMPORTANT
      traceHistory: crop.traceHistory,
    });
  } catch (error) {
    logger.error("Trace crop error:", error);
    res.status(500).json({ error: "Trace failed" });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { cropId } = req.body;

    const progress = predictCropProgress();

    const crop = await Crop.findOneAndUpdate(
      { _id: cropId, farmer: req.user.id },
      { progress, updatedAt: new Date() },
      { new: true },
    );

    if (!crop) {
      return res.status(404).json({ error: "Crop not found" });
    }

    res.json({ progress });
  } catch (error) {
    logger.error("Progress update error:", error);
    res.status(500).json({ error: "Update failed" });
  }
};
exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user.id, // ✅ security
    });

    if (!crop) {
      return res.status(404).json({ error: "Crop not found" });
    }

    res.json({ message: "Crop deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
};
exports.updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user.id },
      {
        name: req.body.name,
        price: req.body.price,
        updatedAt: new Date(),
      },
      { returnDocument: "after" },
    );

    if (!crop) {
      return res.status(404).json({ error: "Crop not found" });
    }

    res.json({ crop });
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};
