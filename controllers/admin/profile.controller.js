const commonJs = require("../../utils/common.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const { UserModel, AdminWalletModel } = require("../../models/index.js");

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

      adminWallet = await AdminWalletModel.findOne({ user_id: user._id }).select('-_id -created_at -updated_at');
      user.admin_wallet = adminWallet;

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
      const { old_password, new_password, confirm_new_password } = req.body;
      
      if (new_password !== confirm_new_password) {
        return apiResponse.BAD_REQUEST({ res, message: MESSAGE.NOT_MATCH("New Password & Confirm password") });
      }

      const [isMatch, newHashPwd] = await Promise.all([
        commonJs.comparePassword({ password: old_password, hashPwd: user.password }),
        commonJs.hashPassword({ password: new_password }),
      ]);

      if (!isMatch) {
        return apiResponse.UNAUTHORIZED({ res, message: MESSAGE.NOT_MATCH("Old Password") });
      }

      await UserModel.findOneAndUpdate({ _id: user._id }, { $set: { password: newHashPwd } });

      return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Password") });
    } catch (error) {
      console.log("🚀 ~ resetPassword: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
