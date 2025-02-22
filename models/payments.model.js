const mongoose = require("mongoose");
const { PAYMENT_STATUS } = require("../utils/constant");

const paymentsSchema = new mongoose.Schema(
  {
    appointment_service_id: {
      type: mongoose.Types.ObjectId,
      ref: "appointment_services",
      required: true,
    },
    withdraw_request_id: {
      type: mongoose.Types.ObjectId,
    },
    transaction_id: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [PAYMENT_STATUS.CAPTURE, PAYMENT_STATUS.PENDING, PAYMENT_STATUS.REFUNDED],
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("payments", paymentsSchema);
