const express = require("express");
const router = express.Router();
const controller = require("../../controllers/customer/ratings.controller");
const validate = require("../../middlewares/validate");
const { ratingsValidation } = require("../../validations");

router.post("/ratings/add", validate(ratingsValidation.addReviewToGarage), controller.addReviewToGarage);

module.exports = router;
