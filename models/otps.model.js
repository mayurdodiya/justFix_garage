const { boolean } = require("joi");
const mongoose = require("mongoose");

const otpSchema = mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    otp_type: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    is_delete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Otp = mongoose.model("otps", otpSchema);
module.exports = Otp;
