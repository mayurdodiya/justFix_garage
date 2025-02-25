const mongoose = require("mongoose");

const garageSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    garage_name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"], // Only "Point" type is allowed
        // required: true,
      },
      coordinates: {
        type: [Number], // Array of [longitude, latitude]
        // required: true,
      },
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    address: {
      locality: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },
    opening_time: { type: Date },
    closing_time: { type: Date },
    certificate: { type: [String], default: [] },
    specialities: { type: [String], default: [] },
    avg_ratings: { type: Number, default: 0, min: 0, max: 5 },
    wallet_amount: { type: Number, default: 0, min: 0 },
    bank_details: {
      account_holder_name: {
        type: String,
        trim: true,
      },
      branch_name: {
        type: String,
        trim: true,
      },
      account_number: {
        type: String,
        trim: true,
      },
      ifsc_code: {
        type: String,
        trim: true,
      },
    },
    is_active: { type: Boolean, default: true },
    is_delete: { type: Boolean, default: false }, // deleted : 1, note delete: 0
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("garages", garageSchema);
