const mongoose = require("mongoose");
const GameShema = new mongoose.Schema(
  {
    gamedetail: {
      nameofbattle: String,
      coinonhold: Number,
      roomcode: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    opponentuser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // status will change for any game once the image will processeddd...
    statusofgame: {
      type: Boolean,
      default: false,
    },
    // once the image processed then only it will become true for any gamehistory.
    processed: {
      type: Boolean,
      default: false,
    },

    gamebetween: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      opponentuser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    sentthedetail: {
      type: Boolean,
      default: false,
    },
    gameImage: {
      filename: String,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("GameHistory", GameShema);
