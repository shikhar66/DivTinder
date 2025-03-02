const express = require("express");
const profileRouter = express.Router();
const { authuser } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

profileRouter.get("/profile", authuser, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", authuser, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
});

profileRouter.patch("/profile/password", authuser, async (req, res) => {
  try {
    const { password, newpassword } = req.body;
    const user = req.user;
    const match = await bcrypt.compare(password, user.password);
    if (password == newpassword) {
      throw new Error("Current and New Password cannot be same");
    }
    if (!match) {
      throw new Error("Current Password is not correct");
    }
    if (!validator.isStrongPassword(newpassword)) {
      throw new Error("New Password is not Strong");
    }
    const strongPassword = await bcrypt.hash(newpassword, 10);
    const userDetails = req.user;
    userDetails.password = strongPassword;
    userDetails.save();

    res.status(200).send("New Password Saved Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
