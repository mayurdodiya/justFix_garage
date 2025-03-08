const mongoose = require("mongoose");
const { PAYMENT_STATUS } = require("../utils/constant");

const paymentsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    garage_id: {
      type: mongoose.Types.ObjectId,
      ref: "garages",
    },
    appointment_service_id: {
      type: mongoose.Types.ObjectId,
      ref: "appointment_services",
    },
    withdraw_request_id: {
      type: mongoose.Types.ObjectId,
      ref: "withdraw_requests",
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
      enum: [PAYMENT_STATUS.CAPTURE, PAYMENT_STATUS.PENDING, PAYMENT_STATUS.REFUNDED, PAYMENT_STATUS.FAILURE],
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Auto-calculate admin_fees before saving
paymentsSchema.pre("save", function (next) {
  if (this.withdraw_request_id == null) {
    if (this.amount) {
      this.admin_fees = Math.round(this.amount * process.env.ADMIN_FEES * 100) / 100; // 10% of amount
    }
    if (this.amount && this.admin_fees) {
      this.net_withdrawable_amount = Number((this.amount - this.admin_fees).toFixed(2));
    }
  }else{
    if (this.amount) {
      this.admin_fees = 0
      this.net_withdrawable_amount = this.amount;
    }
  }
  next();
});

module.exports = mongoose.model("payments", paymentsSchema);
