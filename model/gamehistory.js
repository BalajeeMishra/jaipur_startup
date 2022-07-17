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
    statusofgame: {
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
