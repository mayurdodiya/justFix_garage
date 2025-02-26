const Joi = require("joi");
const { REVIEW_STATUS } = require("../utils/constant");

const sendReviewRequest = {
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
  body: Joi.object().keys({
    user_id: Joi.string().hex().length(24).required(),
  }),
};

const listOfRatings = {
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
  query: Joi.object().keys({
    page: Joi.number().required(),
    size: Joi.number().required(),
    s: Joi.required(),
    status: Joi.string().valid(REVIEW_STATUS.REQUESTED, REVIEW_STATUS.SUBMITTED, REVIEW_STATUS.REJECTED, REVIEW_STATUS.CANCELLED).optional(),
  }),
};

module.exports = {
  sendReviewRequest,
  listOfRatings,
};
