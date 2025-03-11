const mongoose = require("mongoose");

const adminWalletSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    admin_earned_amount: {
      type: Number,
      required: true,
      default: 0,
    },
    admin_total_withdrawal: {
      type: Number,
      required: true,
      default: 0,
    },
    garage_user_earned_amount: {
      type: Number,
      required: true,
      default: 0,
    },
    garage_user_total_withdrawal: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, versionKey: false }
);

module.exports = mongoose.model("admin_wallets", adminWalletSchema);
