const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/appointment.controller");
const validate = require("../../middlewares/validate");
const { appointmentValidation } = require("../../validations");

router.get("/appointments/get/:id", validate(appointmentValidation.getAppointmentList), controller.getAppointmentListOfCustomer);
router.get("/appointments/services/get/:id", validate(appointmentValidation.getServicesListOfAppointment), controller.getAppointmentServiceList);


router.get("/appointments/pdf", controller.downloadInvoicePdf);

// http://localhost:3000/api/v1/admin/appointments/pdf

module.exports = router;
