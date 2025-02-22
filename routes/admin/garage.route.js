const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/garage.controller");
const authMiddleware = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { garageValidation } = require("../../validations");
const { ROLE } = require("../../utils/constant");

router.get("/garage/get", validate(garageValidation.garageList), controller.getAllGarage);
router.patch("/garage/changestatus/:id", validate(garageValidation.changeStatus), controller.changeGarageStatus);
router.get("/garage/get/:id", validate(garageValidation.getGarageById), controller.getGarageById);
router.get("/garage/appointments/get/:id", validate(garageValidation.getAppointmentList), controller.getAppointmentListOfGarage);
router.get("/garage/review/get/:id", validate(garageValidation.pagination), controller.getReviewOfGarageById);
router.get("/garage/withdrawrequest/get/:id", validate(garageValidation.getAllWithdrawRequests), controller.getAllWithdrawRequests);
router.get("/garage/services/get/:id", validate(garageValidation.getAllServicesOfGarage), controller.getAllServicesOfGarage);

module.exports = router;
