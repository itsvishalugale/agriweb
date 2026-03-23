const mongoose = require("mongoose");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
  defaultMeta: { service: "user-service" },
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connected successfully");
    console.log("MongoDB connected");
  } catch (error) {
    logger.error("DB connection error:", error);
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
