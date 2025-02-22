const Joi = require("joi");
const { APPOINTMENT_STATUS } = require("../utils/constant");

const pagination = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
    s: Joi.required(),
  }),
};

const addCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    image_url: Joi.string().uri().optional(),
    description: Joi.string().optional(),
  }),
};

const addService = {
  body: Joi.object().keys({
    category_id: Joi.string().hex().length(24).required(),
    service_name: Joi.string().required(),
    image_url: Joi.string().uri().optional(),
  }),
};

const editCategory = {
  body: Joi.object().keys({
    name: Joi.string().optional(),
    image_url: Joi.string().uri().optional(),
    description: Joi.string().optional(),
  }),
  param: Joi.object().keys({
     id: Joi.string().hex().length(24).required(),
   }),
};

const editService = {
  body: Joi.object().keys({
    service_name: Joi.string().optional(),
    image_url: Joi.string().uri().optional(),
  }),
  param: Joi.object().keys({
     id: Joi.string().hex().length(24).required(),
   }),
};

const getAllCategories = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
    s: Joi.required(),
    is_active: Joi.boolean().optional(),
  }),
};

const getAllService = {
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
    s: Joi.required(),
    is_active: Joi.boolean().optional(),
    category_id: Joi.string().hex().length(24).optional(),
  }),
};

const getCategoryById = {
  param: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
};

const getServiceById = {
  param: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
};

const changeCategoryStatusById = {
  param: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
  query: Joi.object().keys({
    is_active: Joi.boolean().required(),
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
  addCategory,
  editCategory,
  getAllCategories,
  getCategoryById,
  changeCategoryStatusById,
  addService,
  editService,
  getServiceById,
  getAllService,
  changeServicesStatusById,
};
