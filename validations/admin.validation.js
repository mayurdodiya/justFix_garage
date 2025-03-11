const Joi = require("joi");

const updateAdminProfile ={
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
  updateAdminProfile,
  resetPassword,
};
