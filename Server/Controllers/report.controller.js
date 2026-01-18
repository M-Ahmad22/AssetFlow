const Asset = require("../Models/Asset.model");

exports.summary = async (req, res) => {
  const total = await Asset.countDocuments();
  const available = await Asset.countDocuments({ status: "Available" });
  const assigned = await Asset.countDocuments({ status: "Assigned" });

  res.json({
    totalAssets: total,
    available,
    assigned,
  });
};
