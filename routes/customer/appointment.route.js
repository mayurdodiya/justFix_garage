const express = require("express");
const router = express.Router();
const controller = require("../../controllers/customer/appointment.controller");
const validate = require("../../middlewares/validate");
const { ROLE } = require("../../utils/constant");
const { appointmentValidation } = require("../../validations");
const authMiddleware = require("../../middlewares/auth");

// authMiddleware({ usersAllowed: [ROLE.USER] }),

router.get("/appointment/garage/get", authMiddleware({ usersAllowed: [ROLE.USER] }), validate(appointmentValidation.getAllGarage), controller.getAllGarage);
router.get("/appointment/garage/get/:id", authMiddleware({ usersAllowed: [ROLE.USER] }), validate(appointmentValidation.getGarageById), controller.getGarageById);
router.post("/appointment/book", authMiddleware({ usersAllowed: [ROLE.USER] }), validate(appointmentValidation.bookAppointment), controller.bookAppointment);
router.post("/appointment/payment/webhook", controller.webhook);    // https://052d-2405-201-200d-115e-7004-ecf1-b3e-e0bf.ngrok-free.app/api/v1/customer/appointment/payment/webhook
router.post("/appointment/payment/:id", authMiddleware({ usersAllowed: [ROLE.USER] }), validate(appointmentValidation.createPayment), controller.createPayment);
router.get("/appointment/list", authMiddleware({ usersAllowed: [ROLE.USER] }), validate(appointmentValidation.appointmentList), controller.appointmentList);
router.get("/appointment/get/:id", authMiddleware({ usersAllowed: [ROLE.USER] }), validate(appointmentValidation.getAppointmentById), controller.getAppointmentById);
router.get("/appointment/invoice/:id", authMiddleware({ usersAllowed: [ROLE.USER] }), controller.downloadInvoicePdf);

module.exports = router;
