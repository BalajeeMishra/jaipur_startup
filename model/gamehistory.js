const mongoose = require("mongoose");
const GameShema = new mongoose.Schema(
  {
    nameofgame: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("GameHistory", GameShema);
