const mongoose = require("mongoose");

const adminWalletSchema = new mongoose.Schema(
  {
    total_amount: {
      type: Number,
      required: true,
    },
    admin_earned_amount: {
      type: Number,
      required: true,
    },
    garage_user_earned_amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("admin_wallets", adminWalletSchema);
