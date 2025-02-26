module.exports = {
  ROLE: {
    ADMIN: "admin",
    USER: "user",
    GARAGE: "garage",
  },
  OTP_TYPE: {
    MOBILE_VERIFY: "mobile_verify",
    FORGOT_PASSWORD: "forgot_password",
    EMAIL_VERIFY: "email_verify",
    SIGNIN: "signin",
    UPDATE_PHONE: "update_phone",
    UPDATE_EMAIL: "update_email",
  },
  FULE_TYPE: {
    PETROL: "petrol",
    DIESEL: "diesel",
    CNG: "cng",
    ELECTRIC: "electric",
  },
  APPOINTMENT_STATUS: {
    PENDING: "pending",
    IN_PROGRESS: "in_progress",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
    DECLINED: "declined",
  },
  WITHDRAW_REQUESTS_STATUS: {
    REQUESTED: "requested",
    CREDITED: "credited",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
  },
  ACTIVETED_STATUS: {
    TRUE: true,
    FALSE: false,
  },
  USER_APPROVAL: {
    APPROVE: "approve",
    PENDING: "pending",
    DECLINED: "declined",
    CANCELLED: "cancelled",
  },
  PAYMENT_STATUS: {
    PENDING: "pending",
    CAPTURE: "capture",
    REFUNDED: "refunded",
  },
  REVIEW_STATUS: {
    REQUESTED: "requested",
    SUBMITTED: "submitted",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
  },
};
