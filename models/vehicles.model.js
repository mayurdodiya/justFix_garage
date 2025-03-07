const mongoose = require("mongoose");
const { FULE_TYPE } = require("./../utils/constant.js");

const vehicleSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    vehicle_type: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    model_name: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      trim: true,
    },
    license_plate: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    chassis_number: {
      type: String,
      trim: true,
      unique: true,
    },
    fuel_type: {
      type: String,
      enum: [FULE_TYPE.PETROL, FULE_TYPE.DIESEL, FULE_TYPE.CNG, FULE_TYPE.ELECTRIC],
      required: true,
      trim: true,
    },
    images: {
      type: [String],
    },
    created_at: {
      type: String,
    },
    updated_at: {
      type: String,
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Vehicle = mongoose.model("vehicles", vehicleSchema);
module.exports = Vehicle;
