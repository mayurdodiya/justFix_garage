const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/services_management.controller");
const validate = require("../../middlewares/validate");
const { servicesManagementValidation } = require("../../validations");

router.post("/services-management/category/add", validate(servicesManagementValidation.addCategory), controller.addCategory);
router.put("/services-management/category/edit/:id", validate(servicesManagementValidation.editCategory), controller.editCategoryById);
router.get("/services-management/category/get/:id", validate(servicesManagementValidation.getCategoryById), controller.getCategoryById);
router.get("/services-management/category/get", validate(servicesManagementValidation.getAllCategories), controller.getAllCategories);
router.delete("/services-management/category/delete/:id", validate(servicesManagementValidation.getCategoryById), controller.removeCategoryById);
router.patch("/services-management/category/status/:id", validate(servicesManagementValidation.changeCategoryStatusById), controller.changeCategoryStatusById)

router.post("/services-management/service/add", validate(servicesManagementValidation.addService), controller.addService);
router.put("/services-management/service/edit/:id", validate(servicesManagementValidation.editService), controller.editServiceById);
router.get("/services-management/service/get/:id", validate(servicesManagementValidation.getServiceById), controller.getServiceById);
router.get("/services-management/service/get", validate(servicesManagementValidation.getAllService), controller.getAllService);
router.delete("/services-management/service/delete/:id", validate(servicesManagementValidation.getServiceById), controller.removeServicesById);
router.patch("/services-management/service/status/:id", validate(servicesManagementValidation.changeServicesStatusById), controller.changeServicesStatusById)
module.exports = router;
