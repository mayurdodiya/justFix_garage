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

const updateCustomerProfile ={
  body: Joi.object()
    .keys({
      full_name: Joi.string().min(2).max(50).optional(),
      profile_image: Joi.string().uri().allow(null).optional(),
      permissions: Joi.object({
        notificaton: Joi.boolean().optional(),
        location: Joi.boolean().optional(),
      }).optional(),
      phone_no: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .optional(),
    })
    .min(1)
    .required(),
};

const resetPassword ={
  body: Joi.object()
    .keys({
      old_password: Joi.string().min(4).max(20).required(),
      new_password: Joi.string().min(8).max(20).required(),
      confirm_new_password: Joi.string().min(8).max(20).required(),
    })
    .min(1)
    .required(),
};


module.exports = {
  pagination,
  changeStatus,
  getCustomerById,
  getAllCustomer,
  updateCustomerProfile,
  resetPassword,
};
