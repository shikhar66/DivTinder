const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authuser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token not found!!");
    }
    decodedMessage = await jwt.verify(token, "Dev@Tinder$666");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

module.exports = { authuser };
