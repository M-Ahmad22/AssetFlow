const express = require("express");
const router = express.Router();

const assetController = require("../Controllers/asset.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/", protect, assetController.getAssets);
router.post("/", protect, assetController.createAsset);
router.put("/:id", protect, assetController.updateAsset);
router.delete("/:id", protect, assetController.deleteAsset);

module.exports = router;
