const mongoose = require("mongoose");

let userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      default: [true, "Email is required!"],
    },
    name: {
      type: String,
      default: [true, "Name is required!"],
    },
    password: {
      type: String,
      default: [true, "Password is required!"],
    },
    phoneNumber: {
      type: String,
      default: [true, "Phone number is required!"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["Y", "N"],
      default: "Y",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
