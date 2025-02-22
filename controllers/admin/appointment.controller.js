const { UserModel, RoleModel, AppointmentsModel, AppointmentServicesModel } = require("../../models/index.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const commonJs = require("../../utils/common.js");
const { ROLE } = require("../../utils/constant.js");
const invoicePdf = require("../../utils/invoice.pdf.js");
const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");
const { modifyGetAppointmentServiceList } = require("../../utils/modify.response.js");

module.exports = {
  // list of booking of customer by id
  getAppointmentListOfCustomer: async (req, res) => {
    try {
      const userId = req.params.id;
      const { page, size, status, s } = req.query;

      const queryObj = {
        user_id: userId,
      };

      if (status) {
        queryObj.status = status;
      }

      const { skip, limit } = await commonJs.pagination(page, size);
      const count = await AppointmentsModel.countDocuments(queryObj); // Count documents
      const data = await AppointmentsModel.find(queryObj).select("-__v -is_delete").lean().limit(limit).skip(skip);

      const response = await commonJs.paginData(count, data, page, limit);

      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Customer appointment"), data: response });
    } catch (error) {
      console.log("🚀 ~ getAppointmentListOfCustomer: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // list of services of each appointment with transaction & inovice details
  getAppointmentServiceList: async (req, res) => {
    try {
      const appointmentId = req.params.id;
      const { page, size } = req.query;

      const queryObj = { appointment_id: appointmentId, is_delete: false };

      // Get pagination data before Promise.all
      const { skip, limit } = await commonJs.pagination(page, size);

      // Execute database queries in parallel
      const [appointmentData, count, services] = await Promise.all([
        AppointmentsModel.findOne({ _id: appointmentId, is_delete: false })
          .select("-is_delete")
          .populate([
            { path: "user_id", select: "_id full_name phone_no email" },
            {
              path: "garage_id",
              select: "_id garage_name",
              populate: { path: "user_id", select: "_id full_name email phone_no" },
            },
            { path: "vehicle_id" },
          ])
          .lean(),
        AppointmentServicesModel.countDocuments(queryObj),
        AppointmentServicesModel.find(queryObj)
          .select("_id appointment_id user_approval garage_service_id")
          .populate([
            { path: "payments", select: "_id amount transaction_id status" },
            {
              path: "garage_service_id",
              select: "_id service_id",
              populate: { path: "service_id", select: "_id service_name" },
            },
          ])
          .limit(limit)
          .skip(skip)
          .lean(),
      ]);

      const response = {
        appointment_data: appointmentData,
        appointment_services: await commonJs.paginData(count, services, page, limit),
      };

      const responseModify = await modifyGetAppointmentServiceList(response);
      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Customer appointment"), data: responseModify });
    } catch (error) {
      console.error("🚀 ~ getAppointmentServiceListXYZ: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // generate invoice pdf  ( optimized pending )
  pdfGenerate: async (req, res) => {
    try {
      const appointmentId = "67b32aa99e48e85268b5754a";
      const { page, size, s } = req.query;

      const queryObj = {
        appointment_id: appointmentId,
        is_delete: false,
      };
      let response = {};

      response.appointment_data = await AppointmentsModel.findOne({ _id: appointmentId, is_delete: false })
        .select("-is_delete")
        .populate([{ path: "user_id", select: "_id full_name phone_no email" }, { path: "garage_id", select: "_id garage_name", populate: [{ path: "user_id", select: "_id full_name email phone_no" }] }, { path: "vehicle_id" }])
        .lean();
      const populate = [
        { path: "payments", select: "_id amount transaction_id status" },
        { path: "garage_service_id", select: "_id service_id", populate: { path: "service_id", select: "_id service_name" } },
      ];
      const { skip, limit } = await commonJs.pagination(page, size);
      const count = await AppointmentServicesModel.countDocuments(queryObj);
      const data = await AppointmentServicesModel.find(queryObj).select("_id appointment_id user_approval garage_service_id").populate(populate).limit(limit).skip(skip).lean();
      response.appointment_services = await commonJs.paginData(count, data, page, limit);

      const responseModify = await modifyGetAppointmentServiceList(response);

      // Sample Data
      const invoiceData = {
        appointmentId: responseModify.appointment_data._id,
        invoiceDate: Date.now(),
        user: {
          name: responseModify.appointment_data.user_data.full_name,
          phone: responseModify.appointment_data.user_data.phone_no,
          email: responseModify.appointment_data.user_data.email,
        },
        garage: {
          name: responseModify.appointment_data.garage_data.garage_name,
          // phone:responseModify.appointment_data.garage_data.phone_no,
          // email:responseModify.appointment_data.garage_data.email,
          location: "Surat, Gujarat",
        },
        services: [
          { name: responseModify.appointment_services.data[0].service_name, charge: responseModify.appointment_services.data[0].service_charge, status: responseModify.appointment_services.data[0].user_approval, transactionId: responseModify.appointment_services.data[0].transaction_id },
          { name: responseModify.appointment_services.data[1].service_name, charge: responseModify.appointment_services.data[1].service_charge, status: responseModify.appointment_services.data[1].user_approval, transactionId: responseModify.appointment_services.data[1].transaction_id },
        ],
        // user: { name: "Mayur dodiya", phone: "9876543210", email: "Mayur@example.com" },
        // garage: { name: "AutoFix Garage", location: "Surat, Gujarat" },
        // services: [
        //   { name: "Oil Change", charge: 100, status: "Completed", transactionId: "ziuoqjupqgr" },
        //   { name: "Wash", charge: 100, status: "Completed", transactionId: "zlismijupqgr" },
        // ],
        totalPaid: 200,
      };

      // // Sample Data
      // const invoiceData = {
      //   invoiceDate: "2025-02-20",
      //   user: { name: "Mayur dodiya", phone: "9876543210", email: "Mayur@example.com" },
      //   garage: { name: "AutoFix Garage", location: "Surat, Gujarat" },
      //   appointmentId: "APPT12345",
      //   services: [
      //     { name: "Oil Change", charge: 100, status: "Completed", transactionId: "ziuoqjupqgr" },
      //     { name: "Wash", charge: 100, status: "Completed", transactionId: "zlismijupqgr" },
      //   ],
      //   totalPaid: 200,
      // };

      // Generate Invoice
      await invoicePdf.generateInvoice(invoiceData);
      // generateInvoice(invoiceData);
      return apiResponse.OK({ res, message: MESSAGE.ADD_DATA("Pdf") });
    } catch (error) {
      console.log("🚀 ~ pdfGenerate: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
