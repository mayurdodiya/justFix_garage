const express = require("express");
const router = express.Router();
const controller = require("../../controllers/garage/appointment.controller");
const validate = require("../../middlewares/validate");
const { appointmentValidation } = require("../../validations");

router.get("/appointments/get/:id", validate(appointmentValidation.getAppointmentList), controller.getAppointmentListOfGarage);
router.patch("/appointments/accept-reject/:id", validate(appointmentValidation.acceptRejectBooking), controller.acceptRejectBooking);
router.post("/appointments/add-service-approval/:id", validate(appointmentValidation.addServiceForCustomerApproval), controller.addServiceForCustomerApproval);

module.exports = router;
