const express = require("express");
const router = express.Router();
const Category = require("../admin/categoryofgame");

router.get("/", async (req, res) => {
  const allCategory = await Category.find({});
  return res.json(allCategory);
});

router.post("/add", async (req, res) => {
  const newCategory = new Category({});
  await newCategory.save();
  return res.json({ message: "New Battle created successfully" });
});
