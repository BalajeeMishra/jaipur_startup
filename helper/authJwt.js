require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_ACC_ACTIVATE = process.env.JWT_ACC_ACTIVATE;
// var decoded = jwt.decode(id, { complete: true })
// const exp = decoded.payload.exp
module.exports.verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, JWT_ACC_ACTIVATE, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};
