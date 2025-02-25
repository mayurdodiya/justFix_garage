const { UserModel, RoleModel } = require("../models");
const { adminData } = require("./seedData");
const bcrypt = require("bcryptjs");

/**
 * Admin seeder.
 */
module.exports = adminSeeder = async () => {
  const adminRole = await RoleModel.findOne({ role: "admin" });

  try {
    for (let admin of adminData) {
      const adminExist = await UserModel.findOne({ email: admin.email }); // Get Admin by email.
      const adminData = {
        full_name: "Admin",
        email: "admin1@yopmail.com",
        password: "Admin@123",
        role_id: adminRole._id,
        is_active: true,
        isVerified: true,
        country_code: "+91",
        phone_no: "132",
      };

      console.log("SALT ROUNDS type of", process.env.SALT_ROUNDS);

      const SALT = await bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS, 10));
      console.log("SALT", SALT);
      // generate hash
      adminData.password = await bcrypt.hashSync(adminData.password, SALT);
      console.log("HASHED PASSWORD", adminData.password);

      if (!adminExist) {
        await UserModel.create(adminData); // If admin doesn't exists, create admin.
      }
    }

    console.log("✅ Admin seeder run successfully...");
  } catch (error) {
    console.log("❌ Error from admin seeder :", error);
  }
};
