const mongoose = require("mongoose");

let nominalSchema = mongoose.Schema(
  {
    qty: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      require: [true, "Coin name is required!"],
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nominal", nominalSchema);
