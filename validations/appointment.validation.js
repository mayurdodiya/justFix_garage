const Joi = require("joi");
const { APPOINTMENT_STATUS } = require("../utils/constant");

const pagination = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
    s: Joi.any().optional(),
  }),
};
const getAppointmentList = {
  query: Joi.object().keys({
    status: Joi.string().valid(APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.IN_PROGRESS, APPOINTMENT_STATUS.DECLINED, APPOINTMENT_STATUS.COMPLETED, APPOINTMENT_STATUS.CANCELLED).optional(),
    page: Joi.number().required(),
    size: Joi.number().required(),
    is_active: Joi.boolean().optional(),
    s: Joi.any().optional(),
  }),
};

const getServicesListOfAppointment = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
  }),
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
};

const acceptRejectBooking = {
  query: Joi.object().keys({
    status: Joi.string().valid(APPOINTMENT_STATUS.IN_PROGRESS, APPOINTMENT_STATUS.DECLINED).required(),
  }),
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
};

const addServiceForCustomerApproval = {
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
  query: Joi.object().keys({
    appointment_id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object().keys({
    garage_service_id: Joi.string().hex().length(24).required(),
    message: Joi.string().optional(),
    discount: Joi.number().optional(),
  }),
};

const getAllGarage = {
  query: Joi.object().keys({
    page: Joi.number().min(1).required(),
    size: Joi.number().min(1).required(),
    s: Joi.any().optional(),
    longitude: Joi.number().min(-180).max(180).required(),
    latitude: Joi.number().min(-90).max(90).required(),
  }),
};

const getGarageById = {
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
};

const bookAppointment = {
  body: Joi.object().keys({
    vehicle_id: Joi.string().hex().length(24).required(),
    garage_id: Joi.string().hex().length(24).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    garage_services: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
    description: Joi.string().allow("").optional(),
  }),
};

const createPayment = {
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "any.required": "Appointment service ID is required",
      "string.empty": "Appointment service ID cannot be empty",
      "string.hex": "Appointment service ID must be a valid hex string",
      "string.length": "Appointment service ID must be exactly 24 characters long",
    }),
  }),
};

const appointmentList = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
    s: Joi.any().optional(),
    vehicle_id: Joi.string().hex().length(24).optional().messages({
      "string.hex": "Vehicle ID must be a valid hex string",
      "string.length": "Vehicle ID must be exactly 24 characters long",
    }),
  }),
};

const getAppointmentById = {
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "any.required": "Appointment ID is required",
      "string.empty": "Appointment ID cannot be empty",
      "string.hex": "Appointment ID must be a valid hex string",
      "string.length": "Appointment ID must be exactly 24 characters long",
    }),
  }),
};

module.exports = {
  pagination,
  getAppointmentList,
  getServicesListOfAppointment,
  acceptRejectBooking,
  addServiceForCustomerApproval,
  getAllGarage,
  getGarageById,
  bookAppointment,
  createPayment,
  appointmentList,
  getAppointmentById,
};
