const express = require("express");
const router = express.Router();
const controller = require("../../controllers/garage/services_management.controller");
const validate = require("../../middlewares/validate");
const { garageServicesValidation } = require("../../validations");

router.post("/service/add", validate(garageServicesValidation.addService), controller.addService);
router.get("/service/get/:id", validate(garageServicesValidation.getServiceById), controller.getServiceById);
router.get("/service/get", validate(garageServicesValidation.getAllService), controller.getAllService);
router.delete("/service/delete/:id", validate(garageServicesValidation.getServiceById), controller.removeServiceById);
router.put("/service/edit/:id", validate(garageServicesValidation.editService), controller.editServiceById);
router.patch("/service/status/:id", validate(garageServicesValidation.changeServicesStatusById), controller.changeServicesStatusById)

module.exports = router;
