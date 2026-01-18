const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./Models/User.model");

const users = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    password: "admin123",
    role: "Admin",
    status: "Active",
  },
  {
    name: "Michael Chen",
    email: "michael.chen@company.com",
    password: "manager123",
    role: "Manager",
    status: "Active",
  },
  {
    name: "Emily Davis",
    email: "emily.davis@company.com",
    password: "viewer123",
    role: "Viewer",
    status: "Active",
  },
];

const seedUsers = async () => {
  try {
    // 🔌 Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    for (const user of users) {
      const exists = await User.findOne({ email: user.email });

      if (exists) {
        console.log(`User already exists: ${user.email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 12);

      await User.create({
        ...user,
        password: hashedPassword,
      });

      console.log(`Created user: ${user.email}`);
    }

    console.log("✅ User seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedUsers();
