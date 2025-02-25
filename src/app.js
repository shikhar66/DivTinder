const express = require("express");
//const {adminAuth}=require('./middlewares/auth')
const validator = require("validator");
const { connectdb } = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUp } = require("./utils/validation");
const bcrypt = require("bcrypt");
app.use(express.json());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Email ID is Invalid");
    }
    
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Email ID not found");
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.status(200).send("Login Successfull");
    } else {
      throw new Error("Password not Match");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.post("/user", async (req, res) => {
  try {
    const data = req.body;
    const userr = new User(data);
    await userr.save();
    res.send("inserted");
  } catch (err) {
    res.status(400).send("error hai " + err);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const Allow_Update = ["age", "gender", "photoUrl", "about", "skills"];
    const allow = Object.keys(data).every((k) => Allow_Update.includes(k));
    if (!allow) {
      throw new Error("Update is not allowed");
    }
    if (data?.skills.length > 5) {
      throw new Error("cannot more than 5");
    }

    const valid = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
      returnDocument: "after",
    });
    res.status(200).json(valid);
  } catch (err) {
    res.status(400).send("error hai " + err);
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.findByIdAndDelete(userId);
    res.send("delete successfully");
  } catch {
    res.status(404).send("Nothing");
  }
});

// app.patch()

app.get("/feed", async (req, res) => {
  const data = req.body.lastName;
  const ress = await User.find({ lastName: data });
  res.send(ress);
});

// console.log("next")

connectdb()
  .then(() => {
    console.log("Successfully connected to DB");
    app.listen(7777, () => {
      console.log("Server listening on");
    });
  })
  .catch((err) => {
    console.error("Didnt ");
  });
