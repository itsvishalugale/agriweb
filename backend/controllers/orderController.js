const Order = require("../models/Order");
const Crop = require("../models/Crop");
const { sendNotificationEmail } = require("../utils/emailNotifier");
const logger = require("../config/logger");

exports.placeOrder = async (req, res) => {
  try {
    const { cropId, quantity } = req.body;
    const crop = await Crop.findById(cropId).populate("farmer");
    if (!crop || !crop.available) {
      return res.status(400).json({ error: "Crop unavailable" });
    }

    const totalPrice = crop.price * quantity;
    const order = new Order({
      crop: cropId,
      buyer: req.user.id,
      farmer: crop.farmer._id,
      quantity,
      totalPrice,
    });
    await order.save();

    // Update crop availability
    crop.available = false;
    crop.traceHistory.push({ event: "Order placed", user: req.user.id });
    await crop.save();

    // Mock txHash
    order.txHash = `mock-tx-${Date.now()}`;

    // Notify buyer and farmer
    await sendNotificationEmail(
      req.user.email,
      "Order Placed!",
      `Your order for ${crop.name} is confirmed. Total: $${totalPrice}`,
    );
    await sendNotificationEmail(
      crop.farmer.email,
      "New Order!",
      `Buyer ${req.user.accountDetails.name} ordered ${quantity} of ${crop.name}.`,
    );

    res.status(201).json({ order: order.toJSON() });
  } catch (error) {
    logger.error("Place order error:", error);
    res.status(500).json({ error: "Order failed" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const role = req.user.role;
    const query =
      role === "buyer" ? { buyer: req.user.id } : { farmer: req.user.id };
    const orders = await Order.find(query)
      .populate("crop")
      .populate("buyer", "accountDetails.name email")
      .populate("farmer", "accountDetails.name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    logger.error("My orders fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, deliveryDetails } = req.body;

    const allowedStatuses = [
      "pending",
      "approved",
      "rejected",
      "shipped",
      "delivered",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const existingOrder = await Order.findOne({
      _id: req.params.id,
      farmer: req.user.id,
    });

    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const validTransitions = {
      pending: ["approved", "rejected"],
      approved: ["shipped"],
      shipped: ["delivered"],
    };

    if (
      validTransitions[existingOrder.status] &&
      !validTransitions[existingOrder.status].includes(status)
    ) {
      return res.status(400).json({
        error: `Cannot change status from ${existingOrder.status} to ${status}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        deliveryDetails,
        updatedAt: new Date(),
      },
      { new: true },
    ).populate("crop buyer farmer");

    await Crop.findByIdAndUpdate(order.crop._id, {
      $push: {
        traceHistory: {
          event: `Status: ${status}`,
          user: req.user.id,
        },
      },
    });

    if (order.buyer?.email) {
      await sendNotificationEmail(
        order.buyer.email,
        "Order Update",
        `Your order is now ${status}`,
      );
    }

    res.json(order.toJSON());
  } catch (error) {
    logger.error("Order status update error:", error);
    res.status(500).json({ error: "Update failed" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true },
    ).populate("crop");

    if (!order) return res.status(404).json({ error: "Order not found" });

    // Re-enable crop
    order.crop.available = true;
    await order.crop.save();

    res.json({ message: "Order cancelled", order: order.toJSON() });
  } catch (error) {
    logger.error("Cancel order error:", error);
    res.status(500).json({ error: "Cancellation failed" });
  }
};
