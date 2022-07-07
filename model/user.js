const mongoose = require("mongoose");
const schemaValidator = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema(
  {
    phoneNo: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);
UserSchema.plugin(schemaValidator);
module.exports = mongoose.model("User", UserSchema);
