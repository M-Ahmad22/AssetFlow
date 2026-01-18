const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const controller = require("../Controllers/category.controller");

const router = express.Router();

router.get("/", protect, controller.getCategories);
router.post("/", protect, authorizeRoles("Admin"), controller.createCategory);
router.put("/:id", protect, authorizeRoles("Admin"), controller.updateCategory);
router.delete(
  "/:id",
  protect,
  authorizeRoles("Admin"),
  controller.deleteCategory
);

module.exports = router;
