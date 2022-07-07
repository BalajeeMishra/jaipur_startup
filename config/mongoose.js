const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/project-jaipur";
const mongoose = require("mongoose");
module.exports.mongoConnection = () => {
  mongoose
    .connect(dbUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("connection open");
    })
    .catch((err) => {
      console.error(err);
    });
};
