const mongoose = require("mongoose");
const { USER_APPROVAL, PAYMENT_STATUS } = require("../utils/constant");

const appointmentServicesSchema = new mongoose.Schema(
  {
    garage_services: [
      {
        garage_service_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "garage_services",
          required: true,
        },
        garage_service_price: { // each services price
          type: Number,
          required: true,
        },
      },
    ],
    appointment_id: {
      type: mongoose.Types.ObjectId,
      ref: "appointments",
      required: true,
    },
    user_approval: {
      type: String,
      enum: [USER_APPROVAL.APPROVED, USER_APPROVAL.PENDING, USER_APPROVAL.DECLINED, USER_APPROVAL.CANCELLED],
      default: USER_APPROVAL.PENDING,
      required: true,
    },
    service_amount: { // total of all services
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    net_amount: {
      type: Number,
    },
    message: {
      type: String,
    },
    service_recommended_garage_id: {
      type: mongoose.Types.ObjectId,
      default: null,
      trim: true,
    },
    payment: {
      payment_status: {
        type: String,
        enum: [PAYMENT_STATUS.CAPTURE, PAYMENT_STATUS.PENDING, PAYMENT_STATUS.REFUNDED, PAYMENT_STATUS.FAILURE],
        default: PAYMENT_STATUS.PENDING,
      },
      transaction_id: {
        type: String,
        default: null,
      },
      message: {
        type: String,
        default: null,
      },
    },
    is_delete: { type: Boolean, default: false }, // deleted : 1, note delete: 0
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, versionKey: false }
);

// Auto-calculate net amount before saving
appointmentServicesSchema.pre("save", function (next) {
  if (this.service_amount) {
    const net_amount = this.service_amount - (this.service_amount * this.discount) / 100;
    this.net_amount = Math.round(net_amount * 100) / 100;
  }
  next();
});

appointmentServicesSchema.virtual("payments", {
  ref: "payments", // Reference to the appointment_services collection
  localField: "_id", // Field in the appointments collection
  foreignField: "appointment_service_id", // Field in the appointment_services collection
});

appointmentServicesSchema.set("toObject", { virtuals: true });
appointmentServicesSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("appointment_services", appointmentServicesSchema);
