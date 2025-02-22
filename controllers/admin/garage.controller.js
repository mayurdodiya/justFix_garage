const { WithdrawRequestsModel, RatingsModel, GarageModel, AppointmentsModel, GarageServicesModel } = require("../../models");
const apiResponse = require("../../utils/api.response");
const MESSAGE = require("../../utils/message");
const commonJs = require("../../utils/common.js");

module.exports = {

  // list of all garage
  getAllGarage: async (req, res) => {
    try {
      const { page, size, is_active, s } = req.query;

      const queryObj = {
        is_delete: false,
      };

      if (is_active != null) {
        queryObj.is_active = is_active;
      }

      const { skip, limit } = await commonJs.pagination(page, size);

      const count = await GarageModel.countDocuments(queryObj); // Count documents
      const data = await GarageModel.find(queryObj).select("_id user_id garage_name is_active images").lean().limit(limit).skip(skip); // Fetch documents

      const response = await commonJs.paginData(count, data, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Garage"), data: response });
    } catch (error) {
      console.log("🚀 ~ getAllGarage: ~ error:", error);
      // Logger.error("error generating", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // active in active garage status
  changeGarageStatus: async (req, res) => {
    try {
      const garageId = req.params.id;
      const isActive = req.query.is_active;
      const garage = await GarageModel.findByIdAndUpdate({ _id: garageId, is_delete: false }, { is_active: isActive }, { new: true });

      if (garage == null) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("This Garage") });
      }

      return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Status") });
    } catch (error) {
      console.log("🚀 ~ changeGarageStatus: ~ error:", error);
      // Logger.error("error generating", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // get garage information
  getGarageById: async (req, res) => {
    try {
      const garageId = req.params.id;
      const data = await GarageModel.findOne({ _id: garageId, is_delete: false }).select("-__v -is_delete").populate("user_id", "_id full_name phone_no ");
      if (!data) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("This garage") });
      }

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Garage data"), data: data });
    } catch (error) {
      console.log("🚀 ~ getGarageById: ~ error:", error);
      // Logger.error("error generating", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // list of booking of garage by status( pending, accepted )
  getAppointmentListOfGarage: async (req, res) => {
    try {
      const garageId = req.params.id;
      const { page, size, status, s } = req.query;

      const { skip, limit } = await commonJs.pagination(page, size);
      const populate = [{ path: "garage_id", select: "garage_name avg_ratings" }];
      const count = await AppointmentsModel.countDocuments({ is_delete: false, garage_id: garageId }); // Count documents
      const data = await AppointmentsModel.find({ is_delete: false, garage_id: garageId, status: status }).populate(populate).limit(limit).skip(skip).exec(); // Fetch documents

      const response = await commonJs.paginData(count, data, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Appointment"), data: response });
    } catch (error) {
      console.log("🚀 ~ getAppointmentListOfGarage: ~ error:", error);
      // Logger.error("error generating", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // view all reviews of the mechanic from customers
  getReviewOfGarageById: async (req, res) => {
    try {
      const garageId = req.params.id;
      const { page, size, s } = req.query;

      const { skip, limit } = await commonJs.pagination(page, size);
      const populate = [
        { path: "garage_id", select: "garage_name avg_ratings" },
        { path: "user_id", select: "full_name" },
      ];
      const count = await RatingsModel.countDocuments({ is_delete: false, garage_id: garageId }); // Count documents
      const data = await RatingsModel.find({ is_delete: false, garage_id: garageId }).select("-is_delete").populate(populate).limit(limit).skip(skip).exec(); // Fetch documents

      const response = await commonJs.paginData(count, data, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("user ratings data"), data: response });
    } catch (error) {
      console.log("🚀 ~ getReviewOfGarageById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // view withdraw request list
  getAllWithdrawRequests: async (req, res) => {
    try {
      const garageId = req.params.id;
      const { page, size, status, s } = req.query;

      const { skip, limit } = await commonJs.pagination(page, size);

      const queryObj = {
        garage_id: garageId,
      };
      if (status) {
        queryObj.status = status;
      }

      const populate = [
        { path: "garage_id", select: "garage_name avg_ratings" },
        //   { path: "user_id", select: "full_name" },
      ];
      const count = await WithdrawRequestsModel.countDocuments(queryObj); // Count documents
      const data = await WithdrawRequestsModel.find(queryObj).populate(populate).limit(limit).skip(skip).exec(); // Fetch documents

      const response = await commonJs.paginData(count, data, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Garage Withdraw requests data"), data: response });
    } catch (error) {
      console.log("🚀 ~ getAllWithdrawRequests: ~ error:", error);
      // Logger.error("error generating", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // list of services of garage with his price
  getAllServicesOfGarage: async (req, res) => {
    try {
      const garageId = req.params.id;
      const { page, size, s } = req.query;

      const { skip, limit } = await commonJs.pagination(page, size);
      const populate = [
        { path: "garage_id", select: "garage_name avg_ratings" },
        { path: "service_id", select: "service_name category_id" },
      ];
      const count = await GarageServicesModel.countDocuments({ is_delete: false, garage_id: garageId }); // Count documents
      const data = await GarageServicesModel.find({ is_delete: false, garage_id: garageId }).select("-is_delete").populate(populate).limit(limit).skip(skip).exec(); // Fetch documents
      console.log(data, "---------------data");

      const response = await commonJs.paginData(count, data, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Garage services data"), data: response });
    } catch (error) {
      console.log("🚀 ~ getAllServicesOfGarage: ~ error:", error);
      // Logger.error("error generating", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
