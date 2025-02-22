const { ROLE, OTP_TYPE } = require("../../utils/constant.js");
const commonJs = require("../../utils/common.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const { VehiclesModel, AppointmentsModel } = require("../../models/index.js");

module.exports = {
  // add new vehicle of user
  addVehicle: async (req, res) => {
    try {
      const user = req.user;
      const { vehicle_type, company, model_name, year, license_plate, chassis_number, fuel_type, images } = req.body;
      const vehicle = await VehiclesModel.findOne({ license_plate: license_plate, user_id: user._id });
      if (vehicle) {
        return apiResponse.BAD_REQUEST({ res, message: MESSAGE.DATA_EXIST("This Vehicle") });
      }

      await VehiclesModel.create({ user_id: user._id, ...req.body });
      return apiResponse.OK({ res, message: MESSAGE.ADD_DATA("Vehicle") });
    } catch (error) {
      console.log("🚀 ~ addVehicle: ~ error:", error);
      // Logger.error("error generating", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // edit user vehicle by id
  editVehicle: async (req, res) => {
    try {
      const user = req.user;
      const { vehicle_type, company, model_name, year, license_plate, chassis_number, fuel_type, images } = req.body;
      const vehicaleId = req.params.id;
      const vehicle = await VehiclesModel.findOne({ _id: vehicaleId });
      if (!vehicle) {
        return apiResponse.BAD_REQUEST({ res, message: MESSAGE.NO_DATA("This Vehicle") });
      }

      const checkExistNumberPlate = await VehiclesModel.findOne({ license_plate: license_plate, $ne: { user_id: user._id } });
      if (checkExistNumberPlate) {
        return apiResponse.BAD_REQUEST({ res, message: MESSAGE.DATA_EXIST("This number plate") });
      }

      await VehiclesModel.update({ _id: vehicaleId }, { ...req.body });
      return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Vehicle") });
    } catch (error) {
      console.log(error);
      console.log("🚀 ~ editVehicle: ~ error:", error);
      // Logger.error("error generating", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // delete user vehicle by id
  deleteVehicle: async (req, res) => {
    try {
      const vehicaleId = req.params.id;
      const vehicle = await VehiclesModel.findOne({ _id: vehicaleId });
      if (!vehicle) {
        return apiResponse.BAD_REQUEST({ res, message: MESSAGE.NO_DATA("This Vehicle") });
      }

      await VehiclesModel.update({ _id: vehicaleId }, { is_delete: true });
      return apiResponse.OK({ res, message: MESSAGE.DELETE_DATA("Vehicle") });
    } catch (error) {
      console.log(error);
      // Logger.error("error generating ", error);
      console.log("🚀 ~ deleteVehicle: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // get user vehicle by id
  getVehicleById: async (req, res) => {
    try {
      const vehicaleId = req.params.id;
      const vehicle = await VehiclesModel.findOne({ _id: vehicaleId });
      if (!vehicle) {
        return apiResponse.BAD_REQUEST({ res, message: MESSAGE.NO_DATA("This Vehicle") });
      }

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Vehicle"), data: vehicle });
    } catch (error) {
      console.log("🚀 ~ getVehicleById: ~ error:", error);
      // Logger.error("error generating", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // get user all vehicle
  getAllVehicle: async (req, res) => {
    try {
      const userId = req.user._id;
      const { page, size, s } = req.query;

      const { skip, limit } = await commonJs.pagination(page, size);

      const count = await VehiclesModel.countDocuments({ is_delete: false, user_id: userId }); // Count documents
      const vehicles = await VehiclesModel.find({ is_delete: false, user_id: userId }).limit(limit).skip(skip).exec(); // Fetch documents

      const response = await commonJs.paginData(count, vehicles, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Vehicle"), data: response });
    } catch (error) {
      console.log("🚀 ~ getAllVehicle: ~ error:", error);
      // Logger.error("error generating", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // get all booking list
  getAppointmentList: async (req, res) => {
    try {
      const userId = req.user._id;
      console.log(userId);

      const { page, size, status, s } = req.query;
      const { vehicle_id } = req.body;

      const { skip, limit } = await commonJs.pagination(page, size);

      const populate = [
        { path: "user_id", select: "full_name" },
        { path: "vehicle_id", select: "model_name" },
        { path: "garage_id", select: "garage_name avg_ratings" },
      ];
      const count = await AppointmentsModel.countDocuments({ is_delete: false, user_id: userId }); // Count documents
      const data = await AppointmentsModel.find({ is_delete: false, user_id: userId, vehicle_id: vehicle_id, status: status }).populate(populate).limit(limit).skip(skip).exec(); // Fetch documents

      const response = await commonJs.paginData(count, data, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Appointment"), data: response });
    } catch (error) {
      console.log("🚀 ~ getAppointmentList: ~ error:", error);
      // Logger.error("error generating", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
