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
      default: null,
    },
    transaction_id: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    admin_fees: {
      type: Number,
    },
    net_withdrawable_amount: {
      type: Number,
    },
    status: {
      type: String,
      enum: [PAYMENT_STATUS.CAPTURE, PAYMENT_STATUS.PENDING, PAYMENT_STATUS.REFUNDED],
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Auto-calculate admin_fees before saving
paymentsSchema.pre("save", function (next) {
  if (this.amount) {
    this.admin_fees = Math.round(this.amount * process.env.ADMIN_FEES * 100) / 100; // 10% of amount
  }
  if (this.amount && this.admin_fees) {
    this.net_withdrawable_amount = Number((this.amount - this.admin_fees).toFixed(2));
  }
  next();
});

module.exports = mongoose.model("payments", paymentsSchema);
