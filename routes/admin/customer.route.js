const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/customer.controller");
const validate = require("../../middlewares/validate");
const { cusomerValidation } = require("../../validations");

router.get("/customer/get", validate(cusomerValidation.getAllCustomer), controller.getAllCustomer);
router.patch("/customer/changestatus/:id", validate(cusomerValidation.changeStatus), controller.changeUserStatus);
router.get("/customer/get/:id", validate(cusomerValidation.getCustomerById), controller.getCustomerById);
router.get("/customer/vehicles/get/:id", validate(cusomerValidation.pagination), controller.getVehiclesListOfCustomer);

module.exports = router;
