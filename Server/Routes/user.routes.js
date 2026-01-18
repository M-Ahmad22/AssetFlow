const express = require("express");
const User = require("../Models/User.model");
const { createUser } = require("../Controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

const router = express.Router();

// router.get("/", (req, res) => {
//   console.log("/api/users HIT");
//   res.json({ ok: true });
// });

router.get("/", protect, authorizeRoles("Admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.post("/", protect, authorizeRoles("Admin"), createUser);

router.put("/:id", protect, authorizeRoles("Admin"), async (req, res) => {
  const { password, ...rest } = req.body;
  await User.findByIdAndUpdate(req.params.id, rest);
  res.json({ message: "User updated" });
});

router.delete("/:id", protect, authorizeRoles("Admin"), async (req, res) => {
  if (req.user.id === req.params.id) {
    return res.status(400).json({ message: "Cannot delete your own account" });
  }
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

router.patch(
  "/:id/role",
  protect,
  authorizeRoles("Admin"),
  async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { role: req.body.role });
    res.json({ message: "Role updated" });
  }
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("Admin"),
  async (req, res) => {
    const user = await User.findById(req.params.id);
    user.status = user.status === "Active" ? "Disabled" : "Active";
    await user.save();
    res.json({ message: "Status updated" });
  }
);

module.exports = router;
