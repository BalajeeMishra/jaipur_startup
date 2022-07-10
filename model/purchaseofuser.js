const mongoose = require("mongoose");
const PurchaseShema = new mongoose.Schema(
  {
    amount: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Purchase", PurchaseShema);
