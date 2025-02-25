const { UserModel, RoleModel, AppointmentsModel, ServicesModel, PaymentsModel, GarageServicesModel, AppointmentServicesModel } = require("../../models/index.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const commonJs = require("../../utils/common.js");
const mongoose = require("mongoose");
const { APPOINTMENT_STATUS, ROLE } = require("../../utils/constant.js");

module.exports = {
  // count of all booking appointment by (daily, weekly, monthly)
  countAllBookedAppointment: async (req, res) => {
    try {
      const { start_date, end_date } = req.query;

      const queryObj = {
        is_delete: false,
      };
      queryObj.created_at = { $gte: new Date(start_date), $lte: new Date(end_date) };
      const countAppoinement = await AppointmentsModel.countDocuments(queryObj);
      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Appointment data"), data: countAppoinement });
    } catch (error) {
      console.log("🚀 ~ countAllBookedAppointment: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // count of all sales by (daily, weekly, monthly)
  countAllSales: async (req, res) => {
    try {
      const { start_date, end_date } = req.query;

      const queryObj = {};
      queryObj.created_at = { $gte: new Date(start_date), $lte: new Date(end_date) };
      const countSales = await PaymentsModel.countDocuments(queryObj);
      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Sales data"), data: countSales });
    } catch (error) {
      console.log("🚀 ~ countAllSalesAmmount: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // list of top 5 mechanic based on appointment completed
  listTop5Garage: async (req, res) => {
    try {
      const aggData = await AppointmentsModel.aggregate([
        {
          $match: { is_delete: false, status: APPOINTMENT_STATUS.COMPLETED },
        },
        {
          $group: {
            _id: "$garage_id",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "garages",
            localField: "_id",
            foreignField: "_id",
            as: "garage_details",
          },
        },
        {
          $project: {
            "garage_details._id": 1,
            "garage_details.user_id": 1,
            "garage_details.garage_name": 1,
            "garage_details.avg_ratings": 1,
            "garage_details.wallet_amount": 1,
            "garage_details.is_active": 1,
            "garage_details.created_at": 1,
            total_completed_appointments: "$count",
          },
        },
        {
          $unwind: "$garage_details",
        },
        {
          $lookup: {
            from: "users",
            localField: "garage_details.user_id",
            foreignField: "_id",
            as: "user_details",
          },
        },
        {
          $unwind: "$user_details",
        },
        {
          $project: {
            _id: 1,
            garage_name: "$garage_details.garage_name",
            avg_ratings: "garage_details.avg_ratings",
            wallet_amount: "garage_details.wallet_amount",
            is_active: "garage_details.is_active",
            phone_no: "user_details.phone_no",
            total_completed_appointments: "$total_completed_appointments",
            created_at: "$garage_details.created_at",
          },
        },
        {
          $sort: { created_at: 1 },
        },
        {
          $sort: { total_completed_appointments: -1 },
        },
        {
          $limit: 5,
        },
      ]);
      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Top five garage data"), data: aggData });
    } catch (error) {
      console.log("🚀 ~ listTop5Garage: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // list of top 5 customer based on booking
  listTop5Customer: async (req, res) => {
    try {
      const aggData = await AppointmentsModel.aggregate([
        {
          $match: { is_delete: false },
        },
        {
          $group: {
            _id: "$user_id",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user_details",
          },
        },
        {
          $unwind: "$user_details",
        },
        {
          $project: {
            _id: "$_id",
            full_name: "$user_details.full_name",
            phone_no: "$user_details.phone_no",
            email: "$user_details.email",
            created_at: "$user_details.created_at",
            total_booked_appointments: "$count",
          },
        },
        {
          $sort: { created_at: 1 },
        },
        {
          $sort: { total_booked_appointments: -1 },
        },
        {
          $limit: 5,
        },
      ]);
      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Top five customer data"), data: aggData });
    } catch (error) {
      console.log("🚀 ~ listTop5Customer: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // Today's new user count
  newIncomingUserCount: async (req, res) => {
    try {
      const todayDate = new Date();
      const startOfDay = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()); // 2025-02-21T00:00:00.000Z
      const endOfDay = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 1); // 2025-02-22T00:00:00.000Z

      const aggData = await UserModel.aggregate([
        {
          $match: { created_at: { $gte: startOfDay, $lte: endOfDay } },
        },
        {
          $lookup: {
            from: "roles",
            localField: "role_id",
            foreignField: "_id",
            as: "role_details",
          },
        },
        {
          $unwind: "$role_details",
        },
        {
          $match: { "role_details.role": ROLE.USER },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            today_new_users: "$count",
          },
        },
      ]);
      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Today's new user data"), data: aggData });
    } catch (error) {
      console.log("🚀 ~ newIncomingUserCount: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // Today's new garage user count
  newIncomingGarageCount: async (req, res) => {
    try {
      const todayDate = new Date();
      const startOfDay = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()); // 2025-02-21T00:00:00.000Z
      const endOfDay = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 1); // 2025-02-22T00:00:00.000Z

      const aggData = await UserModel.aggregate([
        {
          $match: { created_at: { $gte: startOfDay, $lte: endOfDay } },
        },
        {
          $lookup: {
            from: "roles",
            localField: "role_id",
            foreignField: "_id",
            as: "role_details",
          },
        },
        {
          $unwind: "$role_details",
        },
        {
          $match: { "role_details.role": ROLE.GARAGE },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            today_new_users: "$count",
          },
        },
      ]);
      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Today's new garage user data"), data: aggData });
    } catch (error) {
      console.log("🚀 ~ newIncomingGarageCount: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // list top 10 repted services
  listTop10ReptedServices: async (req, res) => {
    try {
      const aggData = await AppointmentServicesModel.aggregate([
        {
          $match: { is_delete: false },
        },
        // {
        //   $group: {
        //     _id: "$service_id",
        //     count: { $sum: 1 },
        //   },
        // },
        {
          $lookup: {
            from: "garage_services",
            localField: "garage_service_id",
            foreignField: "_id",
            as: "garage_services_details",
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "garage_services_details.service_id",
            foreignField: "_id",
            as: "services_details",
          },
        },
        {
          $unwind: "$services_details",
        },
        {
          $project: {
            _id: 1,
            service_id: "$services_details._id",
            service_name: "$services_details.service_name",
            // count: "$count",
          },
        },
        {
          $group: {
            _id: "$service_id",
            service_name: { $first: "$service_name" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
        {
          $limit: 10,
        },
        {
          $project:{
            _id:1,
            service_name:1,
            service_usage_total:'$count'
          }
        }
      ]);
      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Top 10 services data"), data: aggData });
    } catch (error) {
      console.log("🚀 ~ listTop10ReptedServices: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
