const express = require("express");
const router = express.Router();
const User = require("../model/user");
const Roles = require("../model/roleofuser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendSms, verifyOtp } = require("../helper/sendSms");
const JWT_ACC_ACTIVATE = process.env.JWT_ACC_ACTIVATE;

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
  const newUser = new User({ phoneNo: phoneInput, password: hashedPassword });
  await newUser.save();
  if (newUser) {
    const token = jwt.sign(
      { phoneInput, passwordValue, id: newUser._id },
      JWT_ACC_ACTIVATE,
      {
        expiresIn: "10 days",
      }
    );
    return res.status(200).json({
      message: "Registered successfully",
      token,
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
    req.session.user_Id = user._id;
    const token = jwt.sign(
      { phoneInput, passwordValue, id: user._id },
      JWT_ACC_ACTIVATE,
      {
        expiresIn: "10 days",
      }
    );
    return res.status(200).json({
      message: "you are Logged In",
      token,
    });
  }
});

// sending roles data..
router.get("/roles", async (_, res) => {
  const roles = await Roles.find({});
  console.log(roles);
  return res.status(200).json(roles);
});

// user logout routeee..
router.get("/logout", async (req, res) => {
  req.session.user_Id = null;
  return res.status(200).json("signed out");
});

// all things related to admin sectionn okayyy.
router.post("/adminplayerregister", async (req, res) => {
  const { phoneInput, selectedData } = req.body;
  const passwordValue = phoneInput;
  const saltPassword = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(passwordValue, saltPassword);
  const role = await Roles.findOne({ name: selectedData });
  const newUser = new User({
    phoneNo: phoneInput,
    password: hashedPassword,
    adminplayer: true,
  });
  newUser.roles.push(role._id);
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

router.get("/messagesending", async (req, res) => {
  sendSms(res);
});
router.get("/verifyotp", async (req, res) => {
  verifyOtp(res);
});
module.exports = router;
