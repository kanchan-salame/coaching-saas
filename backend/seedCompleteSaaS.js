const mongoose = require("mongoose");
require("dotenv").config();

const Organization = require("./models/Organization");
const User = require("./models/User");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const organizationsData = [
      { name: "Bright Future Coaching", email: "bright@coaching.com", phone: "9876543210", subscriptionPlan: "basic" },
      { name: "Success Academy", email: "success@academy.com", phone: "9876543211", subscriptionPlan: "standard" },
      { name: "Topper Institute", email: "topper@institute.com", phone: "9876543212", subscriptionPlan: "premium" },
      { name: "Smart Learning Hub", email: "smart@learning.com", phone: "9876543213", subscriptionPlan: "basic" },
      { name: "Achievers Classes", email: "achievers@classes.com", phone: "9876543214", subscriptionPlan: "standard" },
    ];

    for (let orgData of organizationsData) {
      let org = await Organization.findOne({ email: orgData.email });

      if (!org) {
        org = await Organization.create(orgData);
        console.log(`Created Organization: ${org.name}`);
      }

      const baseName = org.name.replace(/\s+/g, "").toLowerCase();

      // ---------- ADMIN ----------
      await createUserIfNotExists({
        fullName: `${org.name} Admin`,
        email: `admin@${baseName}.com`,
        password: "Admin@123",
        role: "admin",
        organizationId: org._id,
      });

      // ---------- MANAGERS ----------
      for (let i = 1; i <= 2; i++) {
        await createUserIfNotExists({
          fullName: `${org.name} Manager ${i}`,
          email: `manager${i}@${baseName}.com`,
          password: "Manager@123",
          role: "manager",
          organizationId: org._id,
        });
      }

      // ---------- TEACHERS ----------
      for (let i = 1; i <= 2; i++) {
        await createUserIfNotExists({
          fullName: `${org.name} Teacher ${i}`,
          email: `teacher${i}@${baseName}.com`,
          password: "Teacher@123",
          role: "teacher",
          organizationId: org._id,
        });
      }

      // ---------- STUDENTS ----------
      for (let i = 1; i <= 2; i++) {
        await createUserIfNotExists({
          fullName: `${org.name} Student ${i}`,
          email: `student${i}@${baseName}.com`,
          password: "Student@123",
          role: "student",
          organizationId: org._id,
        });
      }
    }

    console.log("Complete SaaS demo data created ✅");
    process.exit(0);

  } catch (error) {
    console.error("ERROR:", error.message);
    process.exit(1);
  }
}

// Helper function
async function createUserIfNotExists(userData) {
  const exists = await User.findOne({ email: userData.email });

  if (!exists) {
    await User.create(userData);
    console.log(`${userData.role.toUpperCase()} created → ${userData.email}`);
  }
}

seed();