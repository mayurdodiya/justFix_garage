const Joi = require("joi");
const { ACTIVETED_STATUS, APPOINTMENT_STATUS } = require("../utils/constant");

const pagination = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
    s: Joi.required(),
  }),
};

const getAllCustomer = {
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

const getCustomerById = {
  param: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
};




module.exports = {
  pagination,
  changeStatus,
  getCustomerById,
  getAllCustomer,


};
