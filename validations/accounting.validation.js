const Joi = require("joi");

const salesCounting = {
  query: Joi.object().keys({
    start_date: Joi.string()
      .pattern(/^\d{4}\/\d{1,2}\/\d{1,2}$/) // Ensures format YYYY/MM/DD
      .required()
      .messages({
        "string.pattern.base": "start_date must be in the format YYYY/MM/DD",
        "any.required": "start_date is required",
      }),
    end_date: Joi.string()
      .pattern(/^\d{4}\/\d{1,2}\/\d{1,2}$/) // Ensures format YYYY/MM/DD
      .required()
      .messages({
        "string.pattern.base": "end_date must be in the format YYYY/MM/DD",
        "any.required": "end_date is required",
      }),
  }),
};

const sendWithdrawRequest = {
  body: Joi.object().keys({
    withdraw_amount: Joi.number().min(1).required(),
  }),
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
};

module.exports = {
  salesCounting,
  sendWithdrawRequest,
};
