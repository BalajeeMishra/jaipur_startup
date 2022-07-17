if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const path = require("path");
const t = require("tesseract.js");
const session = require("express-session");
const MongoDBStore = require("connect-mongo");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const cors = require("cors");
// const fileupload = require("express-fileupload");
const { mongoConnection } = require("./config/mongoose");
const app = express();

const UserRoute = require("./routes/user");
const CategoryOfGame = require("./routes/admin/categoryofgame");
const Cointouser = require("./routes/admin/givecointouser");
const PlayGame = require("./routes/admin/playgame");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cors({ origin: true, credentials: true }));
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/project-jaipur";
mongoConnection();

const store = new MongoDBStore({
  mongoUrl: dbUrl,
  secret: "letmeknowyoursecret!",
  touchAfter: 60,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  secret: "thisshouldbeabettersecret!",
  // name: "balajee",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  },
};

app.use(session(sessionConfig));
app.use(flash());
// app.use(fileupload());

app.use("/api/user", UserRoute);
app.use("/api/categoryofgame", CategoryOfGame);
app.use("/api/cointouser", Cointouser);
app.use("/api/playgame", PlayGame);

app.use(async (req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
// Routes...

// Home route
app.get("/", async (req, res) => {
  // t.recognize("./public/congratulation.jpeg", "eng", {
  //   logger: (m) => console.log(m),
  // }).then(({ data: { text } }) => {
  //   console.log(
  //     text.includes("Congratulations!"),
  //     text.includes("Room Code : 01750118")
  //   );
  //   console.log(text);
  //   res.send("bala");
  // });
  return res.json({ message: "hello world balajee" });
});

const handleValidationErr = (err) => {
  return new AppError("Please fill up all the required field carefully", 550);
};

app.use((err, req, res, next) => {
  // console.log("Error form Handler 1\n", err);
  if (err.name === "ValidationError") {
    err = handleValidationErr(err);
    req.flash("error", err.message);
    return res.redirect(req.header("Referer") || "/");
  }
  if (err.name === "MongoServerError") {
    req.flash(
      "error",
      "You can't give the same title to two different products."
    );
    return res.redirect(req.header("Referer") || "/");
  }
  return next(err);
});

app.use((err, req, res, next) => {
  // console.log("Error form Handler 2\n", err);
  if (err && err.status == 555) {
    req.flash("error", err.message);
    return res.redirect(req.header("Referer") || "/");
  }
  if (err && err.status == 400) {
    req.flash("error", err.message);
    return res.redirect(req.header("Referer") || "/");
  }
  return next(err);
});

// this is for handling unexpected
app.use((err, req, res, next) => {
  if (err) {
    // console.log(err, "\nError Unhandeled");
    // req.flash("error", "Something went wrong, please try later.");
    return res.redirect(req.header("Referer") || "/");
  }
});

// app.get("*", (_, res) =>
//   res.render("404", { msg: "Page not found", err: { status: 404 } })
// );

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("APP IS LISTENING ON PORT " + PORT));
