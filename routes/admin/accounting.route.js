const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/accounting.controller");
const validate = require("../../middlewares/validate");
const { accountingValidation } = require("../../validations");

router.get("/accounting/sales/get", validate(accountingValidation.salesCounting), controller.countTotalSalesAmmount);

module.exports = router;
