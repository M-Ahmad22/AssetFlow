const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    serialNumber: { type: String, required: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },

    purchaseDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["In Use", "Available", "In Stock", "In Repair"],
      default: "Available",
    },

    quantity: { type: Number, default: 1 },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asset", assetSchema);
