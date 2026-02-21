const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User"); // path check kar lena

async function seedSuperAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Check if already exists
    const existing = await User.findOne({ role: "super_admin" });

    if (existing) {
      console.log("Super Admin already exists");
      process.exit(0);
    }

    await User.create({
      fullName: "Super Admin",
      email: "superadmin@example.com",
      password: "Super@123", // Pre-save hook automatically hash karega
      role: "super_admin",
      isActive: true,
      organizationId: null
    });

    console.log("Super Admin Created Successfully");
    process.exit(0);

  } catch (error) {
    console.error("ERROR:", error.message);
    process.exit(1);
  }
}

seedSuperAdmin();