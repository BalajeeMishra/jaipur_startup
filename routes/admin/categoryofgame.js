const express = require("express");
const router = express.Router();
const Category = require("../../model/admin/categoryofgame");
const { verifyToken } = require("../../helper/authJwt");

router.get("/", [verifyToken], async (req, res, next) => {
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

router.get("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const getBattleById = await Category.findById(id);
  return res.status(200).json(getBattleById);
});

router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    var updateBattle = await Category.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
      context: "query",
      useFindAndModify: false,
    });
  } catch (e) {
    console.log(e);
  }
  console.log(updateBattle);
  return res.status(200).json({ message: "Battle gets updated" });
});

router.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await Category.findByIdAndDelete(id);
  return res.status(200).json({ message: "Battle deleted " });
});

module.exports = router;
