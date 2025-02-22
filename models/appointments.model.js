const mongoose = require("mongoose");
const { APPOINTMENT_STATUS } = require("../utils/constant");

const appointmentsSchema = new mongoose.Schema(
  {
    vehicle_id: {
      type: mongoose.Types.ObjectId,
      ref: "vehicles",
      required: true,
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
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.IN_PROGRESS, APPOINTMENT_STATUS.DECLINED, APPOINTMENT_STATUS.COMPLETED, APPOINTMENT_STATUS.CANCELLED],
      default: APPOINTMENT_STATUS.PENDING,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // Only "Point" type is allowed
      },
      coordinates: {
        type: [Number], // Array of [longitude, latitude]
      },
    },
    is_delete: { type: Boolean, default: false }, // deleted : 1, note delete: 0
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("appointments", appointmentsSchema);


appointmentsSchema.virtual("appointment_services", {
  ref: "appointment_services", // Reference to the appointment_services collection
  localField: "_id", // Field in the appointments collection
  foreignField: "appointment_id", // Field in the appointment_services collection
});

appointmentsSchema.set("toObject", { virtuals: true });
appointmentsSchema.set("toJSON", { virtuals: true });
