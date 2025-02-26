const { ROLE, OTP_TYPE } = require("../../utils/constant.js");
const commonJs = require("../../utils/common.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const { GarageModel, UserModel } = require("../../models/index.js");

module.exports = {
  // get garage by id
  getProfileById: async (req, res) => {
    try {
      const userId = req.user.id;
      const garage = await GarageModel.findOne({ user_id: userId }).select("-__v -is_delete").populate("user_id", "-__v -is_delete");

      if (!garage) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("This garage") });
      }
      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Garage data"), data: garage });
    } catch (error) {
      console.log("🚀 ~ getProfileById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // update garage
  editProfileById: async (req, res) => {
    try {
      const userId = req.user.id;

      await Promise.all([UserModel.findOneAndUpdate({ _id: userId }, { $set: { ...req.body } }, { new: true }), GarageModel.findOneAndUpdate({ user_id: userId }, { $set: { ...req.body } }, { new: true })]);

      return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Garage data") });
    } catch (error) {
      console.log("🚀 ~ editProfileById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

};
