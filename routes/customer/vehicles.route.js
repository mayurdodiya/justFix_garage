const express = require("express");
const router = express.Router();
const controller = require("../../controllers/customer/vehicales.controller");
const validate = require("../../middlewares/validate");
const { vehiclesValidation } = require("../../validations");

router.post("/vehicle/add/:id", validate(vehiclesValidation.addVehicle), controller.addVehicle);
router.put("/vehicle/edit/:id", validate(vehiclesValidation.editVehicle), controller.editVehicleById);
router.delete("/vehicle/delete/:id", validate(vehiclesValidation.deleteVehicle), controller.removeVehicleById);
router.get("/vehicle/get", validate(vehiclesValidation.pagination), controller.getAllVehicle);
router.get("/vehicle/get/:id", validate(vehiclesValidation.getVehicle), controller.getVehicleById);

module.exports = router;
