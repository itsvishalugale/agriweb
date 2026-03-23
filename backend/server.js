require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const logger = require("./config/logger"); // ← fixed logger

const connectDB = require("./config/db");

connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/crops", require("./routes/cropRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// Socket.io real-time (optional – keep if you use notifications)
io.on("connection", (socket) => {
  logger.info("User connected:", socket.id);

  socket.on("disconnect", () => {
    logger.info("User disconnected:", socket.id);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(err.stack || err.message);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
