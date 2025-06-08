const express = require("express");
const { connectdb } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter=require("./routes/user") 

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/",userRouter);

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

// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;
//   try {
//     const Allow_Update = ["age", "gender", "photoUrl", "about", "skills"];
//     const allow = Object.keys(data).every((k) => Allow_Update.includes(k));
//     if (!allow) {
//       throw new Error("Update is not allowed");
//     }
//     if (data?.skills.length > 5) {
//       throw new Error("cannot more than 5");
//     }

//     const valid = await User.findByIdAndUpdate(userId, data, {
//       runValidators: true,
//       returnDocument: "after",
//     });
//     res.status(200).json(valid);
//   } catch (err) {
//     res.status(400).send("error hai " + err);
//   }
// });

// app.delete("/user", async (req, res) => {
//   try {
//     const userId = req.body.userId;
//     await User.findByIdAndDelete(userId);
//     res.send("delete successfully");
//   } catch {
//     res.status(404).send("Nothing");
//   }
// });
