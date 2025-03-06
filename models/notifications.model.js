const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema(
  {
    receiver_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    title: {
      type: String,
      default: null,
    },
    message: {
      type: String,
      default: null,
    },
    image_url: {
      type: String,
      default: null,
    },
    is_delete: { type: Boolean, default: false }, // deleted : 1, note delete: 0
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("notifications", notificationsSchema);
