const mongoose = require("mongoose");

let transactionSchema = mongoose.Schema(
  {
    historyVoucherTopup: {
      gameName: { type: String, required: [true, "Game name is required!"] },
      gameCategory: {
        type: String,
        required: [true, "Game category is required!"],
      },
      gameThumbnail: { type: String },
      coinName: { type: String, required: [true, "Coin name is required!"] },
      coinQty: { type: String, required: [true, "Coin quantity is required!"] },
      price: { type: Number },
    },
    historyPayment: {
      ownerName: { type: String, required: [true, "Name is required!"] },
      type: { type: String, required: [true, "Type is required!"] },
      bankName: { type: String, required: [true, "Bank name is required!"] },
      accountNumber: {
        type: String,
        required: [true, "Account number is required!"],
      },
    },
    name: {
      type: String,
      default: [true, "Name is required!"],
      maxlength: [225, "Length must be 3-225 character"],
      minlength: [3, "Length must be 3-225 character"],
    },
    accountUser: {
      type: String,
      default: [true, "Account name is required!"],
      maxlength: [225, "Length must be 3-225 character"],
      minlength: [3, "Length must be 3-225 character"],
    },
    tax: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    historyUser: {
      name: { type: String, require: [true, "player name is required"] },
      phoneNumber: {
        type: Number,
        require: [true, "player name is required"],
        maxlength: [13, "Length must be 9-13 character"],
        minlength: [9, "Length must be 9-13 character"],
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    voucherTopUp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
