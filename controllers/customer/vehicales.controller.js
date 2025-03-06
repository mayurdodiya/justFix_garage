const { ROLE, OTP_TYPE } = require("../../utils/constant.js");
const commonJs = require("../../utils/common.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const { VehiclesModel } = require("../../models/index.js");

module.exports = {
  // get all vehicle
  getAllVehicle: async (req, res) => {
    try {
      const { page, size, s } = req.query;
      const userId = req.req._id;
      const queryObj = {
        is_delete: false,
        user_id: userId,
      };

      const { skip, limit } = await commonJs.pagination(page, size);

      const count = await VehiclesModel.countDocuments(queryObj); // Count documents
      const data = await VehiclesModel.find(queryObj).limit(limit).skip(skip);

      const response = await commonJs.paginData(count, data, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Vehicle data"), data: response });
    } catch (error) {
      console.log("🚀 ~ getAllVehicle: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // add vehicle
  addVehicle: async (req, res) => {
    try {
      const userId = req.req._id;
      const queryObj = {
        ...req.body,
        user_id: userId,
      };

      await VehiclesModel.create(queryObj);
      return apiResponse.OK({ res, message: MESSAGE.ADD_DATA("Vehicle data") });
    } catch (error) {
      console.log("🚀 ~ addVehicle: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // update vehicle
  editVehicleById: async (req, res) => {
    try {
      const vehicleId = req.params.id;

      const updateResult = await VehiclesModel.updateOne({ _id: vehicleId, is_delete: false }, { $set: { ...req.body } });

      if (updateResult.matchedCount === 0) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("This vehicle") });
      }
      return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Vehicle data") });
    } catch (error) {
      console.log("🚀 ~ editVehicleById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // get vehicle by id
  getVehicleById: async (req, res) => {
    try {
      const vehicleId = req.params.id;

      const vehicle = await VehiclesModel.findById(vehicleId);

      if (!vehicle) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("This vehicle") });
      }
      return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Vehicle data"), data: vehicle });
    } catch (error) {
      console.log("🚀 ~ getVehicleById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // delete vehicle by id
  removeVehicleById: async (req, res) => {
    try {
      const vehicleId = req.params.id;

      const updateResult = await VehiclesModel.updateOne({ _id: vehicleId, is_delete: false }, { $set: { is_delete: true } });

      if (updateResult.matchedCount === 0) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("This vehicle") });
      }
      return apiResponse.OK({ res, message: MESSAGE.DELETE_DATA("Vehicle data") });
    } catch (error) {
      console.log("🚀 ~ removeVehicleById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

};
