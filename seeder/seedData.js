const { ROLE } = require("../utils/constant");

module.exports = {
  roles: [
    {
      role: ROLE.ADMIN,
    },
    {
      role: ROLE.GARAGE,
    },
    {
      role: ROLE.USER,
    },
  ],

  adminData: [
    {
      firstName: "Admin",
      lastName: "user",
      email: "admin1@yopmail.com",
      password: "Admin@123",
    },
  ],
};
