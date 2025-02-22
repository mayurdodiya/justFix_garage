const mongoose = require("mongoose");

const ratingsSchema = new mongoose.Schema(
  {
    requested_garage_id: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    garage_id: {
      type: mongoose.Types.ObjectId,
      ref: "garage",
      required: true,
    },
    rate_score: {
      type: Number,
      required: true,
    },
    user_feedback: {
      type: String,
      required: true,
    },
    is_delete: { type: Boolean, default: false }, // deleted : 1, note delete: 0
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("ratings", ratingsSchema);
