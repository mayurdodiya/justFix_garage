const { GarageModel, AppointmentsModel, AppointmentServicesModel, GarageServicesModel, VehiclesModel } = require("../../models/index.js");
const apiResponse = require("../../utils/api.response.js");
const MESSAGE = require("../../utils/message.js");
const commonJs = require("../../utils/common.js");
const { APPOINTMENT_STATUS, USER_APPROVAL } = require("../../utils/constant.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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

      const totalAmount = garageServices.reduce((sum, data) => sum + data.price, 0);
      const appointmentServicesObj = {
        garage_service_id: garage_services,
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
      const appointment_service_id = req.params.id;

      const isAppointmentServiceExist = await AppointmentServicesModel.findOne({ _id: appointment_service_id, is_delete: false });
      if (!isAppointmentServiceExist) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("This Appointment service") });
      }

      const appointment = await AppointmentsModel.findOne({ _id: isAppointmentServiceExist.appointment_id, user_id: userId, is_delete: false });
      if (!appointment) {
        return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_FOUND("This Appointment") });
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

  webhook: async (req, res) => {
    try {
      const event = req.body;
      console.log(event, "-------------------------------------- event");
      return res.sendStatus(400);

      // switch (event.type) {
      //   case "payment_intent.succeeded":
      //     console.log("✅ Payment Successful:", event.data.object);
      //     // TODO: Final confirmation of successful payment
      //     break;

      //   case "payment_intent.payment_failed":
      //     console.log("❌ Payment Failed:", event.data.object);
      //     // TODO: Handle failed payments (retry, notify user, etc.)
      //     break;

      //   default:
      //     console.log("Unhandled event:", event.type);
      // }
      // return apiResponse.OK({ res, message: MESSAGE.GENERATED("Payment link"), data: { url: session.url } });
    } catch (error) {
      // console.log("🚀 ~ webhook: ~ error:", error);
      return apiResponse.CATCH_ERROR({ res, message: MESSAGE.SOMETHING_WENT_TO_WRONG });
    }
  },
};
