const express = require("express");
const router = express.Router();
const controller = require("../../controllers/garage/profile.controller");
const validate = require("../../middlewares/validate");
const { garageValidation } = require("../../validations");

router.put("/profile/edit", validate(garageValidation.editGarageProfile), controller.editProfileById);
router.get("/profile/get", controller.getProfileById);

module.exports = router;
