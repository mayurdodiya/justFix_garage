const { AppointmentsModel, AppointmentServicesModel, GarageServicesModel } = require("../../models/index.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const commonJs = require("../../utils/common.js");
const { USER_APPROVAL } = require("../../utils/constant.js");

module.exports = {
  // list of appointments
  getAppointmentListOfGarage: async (req, res) => {
    try {
      const garageId = req.params.id;
      const { page, size, status, is_active, s } = req.query;

      const queryObj = {
        garage_id: garageId,
        is_delete: false,
      };

      if (status) {
        queryObj.status = status;
      }

      if (is_active) {
        queryObj.is_active = is_active;
      }

      const { skip, limit } = await commonJs.pagination(page, size);
      const [count, data] = await Promise.all([
        AppointmentsModel.countDocuments(queryObj), // Count documents
        AppointmentsModel.find(queryObj).select("-__v -is_delete").lean().limit(limit).skip(skip),
      ]);

      const response = await commonJs.paginData(count, data, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Garage appointment"), data: response });
    } catch (error) {
      console.log("🚀 ~ getAppointmentListOfGarage: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // accept reject booking
  acceptRejectBooking: async (req, res) => {
    try {
      const appointmentId = req.params.id;
      const status = req.query.status;
      const data = await AppointmentsModel.findOneAndUpdate({ _id: appointmentId }, { status: status }, { new: true });
      console.log(data, "----------------------");

      if (data == null) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("Garage appointment") });
      }

      return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Garage appointment status") });
    } catch (error) {
      console.log("🚀 ~ acceptRejectBooking: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // edit service price & able to add service for new adjustment and send for customer approvel
  addServiceForCustomerApproval: async (req, res) => {
    try {
      const garageId = req.params.id;
      const appointmentId = req.query.appointment_id;
      let { garage_service_id, message, discount } = req.body;

      const garageServicePrice = await GarageServicesModel.findOne({ _id: garage_service_id, is_delete: false });
      if (!garageServicePrice) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("Garage service") });
      }

      await AppointmentServicesModel.create({
        appointment_id: appointmentId,
        garage_service_id: garage_service_id,
        service_recommended_garage_id: garageId,
        user_approval: USER_APPROVAL.PENDING,
        service_amount: garageServicePrice.price,
        discount: discount == null || discount == undefined || discount < 0 ? 0 : discount,
        message: message,
      });

      return apiResponse.OK({ res, message: MESSAGE.ADD_DATA("Appointment service request") });
    } catch (error) {
      console.log("🚀 ~ addServiceForCustomerApproval: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
