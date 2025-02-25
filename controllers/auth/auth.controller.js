const { ROLE, OTP_TYPE } = require("../../utils/constant.js");
const commonJs = require("../../utils/common.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const { UserModel, GarageModel, OtpModel, RoleModel } = require("../../models/index.js");
const emailTemplate = require("../../templates/email.template.js");
const emailService = require("../../services/nodemailer.js");
const { Logger } = require("winston");
const mongoose = require("mongoose");

module.exports = {
  // user/garage manual signUp
  signup: async (req, res) => {
    try {
      const { role, email, is_social, profile_image, google_id, full_name, country_code, phone_no, password } = req.body;

      let user = await UserModel.findOne({ email: email, is_active: true });
      if (user) {
        return apiResponse.DUPLICATE_VALUE({ res, message: MESSAGE.DATA_EXIST("Email") });
      }

      if (phone_no) {
        let isPhone = await UserModel.findOne({ phone_no: phone_no, is_active: true });
        if (isPhone) {
          return apiResponse.DUPLICATE_VALUE({ res, message: MESSAGE.DATA_EXIST("Phone no") });
        }
      }

      if (role == ROLE.ADMIN) {
        return apiResponse.BAD_REQUEST({ res, message: MESSAGE.ADMIN_CREATION_RESTRICTED });
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const roleId = await commonJs.findRoleId(res, role);
        const obj = {
          role_id: roleId,
          is_active: true,
          full_name: full_name,
          email: email,
          password: await commonJs.hashPassword({ password }),
          profile_image: profile_image,
          is_social: false,
          google_id: google_id,
          country_code: country_code,
          phone_no: phone_no,
        };
        user = await UserModel.create([obj], { session });

        if (role === ROLE.GARAGE) {
          const { garage_name } = req.body;
          const garageObj = {
            user_id: user[0]._id,
            garage_name: garage_name,
            is_active: true,
          };
          await GarageModel.create([garageObj], { session });
        }
        await session.commitTransaction();
        session.endSession();
        return apiResponse.OK({ res, message: MESSAGE.REGISTER("You are") });
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
      }
    } catch (error) {
      console.log("🚀 ~ userSignup: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  findUserRole: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("Email") });
      }

      const role = await RoleModel.findOne({ _id: user.role_id });
      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Role"), data: role.role });
    } catch (error) {
      console.log("🚀 ~ findUserRole: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // user/garage signin(through app & socialy) / user/garage signup(through socialy)
  signin: async (req, res) => {
    try {
      const { role, email, is_social, profile_image, google_id, full_name, phone_no, password } = req.body;
      let user = await UserModel.findOne({ email: email, is_active: true });

      // user sign up with google
      if (!user && is_social == true) {
        if (role == ROLE.ADMIN) {
          return apiResponse.BAD_REQUEST({ res, message: MESSAGE.ADMIN_CREATION_RESTRICTED });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        const roleId = await commonJs.findRoleId(res, role);
        try {
          const obj = {
            role_id: roleId,
            is_active: true,
            full_name: full_name,
            email: email,
            password: null,
            profile_image: profile_image,
            is_social: true,
            google_id: google_id,
            phone_no: phone_no,
          };
          const userData = await UserModel.create([obj], { session });
          user = userData[0];

          if (role === ROLE.GARAGE) {
            const { garage_name } = req.body;
            const garageObj = {
              user_id: user._id,
              garage_name: garage_name,
              is_active: true,
            };
            await GarageModel.create([garageObj], { session });
          }
          await session.commitTransaction();
          session.endSession();
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
        }
      } else if (is_social == false) {
        // user login through app
        if (!user) {
          return apiResponse.UNAUTHORIZED({ res, message: MESSAGE.NO_DATA("Email") });
        }
        const pwdMatch = await commonJs.comparePassword({ password, hashPwd: user.password });
        if (!pwdMatch) {
          return apiResponse.UNAUTHORIZED({ res, message: MESSAGE.NO_DATA("Password") });
        }
      }

      user = user.toObject();
      user.token = commonJs.generateToken({ user_id: user._id, role_id: user.role_id });
      delete user.password;

      return apiResponse.OK({ res, message: MESSAGE.LOG_IN, data: user });
    } catch (error) {
      console.log("🚀 ~ userSignin: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // send otp for forgot password
  sendOtp: async (req, res) => {
    try {
      const { email, otp_type } = req.body;
      const emailExist = await UserModel.findOne({ email, is_delete: false }).populate("role_id");

      if (!emailExist) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NOT_REGISTER("Email") });
      }

      const otpObj = await commonJs.generateOtp();
      await OtpModel.findOneAndUpdate({ user_id: emailExist._id, otp_type: otp_type }, { $set: { otp: otpObj.otp_token, otp_type: otp_type, user_id: emailExist._id, email: email } }, { upsert: true });
      await emailService.sendMail(email, "Forgot password", emailTemplate.sendOTP(email, otpObj.otp));

      return apiResponse.OK({ res, message: MESSAGE.SENT("Otp") });
    } catch (err) {
      Logger.error("error generating", err);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // verify otp
  verifyOtp: async (req, res) => {
    try {
      const { email, otp, otp_type } = req.body;
      const otpData = await OtpModel.findOne({ email, otp_type: otp_type, is_delete: false });

      if (!otpData) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NOT_MATCH("Otp") });
      }

      const compairOtp = commonJs.decodeToken({ token: otpData.otp });
      if (compairOtp == "token_expire") {
        return apiResponse.UNAUTHORIZED({ res, message: MESSAGE.EXPIRED("Otp") });
      }
      if (compairOtp == "invalid_token") {
        return apiResponse.UNAUTHORIZED({ res, message: MESSAGE.INVALID("Otp") });
      }
      if (compairOtp.otp == otp) {
        let user = await UserModel.findOne({ email: email, is_active: true });
        const token = commonJs.generateToken({ user_id: user._id, role_id: user.role_id });
        return apiResponse.OK({ res, message: MESSAGE.MATCH("Otp"), data: token });
      }
    } catch (err) {
      console.log(err);
      // Logger.error("error generating", err);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // set new password
  setPassword: async (req, res) => {
    try {
      const user = req.user;
      const { password, confirm_password } = req.body;

      if (confirm_password != password) {
        return apiResponse.BAD_REQUEST({ res, message: MESSAGE.NOT_MATCH("compare password and password") });
      }
      const hashPwd = await commonJs.hashPassword({ password });
      await UserModel.updateOne({ _id: user._id }, { password: hashPwd });
      return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Password") });
    } catch (err) {
      console.log(err);
      Logger.error("error generating", err);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
