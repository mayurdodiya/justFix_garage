const mongoose = require("mongoose");
const { WITHDRAW_REQUESTS_STATUS } = require("../utils/constant");

const withdrawRequestSchema = new mongoose.Schema(
  {
    garage_id: {
      type: mongoose.Types.ObjectId,
      ref: "garage",
      required: true,
    },
    withdrow_amount: {
      type: Number,
      required: true,
    },
    payment_id: {
      type: mongoose.Types.ObjectId,
      ref: "payments",
    },
    status: {
      type: String,
      enum: [WITHDRAW_REQUESTS_STATUS.REQUESTED, WITHDRAW_REQUESTS_STATUS.CREDITED, WITHDRAW_REQUESTS_STATUS.CANCELLED, WITHDRAW_REQUESTS_STATUS.REJECTED],
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("withdraw_requests", withdrawRequestSchema);
