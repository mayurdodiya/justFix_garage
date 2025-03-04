// const HttpStatusCode = require("http-status-codes");
const HttpStatusCode = require("./http_status_code.js");

module.exports = {
  NOT_FOUND: ({ res, message = "-", data = {} } = {}) => {
    res.status(HttpStatusCode.NotFound).json({
      success: false,
      message: message,
      payload: data,
    });
  },

  BAD_REQUEST: ({ res, message = "-", data = {} } = {}) => {
    res.status(HttpStatusCode.BadRequest).json({
      success: false,
      message: message,
      payload: data,
    });
  },

  OK: ({ res, message = "-", data = {} } = {}) => {
    res.status(HttpStatusCode.OK).json({
      success: true,
      message: message,
      payload: data,
    });
  },

  CATCH_ERROR: ({ res, message = "-", data = {} } = {}) => {
    let responseCode = HttpStatusCode.InternalServerError;
    if ((message && message.includes("validation failed")) || message.includes("duplicate key error collection")) responseCode = HttpStatusCode.BAD_REQUEST;
    res.status(responseCode).json({
      success: false,
      message: message,
      payload: data,
    });
  },

  FORBIDDEN: ({ res, message = "-", data = {} } = {}) => {
    res.status(HttpStatusCode.Forbidden).json({
      success: false,
      message: message,
      payload: data,
    });
  },

  UNAUTHORIZED: ({ res, message = "-", data = {} } = {}) => {
    res.status(HttpStatusCode.Unauthorized).json({
      success: false,
      message: message,
      payload: data,
    });
  },

  DUPLICATE_VALUE: ({ res, message, data = {} } = {}) => {
    res.status(HttpStatusCode.Conflict).json({
      success: false,
      message: message || "Duplicate value.",
      payload: data,
    });
  },
};

// module.exports = {
//     BAD_REQUEST: ({ res, message = "-", data = {} } = {}) => {
//         res.status(HttpStatusCode.BAD_REQUEST).json({
//             success: false,
//             message: message,
//             payload: data,
//         });
//     },

//     DUPLICATE_VALUE: ({ res, message, data = {} } = {}) => {
//         res.status(HttpStatusCode.CONFLICT).json({
//             success: false,
//             message: message || "Duplicate value.",
//             payload: data,
//         });
//     },

//     METHOD_NOT_ALLOWED: ({ res, message = "-", data = {} } = {}) => {
//         res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({
//             success: false,
//             message: message,
//             payload: data,
//         });
//     },

//     MOVED_PERMANENTLY: ({ res, message = "-", data = {} } = {}) => {
//         res.status(HttpStatusCode.MOVED_PERMANENTLY).json({
//             success: false,
//             message: message,
//             payload: data,
//         });
//     },

//     NOT_ACCEPTABLE: ({ res, message = "-", data = {} } = {}) => {
//         res.status(HttpStatusCode.NOT_ACCEPTABLE).json({
//             success: false,
//             message: message,
//             payload: data,
//         });
//     },

//     NOT_FOUND: ({ res, message = "-", data = {} } = {}) => {
//         res.status(HttpStatusCode.NOT_FOUND).json({
//             success: false,
//             message: message,
//             payload: data,
//         });
//     },

//     NO_CONTENT_FOUND: ({ res, message = "-", data = {} } = {}) => {
//         res.status(HttpStatusCode.NO_CONTENT).json({
//             success: false,
//             message: message,
//             payload: data,
//         });
//     },

//     CREATED: ({ res, message = "-", data = {} } = {}) => {
//         res.status(HttpStatusCode.CREATED).json({
//             success: true,
//             message: message,
//             payload: data,
//         });
//     },

//     PERMANENT_REDIRECT: ({ res, message = "-", data = {} } = {}) => {
//         res.status(HttpStatusCode.PERMANENT_REDIRECT).json({
//             success: false,
//             message: message,
//             payload: data,
//         });
//     },

//     UPGRADE_REQUIRED: ({ res, message = "-", data = {} } = {}) => {
//         res.status(HttpStatusCode.UPGRADE_REQUIRED).json({
//             success: false,
//             message: message,
//             payload: data,
//         });
//     },

//     VALIDATION_ERROR: ({ res, message = "-", data = {} } = {}) => {
//         res.status(HttpStatusCode.VARIANT_ALSO_NEGOTIATES).json({
//             success: false,
//             message: message,
//             payload: data,
//         });
//     },
// };
