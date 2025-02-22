const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
    },
    image_url: {
      type: String,
    },
    is_active: { type: Boolean, default: true },
    is_delete: { type: Boolean, default: false }, // deleted : 1, note delete: 0
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("categories", categoriesSchema);
