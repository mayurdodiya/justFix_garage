const Joi = require("joi");
const { OTP_TYPE, ROLE } = require("../utils/constant");

const login = {
  body: Joi.object().keys({
    email: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
  }),
};

const role = {
  body: Joi.object({
    email: Joi.string().trim().required(),
  }),
};
const signin = {
  body: Joi.object({
    role: Joi.string().valid(ROLE.ADMIN, ROLE.GARAGE, ROLE.USER).required(),
    email: Joi.string().trim().required(),
    is_social: Joi.boolean().required(),
    full_name: Joi.when("is_social", {
      is: true, // When is_social is true
      then: Joi.string().trim().required(),
      otherwise: Joi.forbidden(),
    }),
    google_id: Joi.when("is_social", {
      is: true, // When is_social is true
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),
    password: Joi.when("is_social", {
      is: false, // When is_social is false
      then: Joi.string().min(6).required(),
      otherwise: Joi.forbidden(),
    }),
    garage_name: Joi.when("role", {
      is: Joi.valid(ROLE.GARAGE).required(), // Ensure role is GARAGE
      then: Joi.alternatives().conditional(Joi.ref("is_social"), {
        is: true,
        then: Joi.string().required(),
        otherwise: Joi.forbidden(),
      }),
      otherwise: Joi.forbidden(),
    }),
    profile_image: Joi.string().optional(),
  }),
};

const sendOtp = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    otp_type: Joi.string().required().trim().valid(OTP_TYPE.EMAIL_VERIFY, OTP_TYPE.FORGOT_PASSWORD, OTP_TYPE.MOBILE_VERIFY, OTP_TYPE.SIGNIN, OTP_TYPE.UPDATE_PHONE, OTP_TYPE.UPDATE_EMAIL),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    email: Joi.string().email().trim(),
    otp_type: Joi.string().required().trim().valid(OTP_TYPE.EMAIL_VERIFY, OTP_TYPE.FORGOT_PASSWORD, OTP_TYPE.MOBILE_VERIFY, OTP_TYPE.SIGNIN, OTP_TYPE.UPDATE_PHONE, OTP_TYPE.UPDATE_EMAIL),
    otp: Joi.string().trim().required(),
  }),
};

const signup = {
  body: Joi.object().keys({
    role: Joi.string().valid(ROLE.GARAGE, ROLE.USER).required(),
    garage_name: Joi.when("role", {
      is: ROLE.GARAGE, // When role is "garage"
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),
    full_name: Joi.string().trim().required(),
    email: Joi.string().trim().email().message("Please enter a valid email address").required(),
    country_code: Joi.string().required(),
    phone_no: Joi.string().required(),
    confirm_password: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
    profile_image: Joi.string().optional(),
    is_social: Joi.boolean().valid(false).required(),
  }),
};

const reSendOtp = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    otpType: Joi.string().valid("mobile_verify", "forgot_password", "email_verify", "signin", "update_phone", "update_email").required(),
  }),
};

const setPassword = {
  body: Joi.object({
    confirm_password: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
  }),
};

// --------------------------------------------------

//when need all validation messages of company together
// const duplicateSignup = {
//   company: Joi.object({
//     representativeName: Joi.string().trim().required().messages({
//       'any.required': 'Representative name is required'
//     }),
//     name: Joi.string().trim().required().messages({
//       'any.required': 'Name is required.'
//     }),
//     email: Joi.string().trim().email().message('Please enter a valid email address').required().messages({
//       'any.required': 'Email is required',
//       'string.email': 'Please enter a valid email'
//     }),
//     phoneNumber: Joi.string().trim().required().messages({
//       'any.required': 'Phone number is required',
//     }),
//     street: Joi.string().trim().required().messages({
//       'any.required': 'Street is required',
//     }),
//     city: Joi.string().trim().required().messages({
//       'any.required': 'City is required'
//     }),
//     country: Joi.string().trim().required().messages({
//       'any.required': 'Country is required'
//     }),
//     vat: Joi.string().trim().optional(),
//     postalCode: Joi.string().trim().required().messages({
//       'any.required': 'Postal Code is required'
//     }),
//   }).when("role", { is: "company", then: Joi.required(), otherwise: Joi.forbidden() }),
// }

// const companySignUp = {
//   body: Joi.object().keys({
//     firstName: Joi.string().trim().required(),  // Always required
//     lastName: Joi.string().trim().required(),   // Always required
//     email: Joi.string().trim().email().message('Please enter a valid email address').required(),
//     password: Joi.string().trim().required(),   // Always required
//     dob: Joi.date().required(),                  // Always required
//     gender: Joi.string().trim().valid('male','female','others').required(),  // Always required
//     phoneNumber: Joi.string().trim().required(),
//   })
// };

const completeProfile = {
  body: Joi.object().keys({
    email: Joi.string().trim().required(),
    role: Joi.string().trim().required().valid("influencer", "company"),
    stepNumber: Joi.number().required(),
    mainCategory: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .trim()
      .when(Joi.object({ stepNumber: Joi.number().valid(3), role: Joi.string().valid("influencer") }).unknown(), { then: Joi.required(), otherwise: Joi.forbidden() }),
    categories: Joi.array().when(Joi.object({ stepNumber: Joi.number().valid(3) }).unknown(), {
      then: Joi.when("role", {
        is: "influence",
        then: Joi.array().min(5).required(),
        otherwise: Joi.when("role", {
          is: "company",
          then: Joi.array().min(1).required(),
          otherwise: Joi.forbidden(),
        }),
      }),
      otherwise: Joi.forbidden(),
    }),
    isNotificationOn: Joi.boolean(),
    profile: Joi.string().when("role", { is: "influencer", then: Joi.required(), otherwise: Joi.forbidden() }),
    planId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .when("stepNumber", { is: "4", then: Joi.required(), otherwise: Joi.forbidden() }),
    instaUserName: Joi.string()
      .trim()
      .when(Joi.object({ stepNumber: Joi.number().valid(3), role: Joi.string().valid("influencer") }).unknown(), { then: Joi.required(), otherwise: Joi.forbidden() }),
    follower: Joi.string()
      .trim()
      .when(Joi.object({ stepNumber: Joi.number().valid(3), role: Joi.string().valid("influencer") }).unknown(), { then: Joi.required(), otherwise: Joi.forbidden() }),
    bio: Joi.string()
      .trim()
      .when(Joi.object({ stepNumber: Joi.number().valid(3), role: Joi.string().valid("influencer") }).unknown(), { then: Joi.required(), otherwise: Joi.forbidden() }),
    videoUrl: Joi.string()
      .trim()
      .when(Joi.object({ stepNumber: Joi.number().valid(3), role: Joi.string().valid("influencer") }).unknown(), { then: Joi.required(), otherwise: Joi.forbidden() }),
  }),
};

/**
 *log out
 */
const logout = {
  body: Joi.object().keys({
    fcmToken: Joi.string().optional().allow(""),
  }),
};

/**
 * Verify mobile otp.
 */

const verifyMobileOtp = {
  body: Joi.object().keys({
    otp: Joi.string().trim().required(),
    countryCode: Joi.string().trim(),
    phoneNumber: Joi.string().trim(),
    countryFlag: Joi.string().trim(),
    email: Joi.string().email().trim(),
    type: Joi.string().trim().required().valid("update_phone", "update_email"),
  }),
};

/**
 * All auth validations are exported from here 👇
 */
module.exports = {
  login,
  signup,
  signin,
  sendOtp,
  reSendOtp,
  verifyOtp,
  logout,
  verifyMobileOtp,
  setPassword,
  role,
};
