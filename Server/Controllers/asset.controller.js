const Asset = require("../Models/Asset.model");

/* ===========================
   GET ASSETS
=========================== */
exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.find().populate("category").populate("location");

    res.json(assets);
  } catch (err) {
    console.error("❌ getAssets error:", err);
    res.status(500).json({ message: "Failed to fetch assets" });
  }
};

/* ===========================
   CREATE ASSET
=========================== */
exports.createAsset = async (req, res) => {
  try {
    console.log("➕ Create asset payload:", req.body);

    const asset = await Asset.create({
      name: req.body.name,
      serialNumber: req.body.serialNumber,
      category: req.body.categoryId, // ✅ MAP
      location: req.body.locationId, // ✅ MAP
      purchaseDate: req.body.purchaseDate,
      status: req.body.status,
      quantity: req.body.quantity,
      notes: req.body.notes,
    });

    res.status(201).json(asset);
  } catch (err) {
    console.error("❌ createAsset error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   UPDATE ASSET
=========================== */
exports.updateAsset = async (req, res) => {
  try {
    const updated = await Asset.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        category: req.body.categoryId,
        location: req.body.locationId,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("❌ updateAsset error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ===========================
   DELETE ASSET
=========================== */
exports.deleteAsset = async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ message: "Asset deleted" });
  } catch (err) {
    console.error("❌ deleteAsset error:", err);
    res.status(500).json({ message: "Failed to delete asset" });
  }
};
