const { ROLE, OTP_TYPE } = require("../../utils/constant.js");
const commonJs = require("../../utils/common.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const { NotificationsModel } = require("../../models/index.js");

module.exports = {
  // get all notification
  getAllNotification: async (req, res) => {
    try {
      const id = req.user._id;
      const queryObj = {
        is_delete: false,
        receiver_id: id,
      };

      const data = await NotificationsModel.find(queryObj).select("_id title description image_url");
      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Notification data"), data: data });
    } catch (error) {
      console.log("🚀 ~ getAllNotification ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
