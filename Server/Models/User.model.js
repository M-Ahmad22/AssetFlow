const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Viewer"],
      default: "Viewer",
    },
    status: {
      type: String,
      enum: ["Active", "Disabled"],
      default: "Active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
