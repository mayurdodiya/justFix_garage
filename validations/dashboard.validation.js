const Joi = require("joi");

const dashboard = {
  query: Joi.object().keys({
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
  }),
};

module.exports = {
  dashboard,
};
