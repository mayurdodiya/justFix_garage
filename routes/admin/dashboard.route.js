const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/dashboard.controller");
const validate = require("../../middlewares/validate");
const { dashboardValidation } = require("../../validations");

router.get("/dashboard/appointments/get", validate(dashboardValidation.dashboard),controller.countAllBookedAppointment);
router.get("/dashboard/sales/get", validate(dashboardValidation.dashboard),controller.countAllSales);
router.get("/dashboard/top5garage/get",controller.listTop5Garage);
router.get("/dashboard/top5customer/get",controller.listTop5Customer);
router.get("/dashboard/newincominguser/get",controller.newIncomingUserCount);
router.get("/dashboard/newincominggarage/get",controller.newIncomingGarageCount);
router.get("/dashboard/listtop10reptedservices/get",controller.listTop10ReptedServices);



module.exports = router;
