const express = require("express");
const router = express.Router();
const controller = require("../../controllers/garage/accounting.controller");
const validate = require("../../middlewares/validate");
const { accountingValidation } = require("../../validations");

router.post("/accounting/withdraw-req/:id", validate(accountingValidation.sendWithdrawRequest), controller.sendWithdrawRequest);
router.get("/accounting/wallet-history/get/:id", /* validate(accountingValidation.getWithdrawRequest), */ controller.viewWalletTransactionHistory);

module.exports = router;
