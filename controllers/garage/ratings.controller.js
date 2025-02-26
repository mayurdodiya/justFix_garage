const { RatingsModel, GarageModel, AppointmentsModel, UserModel } = require("../../models/index.js");
const apiResponse = require("../../utils/api.response.js");
const commonJs = require("../../utils/common.js");
const { REVIEW_STATUS } = require("../../utils/constant.js");
const MESSAGE = require("../../utils/message.js");

module.exports = {
  // request customer reviews after service
  sendReviewRequest: async (req, res) => {
    try {
      const garageId = req.params.id;
      const { user_id } = req.body;

      const garageExist = await GarageModel.findOne({ _id: garageId, is_delete: false });
      if (!garageExist) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("This Garage") });
      }

      const isUserExist = await UserModel.findOne({ _id: user_id, is_delete: false, is_active: true });
      if (!isUserExist) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("This User") });
      }

      await RatingsModel.create({ requested_garage_id: garageId, user_id: user_id, status: REVIEW_STATUS.REQUESTED });

      return apiResponse.OK({ res, message: MESSAGE.SENT_REQUEST("Review request") });
    } catch (error) {
      console.log("🚀 ~ sendReviewRequest: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // list of reviews and ratings
  listOfRatings: async (req, res) => {
    try {
      const garageId = req.params.id;
      const { page, size, s, status } = req.query;

      const garageExist = await GarageModel.findOne({ _id: garageId, is_delete: false });
      if (!garageExist) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("This Garage") });
      }

      let queryObj = {
        requested_garage_id: garageId,
        is_delete: false,
      };
      if (status) {
        queryObj.status = status;
      }

      const { skip, limit } = await commonJs.pagination(page, size);
      const [count, data] = await Promise.all([RatingsModel.countDocuments(queryObj), RatingsModel.find(queryObj).select("-__v -is_delete").limit(limit).skip(skip)]);

      const response = await commonJs.paginData(count, data, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Reviews data"), data: response });
    } catch (error) {
      console.log("🚀 ~ listOfRatings: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
