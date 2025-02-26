const express = require("express");
const router = express.Router();
const controller = require("../../controllers/garage/ratings.controller");
const validate = require("../../middlewares/validate");
const { ratingsValidation } = require("../../validations");

router.post("/ratings/review-req/:id", validate(ratingsValidation.sendReviewRequest), controller.sendReviewRequest);
router.get("/ratings/list/:id", validate(ratingsValidation.listOfRatings), controller.listOfRatings);

module.exports = router;
