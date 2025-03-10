const mongoose = require("mongoose");
const validator = require("validator");
const { ROLE } = require("../utils/constant.js");

const userSchema = new mongoose.Schema(
  {
    role_id: {
      type: mongoose.Types.ObjectId,
      ref: "roles",
      default: ROLE.USER,
      required: true,
    },
    is_active: { type: Boolean, default: true, required: true },
    full_name: {
      type: String,
      required: true,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    country_code: {
      type: String,
      required: false,
      trim: true,
    },
    phone_no: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      default: null, // Default value as null
      required: false, // Not required
      minlength: 6, // Minimum length if provided
      validate(value) {
        if (value && (!value.match(/\d/) || !value.match(/[a-zA-Z]/))) {
          throw new Error("Password must contain at least one letter and one number");
        }
      },
    },
    profile_image: { type: String, default: null },
    otp: { type: String, default: null },
    permissions: {
      notificaton: {
        type: Boolean,
        default: true,
      },
      location: {
        type: Boolean,
        default: false,
      },
    },
    fcm_token: { type: String, default: null },
    is_social: { type: Boolean, default: false },
    google_id: { type: String, default: null },
    is_delete: { type: Boolean, default: false }, // deleted : 1, note delete: 0
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, versionKey: false }
);

module.exports = mongoose.model("users", userSchema);
