const commonJs = require("../../utils/common.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const { UserModel } = require("../../models/index.js");

module.exports = {
  // get profile
  getProfile: async (req, res) => {
    try {
      const user = req.user;
      delete user.password;
      delete user.otp;
      delete user.fcm_token;
      delete user.is_social;
      delete user.is_delete;

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Profile data"), data: user });
    } catch (error) {
      console.log("🚀 ~ getProfile: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // update profile
  editProfileById: async (req, res) => {
    try {
      const userId = req.user._id;
      const { full_name } = req.body;
      const updateResult = await UserModel.updateOne({ _id: userId, is_delete: false }, { $set: { ...req.body } });

      if (updateResult.matchedCount === 0) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("This profile") });
      }
      return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Profile data") });
    } catch (error) {
      console.log("🚀 ~ editProfileById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // reset password
  resetPassword: async (req, res) => {
    try {
      const user = req.user;
      console.log(req.user._id)
      const { old_password, new_password, confirm_new_password } = req.body;
      console.log(old_password, user.password, "-------- old new confirm");
      const match = await commonJs.comparePassword(old_password, user.password);
      console.log(match, "-------- match");
      if (!match) {
        return apiResponse.UNAUTHORIZED({ res, message: MESSAGE.NOT_MATCH("Password") });
      }

      if (new_password !== confirm_new_password) {
        return apiResponse.BAD_REQUEST({ res, message: MESSAGE.NOT_MATCH("New Password & Confirm password") });
      }

      user.password = await commonJs.hashPassword(new_password);
      await user.save();

      return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Password") });
    } catch (error) {
      console.log("🚀 ~ resetPassword: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
