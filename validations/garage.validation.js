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

module.exports = {
  garageList,
  pagination,
  changeStatus,
  getGarageById,
  getAppointmentList,
  getAllWithdrawRequests,
  getAllServicesOfGarage,










};
