const { GarageModel, AppointmentsModel, AppointmentServicesModel, GarageServicesModel, VehiclesModel, PaymentsModel } = require("../../models/index.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const commonJs = require("../../utils/common.js");
const { APPOINTMENT_STATUS, USER_APPROVAL, PAYMENT_STATUS } = require("../../utils/constant.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { modifyAppointmentForCustomerInvoice } = require("../../utils/modify.response.js");
const path = require("path");
const invoicePdf = require("../../utils/invoice.pdf");
const moment = require('moment')


module.exports = {
  // Search mechanics by location, service type, or rating
  getAllGarage: async (req, res) => {
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
      console.log("🚀 ~ getAllGarage: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // View mechanic profiles, services, pricing, and availability
  getGarageById: async (req, res) => {
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
      console.log("🚀 ~ getGarageById: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // Create and Book services with specific mechanics or the nearest available
  bookAppointment: async (req, res) => {
    try {
      const userId = req.user._id;
      console.log(userId, "------------------- userId");
      const { longitude, latitude, garage_services, message, vehicle_id, garage_id } = req.body;

      const isVehicalExist = await VehiclesModel.findOne({ _id: vehicle_id, user_id: userId, is_delete: false, is_active: true });
      console.log(isVehicalExist, "------------------- isVehicalExist");
      if (!isVehicalExist) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("This Vehicle") });
      }

      const isGarageExist = await GarageModel.findOne({ _id: garage_id, is_delete: false, is_active: true });
      console.log(isGarageExist, "------------------- isGarageExist");
      if (!isGarageExist) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("This Garage") });
      }

      const garageServices = await GarageServicesModel.find({ _id: { $in: garage_services }, is_delete: false, is_active: true }).lean();
      console.log(garageServices, "------------------- garageServices");
      if (!garageServices.length) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.FOUND("No valid Garage services") });
      }

      const unmatchedServices = garage_services.filter((serviceId) => !garageServices.some((data) => data._id.toString() === serviceId.toString()));
      console.log(unmatchedServices, "------------------- unmatchedServices");
      if (unmatchedServices.length) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND(`${unmatchedServices} this Garage services`) });
      }

      const queryObj = {
        ...req.body,
        user_id: userId,
        status: APPOINTMENT_STATUS.PENDING,
        locationCoordinates: {
          coordinates: [longitude, latitude],
        },
      };
      console.log(queryObj, "------------------- queryObj");
      let bookAppointment = await AppointmentsModel.create(queryObj);
      console.log(bookAppointment, "------------------- bookAppointment");

      const garageServiceModify = garageServices.map((data) => {
        return {
          garage_service_id: data._id,
          garage_service_price: data.price,
        };
      });

      const totalAmount = garageServices.reduce((sum, data) => sum + data.price, 0);
      const appointmentServicesObj = {
        garage_services: garageServiceModify,
        appointment_id: bookAppointment._id,
        user_approval: USER_APPROVAL.APPROVED,
        service_amount: totalAmount,
        discount: 0,
        net_amount: totalAmount,
        message: message,
      };
      console.log(appointmentServicesObj, "------------------- appointmentServicesObj");
      const appointmentServices = await AppointmentServicesModel.create(appointmentServicesObj);
      console.log(appointmentServices, "------------------- appointmentServices");

      bookAppointment.appointment_services = appointmentServices;
      return apiResponse.OK({ res, message: MESSAGE.SENT_REQUEST("Your appointment request"), data: bookAppointment });
    } catch (error) {
      console.log("🚀 ~ bookAppointment: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // Payment after Booking req accepted from garage
  createPayment: async (req, res) => {
    try {
      const userId = req.user._id;
      console.log(userId, "------------------- userId");

      const appointment_service_id = req.params.id;

      const isAppointmentServiceExist = await AppointmentServicesModel.findOne({ _id: appointment_service_id, is_delete: false });
      if (!isAppointmentServiceExist) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("This Appointment service") });
      }

      const appointment = await AppointmentsModel.findOne({ _id: isAppointmentServiceExist.appointment_id, user_id: userId, is_delete: false });
      if (!appointment) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("This Appointment") });
      }

      if (appointment.status == APPOINTMENT_STATUS.PENDING) {
        return apiResponse.BAD_REQUEST({ res, message: MESSAGE.GARAGE_PENDING_REQUEST });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "inr",
              unit_amount: isAppointmentServiceExist.net_amount * 100, // convert 1 inr to paise
              product_data: {
                name: "One-Time Payment",
                description: "This is a one-time purchase",
              },
            },
          },
        ],
        payment_intent_data: {
          metadata: {
            user_id: userId.toString(),
            garage_id: appointment.garage_id.toString(),
            appointment_service_id: appointment_service_id,
            amount: isAppointmentServiceExist.net_amount,
          },
        },
      });

      if (!session) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.GENERATED("Payment link not") });
      }

      return apiResponse.OK({ res, message: MESSAGE.GENERATED("Payment link"), data: { url: session.url } });
    } catch (error) {
      console.log("🚀 ~ createPayment: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // Webhook for Stripe ( call after create payment )
  webhook: async (req, res) => {
    try {
      const event = req.body;
      const paymentObj = event?.data?.object;
      console.log(event, "-------------------------------------- event");

      switch (event.type) {
        case "payment_intent.succeeded":
          console.log("✅ Payment Successful:", paymentObj);

          const metaData = paymentObj?.metadata;
          const queryObj = {
            user_id: metaData?.user_id,
            garage_id: metaData?.garage_id,
            appointment_service_id: metaData?.appointment_service_id,
            transaction_id: paymentObj?.id,
            amount: paymentObj?.amount / 100,
            status: PAYMENT_STATUS.CAPTURE,
          };
          const payment = await PaymentsModel.create(queryObj);
          await AppointmentServicesModel.findOneAndUpdate(
            { _id: metaData?.appointment_service_id },
            {
              $set: { "payment.payment_status": PAYMENT_STATUS.CAPTURE, "payment.transaction_id": paymentObj?.id, "payment.message": "payment successfully capture" },
            }
          );
          console.log(payment, "---------------------------- : Payment Successful! ✅");
          break;

        case "payment_intent.payment_failed":
          console.log("❌ Payment Failed:", paymentObj);

          await AppointmentServicesModel.findOneAndUpdate(
            { _id: metaData?.appointment_service_id },
            {
              $set: { "payment.payment_status": PAYMENT_STATUS.FAILURE, "payment.message": paymentObj?.last_payment_error?.message },
            }
          );
          break;

        default:
          console.log("Unhandled event:", event.type);
      }

      return res.sendStatus(200);
    } catch (error) {
      console.log("🚀 ~ webhook: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // vehicles wise appointment listing
  appointmentList: async (req, res) => {
    try {
      const userId = req.user._id;
      const { vehicle_id } = req.query;
      const queryObj = {
        user_id: userId,
        is_delete: false,
      };
      if (vehicle_id) {
        queryObj.vehicle_id = vehicle_id;
      }

      const populate = [
        {
          path: "garage_id",
          select: "_id garage_name locationCoordinates",
        },
        {
          path: "vehicle_id",
          select: "_id model_name company license_plate fuel_type",
        },
        {
          path: "appointment_services",
          select: "_id payment garage_services message user_approval service_amount discount net_amount",
          populate: [
            {
              path: "garage_services.garage_service_id",
              select: "_id service_id",
              populate: [
                {
                  path: "service_id",
                  select: "_id service_name image_url",
                },
              ],
            },
          ],
        },
      ];
      const appointments = await AppointmentsModel.find(queryObj).populate(populate);
      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Appointment data"), data: appointments });
    } catch (error) {
      console.log("🚀 ~ appointmentList: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // view appointment by id
  getAppointmentById: async (req, res) => {
    try {
      const appointmentId = req.params.id;
      const queryObj = {
        _id: appointmentId,
        is_delete: false,
      };

      const populate = [
        {
          path: "garage_id",
          select: "_id garage_name user_id locationCoordinates",
          populate: [
            {
              path: "user_id",
              select: "_id full_name email phone_no",
            },
          ],
        },
        {
          path: "user_id",
          select: "_id full_name email phone_no",
        },
        {
          path: "vehicle_id",
          select: "_id model_name company license_plate fuel_type",
        },
        {
          path: "appointment_services",
          select: "_id payment garage_services message user_approval service_amount discount net_amount",
          populate: [
            {
              path: "garage_services.garage_service_id",
              select: "_id service_id",
              populate: [
                {
                  path: "service_id",
                  select: "_id service_name image_url",
                },
              ],
            },
          ],
        },
      ];
      const appointments = await AppointmentsModel.findOne(queryObj).populate(populate);
      return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Appointment data"), data: appointments });
    } catch (error) {
      console.log("🚀 ~ appointmentList: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },

  // download invoice of appointment by id
  downloadInvoicePdf: async (req, res) => {
    try {
      const appointmentId = req.params.id;
      // ?appointmentId=67b32aa99e48e85268b5754a

      if (appointmentId == null) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.REQUIRED("appointmentId") });
      }

      const populate = [
        {
          path: "garage_id",
          select: "_id garage_name user_id locationCoordinates",
          populate: [
            {
              path: "user_id",
              select: "_id full_name email phone_no",
            },
          ],
        },
        {
          path: "user_id",
          select: "_id full_name email phone_no",
        },
        {
          path: "vehicle_id",
          select: "_id model_name company license_plate fuel_type",
        },
        {
          path: "appointment_services",
          select: "_id payment garage_services message user_approval service_amount discount net_amount",
          populate: [
            {
              path: "garage_services.garage_service_id",
              select: "_id service_id",
              populate: [
                {
                  path: "service_id",
                  select: "_id service_name image_url",
                },
              ],
            },
          ],
        },
      ];
      const appointments = await AppointmentsModel.findOne({ _id: appointmentId }).populate(populate);

      const responseModify = await modifyAppointmentForCustomerInvoice(appointments);

      let serviceData = [];
      responseModify.appointment_services.map((item) => {
        const obj = {
          name: item.service_name,
          charge: item.net_amount,
          status: item.user_approval,
          transactionId: item.transaction_id,
        };
        serviceData.push(obj);
      });

      // Sample Data
      const invoiceData = {
        appointmentId: responseModify.appointment_data._id,
        invoiceDate: moment(new Date()).format("D/MM/YYYY"),
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
      const pdfPath = await path.join(__dirname, "..", "..", "invoice.pdf");
      return res.download(pdfPath, "invoice.pdf", (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Error downloading invoice");
        }
      });

      // return apiResponse.OK({ res, message: MESSAGE.GET_DATA("Pdf"), data: responseModify });
    } catch (error) {
      console.log("🚀 ~ pdfGenerate: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};

console.log(path.join(__dirname, "..", "..", "invoice.pdf"))