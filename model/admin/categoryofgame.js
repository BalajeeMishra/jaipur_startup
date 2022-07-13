const mongoose = require("mongoose");
const schemaValidator = require("mongoose-unique-validator");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    pricetoenter: {
      type: Number,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      unique: true,
    },
    //this will be numberofplayers in each battle.
    numberofPlayers: {
      type: Number,
      required: true,
    },
    // we have to show waiting status because we will say to user for waiting 45 sec
    // after that redirect to admin
    // user who is waitingggg.
    waitinguser: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    waitingPlayer: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
CategorySchema.plugin(schemaValidator);
module.exports = mongoose.model("Category", CategorySchema);
