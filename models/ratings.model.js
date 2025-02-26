const mongoose = require("mongoose");
const { REVIEW_STATUS } = require("../utils/constant");

const ratingsSchema = new mongoose.Schema(
  {
    requested_garage_id: {
      type: mongoose.Types.ObjectId,
      ref: "garages",
      default: null,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    rate_score: {
      type: Number,
      default: null,
    },
    user_feedback: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: [REVIEW_STATUS.REQUESTED, REVIEW_STATUS.SUBMITTED, REVIEW_STATUS.REJECTED, REVIEW_STATUS.CANCELLED],
      default: REVIEW_STATUS.REQUESTED,
      required: true,
    },
    is_delete: { type: Boolean, default: false }, // deleted : 1, note delete: 0
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("ratings", ratingsSchema);
