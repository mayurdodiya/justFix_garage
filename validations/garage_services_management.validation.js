const Joi = require("joi");

const pagination = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
    s: Joi.required(),
  }),
};


const addService = {
  body: Joi.object().keys({
    service_id: Joi.string().hex().length(24).required(),
    garage_id: Joi.string().hex().length(24).required(),
    price: Joi.number().required(),
  }),
};


const editService = {
  body: Joi.object().keys({
    price: Joi.number().optional(),
  }),
  param: Joi.object().keys({
     id: Joi.string().hex().length(24).required(),
   }),
};



const getAllService = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
    s: Joi.required(),
    is_active: Joi.boolean().optional(),
  }),
};

const getServiceById = {
  param: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
};

const changeServicesStatusById = {
  param: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
  query: Joi.object().keys({
    is_active: Joi.boolean().required(),
  }),
};

module.exports = {
  pagination,
  addService,
  editService,
  getServiceById,
  getAllService,
  changeServicesStatusById,
};
