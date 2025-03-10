const { RatingsModel, GarageModel, AppointmentsModel } = require("../../models/index.js");
const apiResponse = require("../../utils/api.response.js");
const { REVIEW_STATUS } = require("../../utils/constant.js");
const MESSAGE = require("../../utils/message.js");

module.exports = {
  // Rate garage and provide service feedback after service Complete
  addReviewToGarage: async (req, res) => {
    try {
      const userId = req.user._id;
      const { garage_id: garageId, rate_score, user_feedback } = req.body;

      const garageExist = await GarageModel.findOne({ _id: garageId, is_delete: false });
      if (!garageExist) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("This Garage") });
      }

      const appointment = await AppointmentsModel.findOne({ garage_id: garageId, user_id: userId, /* status: { $ne: APPOINTMENT_STATUS.PENDING }, */ is_delete: false });
      if (!appointment) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.GARAGE_NO_SERVICES_TAKEN });
      }

      await RatingsModel.create({ requested_garage_id: garageId, user_id: userId, rate_score: rate_score, user_feedback: user_feedback, status: REVIEW_STATUS.SUBMITTED });
      const countRating = await RatingsModel.find({ requested_garage_id: garageId, is_delete: false, status:  REVIEW_STATUS.SUBMITTED });
      const totalRatings = countRating.reduce((total, data) => total + data.rate_score, 0);
      const avg_ratings = totalRatings / countRating.length;

      await GarageModel.findByIdAndUpdate(garageId, { avg_ratings: avg_ratings });
      return apiResponse.OK({ res, message: MESSAGE.ADD_DATA("Feedback") });
    } catch (error) {
      console.log("🚀 ~ addReviewToGarage: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
