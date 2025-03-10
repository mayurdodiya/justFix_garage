const express = require("express");
const router = express.Router();
const controller = require("../../controllers/customer/profile.controller");
const validate = require("../../middlewares/validate");
const { cusomerValidation } = require("../../validations");

router.get("/profile/get", controller.getProfile);
router.put("/profile/edit", validate(cusomerValidation.updateCustomerProfile), controller.editProfileById);
router.put("/profile/reset-password", validate(cusomerValidation.resetPassword), controller.resetPassword);

module.exports = router;
