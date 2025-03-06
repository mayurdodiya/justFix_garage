const express = require("express");
const router = express.Router();
const controller = require("../../controllers/customer/vehicales.controller");
const authMiddleware = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { vehiclesValidation } = require("../../validations");
const { ROLE } = require("../../utils/constant");

router.post("/vehicle/add/:id", authMiddleware(usersAllowed[ROLE.USER]), validate(vehiclesValidation.addVehicle), controller.addVehicle);
router.put("/vehicle/edit/:id", authMiddleware(usersAllowed[ROLE.USER]), validate(vehiclesValidation.editVehicle), controller.editVehicleById);
router.delete("/vehicle/delete/:id", authMiddleware(usersAllowed[ROLE.USER]), validate(vehiclesValidation.deleteVehicle), controller.removeVehicleById);
router.get("/vehicle/get", authMiddleware(usersAllowed[ROLE.USER]), validate(vehiclesValidation.pagination), controller.getAllVehicle);
router.get("/vehicle/get/:id", authMiddleware(usersAllowed[ROLE.USER]), validate(vehiclesValidation.getVehicle), controller.getVehicleById);

module.exports = router;
