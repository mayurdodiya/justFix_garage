const { UserModel, RoleModel, AppointmentsModel, AppointmentServicesModel } = require("../../models/index.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const commonJs = require("../../utils/common.js");
const { ROLE } = require("../../utils/constant.js");
const invoicePdf = require("../../utils/invoice.pdf.js");
const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");
const moment = require('moment')
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
      console.error("🚀 ~ getAppointmentServiceList: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // download invoice of appointment by id
  downloadInvoicePdf: async (req, res) => {
    try {
      const { page, size, appointmentId } = req.query;
      // ?appointmentId=67b32aa99e48e85268b5754a

      if (appointmentId == null) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.REQUIRED("appointmentId") });
      }

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

      let serviceData = []
      responseModify.appointment_services.data.map((item) => {
        const obj = {
          name: item.service_name,
          charge: item.service_charge,
          status: item.user_approval,
          transactionId: item.transaction_id,
        }
        serviceData.push(obj)
      })

      // Sample Data
      const invoiceData = {
        appointmentId: responseModify.appointment_data._id,
        invoiceDate: moment(new Date()).format('D/MM/YYYY'),
        user: {
          name: responseModify.appointment_data.user_data.full_name,
          phone: responseModify.appointment_data.user_data.phone_no,
          email: responseModify.appointment_data.user_data.email,
        },
        garage: {
          name: responseModify.appointment_data.garage_data.garage_name,
          phone: responseModify.appointment_data.garage_data.phone_no,
          email: responseModify.appointment_data.garage_data.email,
        },
        services: serviceData,
        totalPaid: responseModify.appointment_services.total_bill,
      };



      // Generate Invoice
      await invoicePdf.generateInvoice(invoiceData);
      const pdfPath = await path.join(__dirname, '..', '..', 'invoice.pdf')
      return res.download(pdfPath, 'invoice.pdf', (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Error downloading invoice");
        }
      });

      // return apiResponse.OK({ res, message: MESSAGE.ADD_DATA("Pdf") });
    } catch (error) {
      console.log("🚀 ~ pdfGenerate: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
