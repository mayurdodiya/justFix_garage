const Joi = require("joi");
const { APPOINTMENT_STATUS, WITHDRAW_REQUESTS_STATUS } = require("../utils/constant");

const garageList = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
    s: Joi.required(),
    is_active: Joi.boolean().optional(),
  }),
};

const changeStatus = {
  param: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
  query: Joi.object().keys({
    is_active: Joi.boolean().required(),
  }),
};

const getGarageById = {
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
};

const getAllWithdrawRequests = {
  query: Joi.object().keys({
    status: Joi.string().valid(WITHDRAW_REQUESTS_STATUS.REQUESTED, WITHDRAW_REQUESTS_STATUS.CREDITED, WITHDRAW_REQUESTS_STATUS.CANCELLED, WITHDRAW_REQUESTS_STATUS.REJECTED).required(),
    page: Joi.number().required(),
    size: Joi.number().required(),
    s: Joi.required(),
  }),
};

const getAllServicesOfGarage = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
    s: Joi.required(),
  }),
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
};

const pagination = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
    s: Joi.required(),
  }),
};

const editGarageProfile = {
  body: Joi.object().keys({
    garage_name: Joi.string().trim().min(3).max(100).optional(),
    location: Joi.object({
      coordinates: Joi.array().items(Joi.number()).length(2).optional(),
    }).optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    permissions: Joi.object({
      notificaton: Joi.boolean().optional(),
      location: Joi.boolean().optional(),
    }).optional(),
    address: Joi.object({
      locality: Joi.string().trim().optional(),
      pincode: Joi.string().trim().optional(),
      city: Joi.string().trim().optional(),
      state: Joi.string().trim().optional(),
      country: Joi.string().trim().optional(),
    }).optional(),
    opening_time: Joi.string().allow("").optional(),
    closing_time: Joi.string().allow("").optional(),
    certificate: Joi.array().items(Joi.string().uri()).optional(),
    specialities: Joi.array().items(Joi.string().trim()).optional(),
    bank_details: Joi.object({
      account_holder_name: Joi.string().trim().optional(),
      branch_name: Joi.string().trim().optional(),
      account_number: Joi.string().trim().optional(),
      ifsc_code: Joi.string().trim().optional(),
    }).optional(),
    full_name: Joi.string().trim().min(3).max(100).optional(),
    country_code: Joi.string()
      .trim()
      .pattern(/^\+\d{1,3}$/)
      .optional(),
    phone_no: Joi.string()
      .trim()
      .pattern(/^\d{10}$/)
      .optional(),
    profile_image: Joi.string().uri().optional(),
  }),
};

module.exports = {
  garageList,
  pagination,
  changeStatus,
  getGarageById,
  getAppointmentList,
  getAllWithdrawRequests,
  getAllServicesOfGarage,
  editGarageProfile,
};
