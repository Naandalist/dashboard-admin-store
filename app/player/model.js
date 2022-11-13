const mongoose = require("mongoose");

let playerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      default: [true, "Email is required!"],
    },
    name: {
      type: String,
      default: [true, "Name is required!"],
      maxlength: [225, "Name length must be 3-225 character"],
      minlength: [3, "Name length must be 3-225 character"],
    },
    username: {
      type: String,
      default: [true, "Username is required!"],
      maxlength: [225, "Username length must be 3-225 character"],
    },
    password: {
      type: String,
      default: [true, "Password is required!"],
      maxlength: [225, "Password length must be 3-225 character"],
      minlength: [3, "Password length must be 3-225 character"],
    },
    phoneNumber: {
      type: String,
      default: [true, "Phone number is required!"],
      maxlength: [13, "Password length must be 9-13character"],
      minlength: [9, "Password length must be 9-13 character"],
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
    avatar: {
      type: String,
    },
    fileName: {
      type: String,
    },
    favorite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
