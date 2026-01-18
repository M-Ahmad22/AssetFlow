const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
    type: {
      type: String,
      enum: ["office", "warehouse", "store"],
      default: "office",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", locationSchema);
