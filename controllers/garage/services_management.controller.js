const { ROLE, OTP_TYPE } = require("../../utils/constant.js");
const commonJs = require("../../utils/common.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const { GarageServicesModel } = require("../../models/index.js");

module.exports = {
  // get all service
  getAllService: async (req, res) => {
    try {
      const { page, size, is_active, s } = req.query;
      const garageId = req.params.id;
      const queryObj = {
        is_delete: false,
        garage_id: garageId,
      };

      const { skip, limit } = await commonJs.pagination(page, size);

      const count = await GarageServicesModel.countDocuments(queryObj); // Count documents
      const data = await GarageServicesModel.find(queryObj).select("_id price service_id is_active").populate("service_id", "_id service_name image_url").limit(limit).skip(skip); // Fetch documents

      const response = await commonJs.paginData(count, data, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Garage service data"), data: response });
    } catch (error) {
      console.log("🚀 ~ getAllService: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // add service
  addService: async (req, res) => {
    try {
      const { service_id, price, garage_id } = req.body;
      const queryObj = {
        service_id: service_id,
        price: price,
        garage_id: garage_id,
      };

      await GarageServicesModel.create(queryObj);
      return apiResponse.OK({ res, message: MESSAGE.ADD_DATA("Garage service data") });
    } catch (error) {
      console.log("🚀 ~ addService: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // update service
  editServiceById: async (req, res) => {
    try {
      const { price } = req.body;
      const serviceId = req.params.id;

      const updateResult = await GarageServicesModel.updateOne({ _id: serviceId, is_delete: false }, { $set: { price } });

      if (updateResult.matchedCount === 0) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("This service") });
      }
      return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Garage service data") });
    } catch (error) {
      console.log("🚀 ~ updateService: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // get service by id
  getServiceById: async (req, res) => {
    try {
      const serviceId = req.params.id;

      const service = await GarageServicesModel.findById(serviceId);

      if (!service) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("This service") });
      }
      return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Garage service data"), data: service });
    } catch (error) {
      console.log("🚀 ~ updateService: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // delete service by id
  removeServiceById: async (req, res) => {
    try {
      const serviceId = req.params.id;

      const updateResult = await GarageServicesModel.updateOne({ _id: serviceId, is_delete: false }, { $set: { is_delete: true } });

      if (updateResult.matchedCount === 0) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("This service") });
      }
      return apiResponse.OK({ res, message: MESSAGE.DELETE_DATA("Garage service data") });
    } catch (error) {
      console.log("🚀 ~ updateService: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // active in active service status
  changeServicesStatusById: async (req, res) => {
    try {
      const serviceId = req.params.id;
      const isActive = req.query.is_active;
      const service = await GarageServicesModel.findByIdAndUpdate({ _id: serviceId }, { is_active: isActive }, { new: true });

      if (service == null) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("This service") });
      }

      return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Status") });
    } catch (error) {
      console.log("🚀 ~ changeServicesStatusById: ~ error:", error);
      // Logger.error("error generating", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
