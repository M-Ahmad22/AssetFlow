const express = require("express");
const router = express.Router();
const controller = require("../Controllers/location.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/", protect, controller.getLocations);
router.post("/", protect, controller.createLocation);
router.put("/:id", protect, controller.updateLocation);
router.delete("/:id", protect, controller.deleteLocation);

module.exports = router;
