const express = require("express");
const router = express.Router();
const Purchase = require("../../model/purchaseofuser");
const User = require("../../model/user");

router.post("/", async (req, res) => {
  const { phoneNo } = req.body;
  const findinguser = await User.findOne({ phoneNo });
  return findinguser
    ? res.status(200).json({ message: "user found for given input" })
    : res.status(201).json({ message: "no user found" });
});
router.post("/add", async (req, res) => {
  const { phoneNo, coin } = req.body;
  const findinguser = await User.findOne({ phoneNo });
  const newPurchase = new Purchase({ amount: coin, user: findinguser._id });
  await newPurchase.save();
  console.log(newPurchase);
  return newPurchase
    ? res
        .status(200)
        .json({ message: `Added successfully for the user ${phoneNo}` })
    : res.status(201).json({ message: "please try again" });
});
router.post("/all", async (req, res) => {
  const { phoneNo } = req.body;
  const findinguser = await User.findOne({ phoneNo });
  const userwithpurchase = await Purchase.find({ user: findinguser._id });
  return res.status(200).json(userwithpurchase.reverse()[0]);
});
module.exports = router;
