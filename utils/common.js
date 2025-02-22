const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { UserModel, RoleModel } = require("../models");
const apiResponse = require("../utils/api.response");
const MESSAGE = require("../utils/message.js");

module.exports = {
  findRoleId: async (res, user) => {
    const userRoleId = await RoleModel.findOne({ role: user });
    if (!userRoleId) {
      return apiResponse.NOT_FOUND({ res, message: MESSAGE.NO_DATA(`${user} role`) });
    } else if (userRoleId.is_active == false) {
      return apiResponse.FORBIDDEN({ res, message: MESSAGE.DEACTIVATED(`${user} role`) });
    } else {
      return userRoleId._id;
    }
  },
  hashPassword: async ({ password }) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  },

  generateToken: (data) => {
    const token = jwt.sign(data, process.env.JWT_SECRET /* { expiresIn: process.env.JWT_EXPIRES_IN } */);
    return token;
  },

  decodeToken: ({ token }) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return "token_expire";
      } else {
        return "invalid_token";
      }
    }
  },

  comparePassword: async ({ password, hashPwd }) => {
    if (!password || !hashPwd) {
      return false;
    }
    const isPasswordMatch = await bcrypt.compare(password, hashPwd);
    return isPasswordMatch;
  },

  generateOtp: async () => {
    const otp = Math.ceil(1000 + Math.random() * 10000);
    const otpToken = jwt.sign({ otp: otp }, process.env.JWT_SECRET, { expiresIn: process.env.OTP_EXPIRES_IN });
    return { otp: otp, otp_token: otpToken };
  },

  pagination: async (pageData, sizeData) => {
    const page = +pageData == 0 ? 1 : +pageData;
    const size = +sizeData == 0 ? 10 : +sizeData;

    const skip = (+page - 1) * +size;
    const limit = size;
    return { skip, limit };
  },

  paginData: async (count, alldata, pageData, limit) => {
    const total_record = count;
    const data = alldata;
    const total_page = Math.ceil(count / limit);
    const currentPage = (+pageData == 0) | null ? 1 : +pageData;

    return { total_record, data, total_page, currentPage };
  },

  convertToUTCDate: (date) => {
    return new Date(Date.UTC(date));
    // const [day, month, year] = date.split("/").map(num => parseInt(num, 10));
    // return new Date(Date.UTC(year, month - 1, day));
  },
  handleFilters: (filters, filterOptions = []) => {
    Object.keys(filters).forEach((key) => {
      if (filters[key] === "true") {
        filters[key] = true;
      } else if (filters[key] === "false") {
        filters[key] = false;
      }

      // If the filter field has regex matching, create a regex query
      if (filterOptions?.regexFields?.includes(key)) {
        filters[key] = { $regex: new RegExp(filters[key], "i") };
      }
    });

    // Handle date range filtering
    if (filters.startDate || filters.endDate) {
      let dateFilter = {};
      if (filters.startDate) {
        dateFilter.$gte = module.exports.convertToUTCDate(filters.startDate);
      }
      if (filters.endDate) {
        let endOfDay = module.exports.convertToUTCDate(filters.endDate);
        endOfDay.setHours(23, 59, 59, 999);
        dateFilter.$lte = endOfDay;
      }

      if (Object.keys(dateFilter).length > 0) {
        filters.createdAt = dateFilter;
      }
    }

    // Special case for exact date range (start and end are the same)
    if (filters.startDate && filters.endDate && new Date(filters.startDate).getTime() === new Date(filters.endDate).getTime()) {
      let endOfDay = module.exports.convertToUTCDate(filters.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filters.createdAt = {
        $gte: module.exports.convertToUTCDate(filters.startDate),
        $lte: endOfDay,
      };
    }

    // Remove unnecessary filters
    delete filters.search;
    delete filters.startDate;
    delete filters.endDate;

    return filters;
  },

  downloadImageFromUrl: async (url) => {
    try {
      // Download the image from the URL using axios
      const response = await axios({
        method: "get",
        url: url,
        responseType: "arraybuffer",
      });
      const fileName = `image_${Date.now()}.jpg`;
      return {
        buffer: response.data,
        fileName: fileName,
      };
    } catch (error) {
      console.error("Error downloading image:", error);
      throw new Error("Failed to download image. Please try again later.");
    }
  },
};
