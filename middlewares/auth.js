const jwt = require("jsonwebtoken");
const apiResponse = require("../utils/api.response");
const MESSAGE = require("../utils/message");
const { UserModel } = require("../models");
const { ROLE } = require("../utils/constant");

// Required Config
const JWT_SECRET = process.env.JWT_SECRET;

module.exports =
  ({ usersAllowed = [] } = {}) =>
  async (req, res, next) => {
    const token = req.header("x-auth-token");

    // Check if token exists
    if (!token) {
      return apiResponse.UNAUTHORIZED({ res, message: MESSAGE.NO_PROVIDE("Token") });
    }

    try {
      // Verify token
      jwt.verify(token, JWT_SECRET, async function (err, decoded) {
        if (err) {
          return res.status(400).json({ success: false, message: err.message });
        }

        // Find the user associated with the token
        const user = await UserModel.findOne({ _id: decoded.user_id }).populate("role_id", "role").lean();
        if (!user) {
          return apiResponse.UNAUTHORIZED({ res, message: MESSAGE.INVALID("Token!") });
        }

        if (!usersAllowed.includes(user.role_id.role)) {
          return apiResponse.UNAUTHORIZED({ res, message: MESSAGE.UNAUTHORIZED });
        }

        if (!user.is_active) {
          return apiResponse.UNAUTHORIZED({ res, message: MESSAGE.DEACTIVATED("Your profile") });
        }

        // Attach the user object to the request
        req.user = user;
        next();
      });
    } catch (e) {
      console.error("Error in auth middleware: ", e);
      return apiResponse.UNAUTHORIZED({ res, message: MESSAGE.UNAUTHORIZED });
    }
  };
