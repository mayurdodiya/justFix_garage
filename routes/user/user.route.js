const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/user.controller");
const authMiddleware = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { vehiclesValidation } = require("../../validations");
const { ROLE } = require("../../utils/constant");

router.post("/vehicle/add", validate(vehiclesValidation.addVehicle), userController.addVehicle);
router.put("/vehicle/edit/:id", validate(vehiclesValidation.editVehicle), userController.editVehicle);
router.get("/vehicle/get/:id", validate(vehiclesValidation.getVehicle), userController.getVehicleById);
router.get("/vehicle/get", validate(vehiclesValidation.pagination), userController.getAllVehicle);
router.get("/vehicle/appointments/get", validate(vehiclesValidation.getAppointmentList), userController.getAppointmentList);

module.exports = router;
