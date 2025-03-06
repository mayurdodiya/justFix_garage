const { UserModel, RoleModel, CategoriesModel, ServicesModel, GarageModel } = require("../../models/index.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const commonJs = require("../../utils/common.js");
const mongoose = require("mongoose");

module.exports = {
  // Search mechanics by location, service type, or rating
  getAllMechanic: async (req, res) => {
    try {
      const { page, size, s, longitude, latitude } = req.query;

      let queryObj = {
        is_delete: false,
        is_active: true,
        locationCoordinates: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude], // [Longitude, Latitude]
            },
            $maxDistance: 1000, // 10 KM
          },
        },
      };

      if (s) {
        queryObj.$or = [{ garage_name: s }, { location: s }, { specialities: { $in: s } }];
      }

      const { skip, limit } = await commonJs.pagination(page, size);
      const data = await GarageModel.find(queryObj).select("-__v -is_delete -locationCoordinates -is_active ").limit(limit).skip(skip);
      const response = await commonJs.paginData(data.length, data, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Garage data"), data: response });
    } catch (error) {
      console.log("🚀 ~ getAllMechanic: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // View mechanic profiles, services, pricing, and availability
  getMechanic: async (req, res) => {
    try {
      const id = req.params.id;
      const populate = {
        path: "garage_services",
        select: "-is_delete",
        match: { is_active: true },
        populate: {
          path: "service_id",
          select: "service_name",
        },
      };
      const data = await GarageModel.findById(id).select("garage_name").populate(populate);
      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Garage profile"), data });
    } catch (error) {
      console.log("🚀 ~ getMechanic: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
