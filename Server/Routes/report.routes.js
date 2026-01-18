const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const controller = require("../Controllers/report.controller");

const router = express.Router();

router.get("/summary", protect, controller.summary);

module.exports = router;
