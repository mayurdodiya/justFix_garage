const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/profile.controller");
const validate = require("../../middlewares/validate");
const { adminValidation } = require("../../validations");

router.get("/profile/get", controller.getProfile);
router.put("/profile/edit", validate(adminValidation.updateAdminProfile), controller.editProfileById);
router.put("/profile/reset-password", validate(adminValidation.resetPassword), controller.resetPassword);

module.exports = router;
