const express = require("express");
const router = express.Router();
const Category = require("../../model/admin/categoryofgame");

router.get("/", async (req, res) => {
  const allCategory = await Category.find({});
  return res.status(200).json(allCategory);
});

router.post("/add", async (req, res) => {
  const { nameInput, priceInput, defaultInput, orderInput } = req.body;
  const newCategory = new Category({
    name: nameInput,
    pricetoenter: priceInput,
    order: orderInput,
    numberofPlayers: defaultInput,
  });
  await newCategory.save();
  return res.json({ message: "New Battle created successfully" });
});

module.exports = router;
