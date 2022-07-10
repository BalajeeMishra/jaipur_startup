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
    purchaseofuser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
    },
    // status of the player pending or compeleted means false or true.
    statusofgame: {
      type: Boolean,
    },
  },
  { timestamps: true }
);
UserSchema.plugin(schemaValidator);
module.exports = mongoose.model("User", UserSchema);
