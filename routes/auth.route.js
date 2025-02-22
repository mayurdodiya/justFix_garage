const express = require("express");
const authController = require("../controllers/auth/auth.controller");
const validate = require("../middlewares/validate");
const { authValidation } = require("../validations");
const authMiddleware = require("../middlewares/auth");
const { ROLE } = require("../utils/constant");

const router = express.Router();


router.post("/send-otp", validate(authValidation.sendOtp), authController.sendOtp);
router.get("/verify-otp", validate(authValidation.verifyOtp), authController.verifyOtp);
router.post("/signup", validate(authValidation.signup), authController.signup);
router.get("/signin", validate(authValidation.signin), authController.signin);
router.get("/role", validate(authValidation.role), authController.findUserRole);
router.patch("/set-password", authMiddleware({ usersAllowed: [ROLE.USER, ROLE.ADMIN, ROLE.GARAGE] }), validate(authValidation.setPassword), authController.setPassword);

module.exports = router;
