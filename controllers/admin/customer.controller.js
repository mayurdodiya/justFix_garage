const { UserModel, RoleModel, AppointmentsModel, VehiclesModel } = require("../../models/index.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const commonJs = require("../../utils/common.js");
const { ROLE } = require("../../utils/constant.js");

module.exports = {
  // list of all customer
  getAllCustomer: async (req, res) => {
    try {
      const { page, size, is_active, s } = req.query;
      const role = await RoleModel.findOne({ role: ROLE.USER });

      const queryObj = {
        is_delete: false,
      };

      if (is_active != null) {
        queryObj.is_active = is_active;
      }

      const { skip, limit } = await commonJs.pagination(page, size);

      const count = await UserModel.countDocuments(queryObj); // Count documents
      const data = await UserModel.find({ is_delete: false, role_id: role._id }).select("-__v -is_delete -password").lean().limit(limit).skip(skip);

      const response = await commonJs.paginData(count, data, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Customer data"), data: response });
    } catch (error) {
      console.log("🚀 ~ getAllCustomer: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // active in active garage status
  changeUserStatus: async (req, res) => {
    try {
      const userId = req.params.id;
      const isActive = req.query.is_active;
      const user = await UserModel.findByIdAndUpdate({ _id: userId, is_delete: false }, { is_active: isActive }, { new: true });

      if (user == null) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("This User") });
      }

      return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Status") });
    } catch (error) {
      console.log("🚀 ~ changeUserStatus: ~ error:", error);
      // Logger.error("error generating", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // view customer details by id
  getCustomerById: async (req, res) => {
    try {
      const userId = req.params.id;
      const data = await UserModel.findOne({ _id: userId }).select("-__v -is_delete -password");
      if (!data) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("Customer") });
      }
      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Customer"), data: data });
    } catch (error) {
      console.log("🚀 ~ getCustomerById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // list of added vehicles of customer
  getVehiclesListOfCustomer: async (req, res) => {
    try {
      const userId = req.params.id;
      const { page, size, status, s } = req.query;

      const queryObj = {
        user_id: userId,
        is_delete: false,
      };

      const { skip, limit } = await commonJs.pagination(page, size);
      const count = await VehiclesModel.countDocuments(queryObj); // Count documents
      const data = await VehiclesModel.find(queryObj).select("_id user_id model_name vehicle_type").lean().limit(limit).skip(skip);

      const response = await commonJs.paginData(count, data, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Customer vehicales data"), data: response });
    } catch (error) {
      console.log("🚀 ~ getVehiclesListOfCustomer: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
