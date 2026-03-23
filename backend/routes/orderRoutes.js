const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  placeOrder,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

router.post("/place", auth, role(["buyer"]), orderLimiter, placeOrder);
router.get("/my", auth, getMyOrders);
router.put("/:id/status", auth, role(["farmer"]), updateOrderStatus);
router.delete("/:id/cancel", auth, role(["buyer"]), cancelOrder);

module.exports = router;
