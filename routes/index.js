const express = require("express");
const auth = require("../middlewares/auth");
const { ROLE } = require("../utils/constant");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

/** All Application routes */
router.use("/auth", require("./auth.route"));

// user routes
router.use("/user", authMiddleware({ usersAllowed: [ROLE.USER] }), require("./user/user.route"));

// admin routes
router.use("/admin", authMiddleware({ usersAllowed: [ROLE.ADMIN] }), require("./admin/garage.route"));
router.use("/admin", authMiddleware({ usersAllowed: [ROLE.ADMIN] }), require("./admin/customer.route"));
router.use("/admin", authMiddleware({ usersAllowed: [ROLE.ADMIN] }), require("./admin/services_management.route"));
router.use("/admin", authMiddleware({ usersAllowed: [ROLE.ADMIN] }), require("./admin/appointment.route"));
router.use("/admin", authMiddleware({ usersAllowed: [ROLE.ADMIN] }), require("./admin/dashboard.route"));
router.use("/admin", authMiddleware({ usersAllowed: [ROLE.ADMIN] }), require("./admin/accounting.route"));

// garage routes
router.use("/garage", authMiddleware({ usersAllowed: [ROLE.GARAGE] }), require("./garage/ratings.route"));
router.use("/garage", authMiddleware({ usersAllowed: [ROLE.GARAGE] }), require("./garage/accounting.route"));
router.use("/garage", authMiddleware({ usersAllowed: [ROLE.GARAGE] }), require("./garage/appointment.route"));
router.use("/garage", authMiddleware({ usersAllowed: [ROLE.GARAGE] }), require("./garage/services_management.route"));
router.use("/garage", authMiddleware({ usersAllowed: [ROLE.GARAGE] }), require("./garage/profile.route"));

module.exports = router;
