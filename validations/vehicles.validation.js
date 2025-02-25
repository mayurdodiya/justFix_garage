const Joi = require("joi");
const { OTP_TYPE, ROLE, FULE_TYPE, APPOINTMENT_STATUS } = require("../utils/constant");

const addVehicle = {
  body: Joi.object().keys({
    vehicle_type: Joi.string().trim().required(),
    company: Joi.string().trim().required(),
    model_name: Joi.string().trim().required(),
    year: Joi.number().required(),
    license_plate: Joi.string().trim().required(),
    chassis_number: Joi.string().trim().required(),
    fuel_type: Joi.string().valid(FULE_TYPE.PETROL, FULE_TYPE.DIESEL, FULE_TYPE.CNG, FULE_TYPE.ELECTRIC).required(),
    images: Joi.array().items(Joi.string().uri()).optional(),
  }),
};

const editVehicle = {
  param: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object()
    .keys({
      vehicle_type: Joi.string().optional(),
      company: Joi.string().optional(),
      model_name: Joi.string().optional(),
      year: Joi.number().optional(),
      license_plate: Joi.string().optional(),
      chassis_number: Joi.string().optional(),
      fuel_type: Joi.string().valid("PETROL", "DIESEL", "CNG", "ELECTRIC").optional(),
      images: Joi.array().items(Joi.string()).optional(),
    })
    .or("vehicle_type", "company", "model_name", "year", "license_plate", "chassis_number", "fuel_type", "images"),
};

const getVehicle = {
  param: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
};
const getAppointmentList = {
  query: Joi.object().keys({
    status: Joi.string().valid(APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.IN_PROGRESS, APPOINTMENT_STATUS.DECLINED, APPOINTMENT_STATUS.COMPLETED, APPOINTMENT_STATUS.CANCELLED).required(),
    page: Joi.number().required(),
    size: Joi.number().required(),
    s: Joi.required(),
  }),
  body: Joi.object().keys({
    vehicle_id: Joi.string().trim().required(),
  })
};

const pagination = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
    s: Joi.required(),
  }),
};

module.exports = {
  addVehicle,
  editVehicle,
  getVehicle,
  getAppointmentList,
  pagination,
};
