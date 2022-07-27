const { mongoConnection } = require("./config/mongoose");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/project-jaipur";
mongoConnection();
const Role = require("./model/roleofuser");

const roles = ["user", "accountant", "admin", "gamePlayer"];

const seeder = async () => {
  roles.map(async (e) => {
    const newRoles = new Role({ name: e });
    await newRoles.save();
  });
};
seeder();
