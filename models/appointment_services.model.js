const mongoose = require("mongoose");
const { USER_APPROVAL } = require("../utils/constant");

const appointmentServicesSchema = new mongoose.Schema(
  {
    garage_service_id: {
      type: mongoose.Types.ObjectId,
      ref: "garage_services",
      required: true,
    },
    appointment_id: {
      type: mongoose.Types.ObjectId,
      ref: "appointments",
      required: true,
    },
    user_approval: {
      type: String,
      enum: [USER_APPROVAL.APPROVE, USER_APPROVAL.PENDING, USER_APPROVAL.DECLINED, USER_APPROVAL.CANCELLED],
      default: USER_APPROVAL.PENDING,
      required: true,
    },
    message: {
      type: String,
    },
    service_recommended_garage_id: {
      type: mongoose.Types.ObjectId,
      default: null,
      trim: true,
    },
    is_delete: { type: Boolean, default: false }, // deleted : 1, note delete: 0
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("appointment_services", appointmentServicesSchema);


appointmentServicesSchema.virtual("payments", {
  ref: "payments", // Reference to the appointment_services collection
  localField: "_id", // Field in the appointments collection
  foreignField: "appointment_service_id", // Field in the appointment_services collection
});

appointmentServicesSchema.set("toObject", { virtuals: true });
appointmentServicesSchema.set("toJSON", { virtuals: true });
