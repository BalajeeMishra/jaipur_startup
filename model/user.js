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
    admin: {
      type: Boolean,
      default: false,
    },
    superadmin: {
      type: Boolean,
      default: false,
    },
    adminplayer: {
      type: Boolean,
      default: false,
    },
    // status of the player pending or compeleted means false or true.
  },
  { timestamps: true }
);
UserSchema.plugin(schemaValidator);
module.exports = mongoose.model("User", UserSchema);
