const mongoose = require("mongoose");

let bankSchema = mongoose.Schema({
  ownerName: {
    type: String,
    require: [true, "Owner name is required!"],
  },
  bankName: {
    type: String,
    require: [true, "Bank name is required!"],
  },
  accountNumber: {
    type: Number,
    require: [true, "Account number is required!"],
  },
});

module.exports = mongoose.model("Bank", bankSchema);
