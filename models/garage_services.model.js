const mongoose = require("mongoose");

const garageServicesSchema = new mongoose.Schema(
  {
    service_id: {
      type: mongoose.Types.ObjectId,
      ref: "services",
      required: true,
    },
    garage_id: {
      type: mongoose.Types.ObjectId,
      ref: "garages",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    is_active: { type: Boolean, default: true },
    is_delete: { type: Boolean, default: false }, // deleted : 1, note delete: 0
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("garage_services", garageServicesSchema);
