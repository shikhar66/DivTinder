const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      unique: true,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Not a Strong Password");
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("gender not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      // default:"Hello all good",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid url ->" + value);
        }
      },
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

//userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ firstName: 1 }, { unique: true });
// userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
