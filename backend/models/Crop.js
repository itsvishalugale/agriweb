const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    imageFilename: { type: String, required: true },

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ FIXED: batchId added properly
    batchId: {
      type: String,
      required: true,
      unique: true,
    },

    available: { type: Boolean, default: true },

    traceHistory: [
      {
        event: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

    progress: {
      stage: {
        type: String,
        enum: ["seedling", "vegetative", "flowering", "mature"],
      },
      confidence: { type: Number, min: 0, max: 100 },
      updatedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true },
);

cropSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Crop", cropSchema);
