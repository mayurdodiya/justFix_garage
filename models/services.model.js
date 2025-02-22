const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
      required: function () {
        return this.isNew; // Only required on creation
      },
    },
    service_name: {
      type: String,
      trim: true,
      required: true,
    },
    image_url: {
      type: String,
    },
    is_active: { type: Boolean, default: true },
    is_delete: { type: Boolean, default: false }, // deleted : 1, note delete: 0
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("services", servicesSchema);
