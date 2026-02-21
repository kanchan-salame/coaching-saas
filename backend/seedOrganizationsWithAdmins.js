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
      // Check if organization already exists
      let existingOrg = await Organization.findOne({ email: orgData.email });

      if (!existingOrg) {
        const org = await Organization.create(orgData);
        console.log(`Created Organization: ${org.name}`);

        // Create Admin for this organization
        await User.create({
          fullName: `${org.name} Admin`,
          email: `admin@${org.name.replace(/\s+/g, "").toLowerCase()}.com`,
          password: "Admin@123", // auto hashed by pre-save hook
          role: "admin",
          organizationId: org._id,
          isActive: true,
        });

        console.log(`Admin created for ${org.name}`);
      } else {
        console.log(`Organization already exists: ${existingOrg.name}`);
      }
    }

    console.log("Seeding completed successfully ✅");
    process.exit(0);

  } catch (error) {
    console.error("ERROR:", error.message);
    process.exit(1);
  }
}

seed();