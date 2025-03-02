const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUp } = require("../utils/validation");
const { authuser } = require("../middlewares/auth");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUp(req);
    const { firstName, lastName, email, password } = req.body;
    const strongPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: strongPassword,
    });
    await user.save();

    res.send("Data saved successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Email ID is Invalid");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Email ID not found");
    }
    const match = await user.validatePassword(password);
    if (match) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.status(200).send("Login Successfull");
    } else {
      throw new Error("Password not Match");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.status(200).send("Logout Successfully");
});

module.exports = authRouter;
