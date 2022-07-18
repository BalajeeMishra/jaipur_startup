const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
router.get("/register", async (req, res) => {
  // res.send("resgistering the userr");
  return res.json({ message: "hello world balajee" });
});

//user registeration route.
router.post("/register", async (req, res) => {
  // res.send("resgistering the userr");
  // phoneInput: '9315312511', passwordValue: 'balajeemishra123'
  const { phoneInput, passwordValue } = req.body;
  const saltPassword = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(passwordValue, saltPassword);
  // console.log("balajee", phoneInput, passwordValue);
  const newUser = new User({ phoneNo: phoneInput, password: hashedPassword });
  await newUser.save();
  if (newUser) {
    return res.status(200).json({
      message: "Registered successfully",
    });
  }
  if (!newUser) {
    return res.status(201).json({
      message: "something went wrong",
    });
  }
  return res.json({ message: "hello world balajee" });
});

// user login route.
router.post("/login", async (req, res) => {
  const { phoneInput, passwordValue } = req.body;
  const user = await User.findOne({ phoneNo: phoneInput });
  const loginResult = await bcrypt.compare(passwordValue, user.password);
  if (loginResult) {
    const user_log = (req.session.user_Id = user._id);
    return res.status(200).json({
      message: "you are Logged In",
      user_log,
    });
  }
});

router.post("/adminplayerregister", async (req, res) => {
  const { phoneInput } = req.body;
  const passwordValue = phoneInput;
  const saltPassword = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(passwordValue, saltPassword);
  const newUser = new User({
    phoneNo: phoneInput,
    password: hashedPassword,
    adminplayer: true,
  });
  await newUser.save();
  if (newUser) {
    return res.status(200).json({
      message: "Registered successfully",
    });
  }
  if (!newUser) {
    return res.status(201).json({
      message: "something went wrong",
    });
  }
});

router.get("/alladminplayer", async (req, res) => {
  const adminplayers = await User.find({ adminplayer: true });
  return res.status(200).json(adminplayers);
});

router.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await User.findByIdAndDelete(id);
  console.log(id, deleted, "balajee");
  return res.status(200).json({ messege: "user deleted successfully" });
});
module.exports = router;
