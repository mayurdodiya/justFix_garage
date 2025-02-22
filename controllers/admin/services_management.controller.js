const { UserModel, RoleModel, CategoriesModel, ServicesModel } = require("../../models/index.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const commonJs = require("../../utils/common.js");
const mongoose = require("mongoose");

module.exports = {
  // add category
  addCategory: async (req, res) => {
    try {
      const { name, description, image_url } = req.body;

      const obj = {
        name: name,
        description: description,
        image_url: image_url,
        is_active: true,
      };
      await CategoriesModel.create(obj);

      return apiResponse.OK({ res, message: MESSAGE.ADD_DATA("Category data") });
    } catch (error) {
      console.log("🚀 ~ addCategory: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // edit category by id
  editCategoryById: async (req, res) => {
    try {
      const categoryId = req.params.id;
      const { name, description, image_url } = req.body;

      const categoryExist = await CategoriesModel.findOne({ _id: categoryId, is_delete: false });
      if (!categoryExist) {
        return apiResponse.BAD_REQUEST({ res, message: MESSAGE.NO_DATA("This Category") });
      }

      const category = await CategoriesModel.findOne({ name: name, is_delete: false, _id: { $ne: categoryId } });
      if (category) {
        return apiResponse.BAD_REQUEST({ res, message: MESSAGE.DATA_EXIST("This Category") });
      }

      const obj = {
        name: name,
        description: description,
        image_url: image_url,
      };
      await CategoriesModel.updateOne({ _id: categoryId }, obj);

      return apiResponse.OK({ res, message: MESSAGE.ADD_DATA("Category data") });
    } catch (error) {
      console.log("🚀 ~ editCategoryById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // get all category
  getAllCategories: async (req, res) => {
    try {
      const { page, size, is_active, s } = req.query;

      const queryObj = {
        is_delete: false,
      };

      if (is_active != null) {
        queryObj.is_active = is_active;
      }

      const { skip, limit } = await commonJs.pagination(page, size);

      const count = await CategoriesModel.countDocuments(queryObj); // Count documents
      const data = await CategoriesModel.find(queryObj).select("_id name image_url").lean().limit(limit).skip(skip); // Fetch documents

      const response = await commonJs.paginData(count, data, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Category data"), data: response });
    } catch (error) {
      console.log("🚀 ~ getAllCategory: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // get category by id
  getCategoryById: async (req, res) => {
    try {
      const categoryId = req.params.id;
      const data = await CategoriesModel.findOne({ _id: categoryId, is_delete: false }).select("-__v -is_delete");
      if (!data) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("Category data") });
      }

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Category data"), data: data });
    } catch (error) {
      console.log("🚀 ~ getCategoryById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // delete category by id
  removeCategoryById: async (req, res) => {
    try {
      const categoryId = req.params.id;
      const data = await CategoriesModel.findOne({ _id: categoryId, is_delete: false });
      if (!data) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("This category") });
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        await CategoriesModel.updateOne({ _id: categoryId, is_delete: false }, { is_delete: true }, { session });
        await ServicesModel.updateMany({ category_id: categoryId, is_delete: false }, { is_delete: true }, { session });

        await session.commitTransaction();
        session.endSession();
        return apiResponse.OK({ res, message: MESSAGE.DELETE_DATA("Category & services data") });
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
      }
    } catch (error) {
      console.log("🚀 ~ removeCategoryById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // active / inactive category by id
  changeCategoryStatusById: async (req, res) => {
    try {
      const categoryId = req.params.id;
      const isActive = req.query.is_active
      const data = await CategoriesModel.findOne({ _id: categoryId, is_delete: false });
      if (!data) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("This category") });
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        await CategoriesModel.updateOne({ _id: categoryId, is_delete: false }, { is_active: isActive }, { session });
        await ServicesModel.updateMany({ category_id: categoryId, is_delete: false }, { is_active: isActive }, { session });

        await session.commitTransaction();
        session.endSession();
        return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Category & services data") });
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
      }
    } catch (error) {
      console.log("🚀 ~ changeCategoryStatusById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // add service
  addService: async (req, res) => {
    try {
      const { category_id, service_name, image_url } = req.body;

      const isCategory = await CategoriesModel.findById(category_id)
      if (!isCategory) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("This Category data") });
      }
      const obj = {
        category_id: category_id,
        service_name: service_name,
        image_url: image_url,
        is_active: true,
      };
      await ServicesModel.create(obj);

      return apiResponse.OK({ res, message: MESSAGE.ADD_DATA("Service data") });
    } catch (error) {
      console.log("🚀 ~ addService: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // edit service by id
  editServiceById: async (req, res) => {
    try {
      const serviceId = req.params.id;
      const { service_name, image_url } = req.body;

      const serviceExist = await ServicesModel.findOne({ _id: serviceId, is_delete: false });
      if (!serviceExist) {
        return apiResponse.BAD_REQUEST({ res, message: MESSAGE.NO_DATA("This Service") });
      }

      const service = await ServicesModel.findOne({ service_name: service_name, is_delete: false, _id: { $ne: serviceId } });
      if (service) {
        return apiResponse.BAD_REQUEST({ res, message: MESSAGE.DATA_EXIST("This Service") });
      }

      const obj = {
        service_name: service_name,
        image_url: image_url,
      };
      await ServicesModel.updateOne({ _id: serviceId }, obj);

      return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Service data") });
    } catch (error) {
      console.log("🚀 ~ editServiceById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // get service by id
  getServiceById: async (req, res) => {
    try {
      const serviceId = req.params.id;
      const data = await ServicesModel.findOne({ _id: serviceId, is_delete: false }).select("-__v -is_delete");
      if (!data) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("Service data") });
      }

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Service data"), data: data });
    } catch (error) {
      console.log("🚀 ~ getServiceById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // get all service
  getAllService: async (req, res) => {
    try {
      const { page, size, is_active, category_id, s } = req.query;

      const queryObj = {
        is_delete: false,
      };

      if (is_active != null) {
        queryObj.is_active = is_active;
      }
      if (category_id != null) {
        queryObj.category_id = category_id;
      }

      const { skip, limit } = await commonJs.pagination(page, size);

      const count = await ServicesModel.countDocuments(queryObj); // Count documents
      const data = await ServicesModel.find(queryObj).select("_id service_name image_url").lean().limit(limit).skip(skip); // Fetch documents

      const response = await commonJs.paginData(count, data, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Service data"), data: response });
    } catch (error) {
      console.log("🚀 ~ getAllService: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // delete service by id
  removeServicesById: async (req, res) => {
    try {
      const serviceId = req.params.id;

      const data = await ServicesModel.findOneAndUpdate({ _id: serviceId, is_delete: false }, { is_delete: true }, { new: true });
      if (!data) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("This service") });
      }

      return apiResponse.OK({ res, message: MESSAGE.DELETE_DATA("Service data") });
    } catch (error) {
      console.log("🚀 ~ removeServicesById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // active / inactive service by id
  changeServicesStatusById: async (req, res) => {
    try {
      const serviceId = req.params.id;
      const isActive = req.query.is_active

      const service = await ServicesModel.findByIdAndUpdate({ _id: serviceId, is_delete: false }, { is_active: isActive });
      if (!service) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA("This service") });
      }

      return apiResponse.OK({ res, message: MESSAGE.UPDATE_DATA("Services data") });
    } catch (error) {
      console.log("🚀 ~ changeServicesStatusById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

};
