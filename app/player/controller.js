const Player = require("./model");
const Voucher = require("../voucher/model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");
const Payment = require("../payment/model");
const Bank = require("../bank/model");
const Transaction = require("../transaction/model");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const voucher = await Voucher.find()
        .select("_id name status category thumbnail")
        .populate("category");

      res.status(200).json({
        data: voucher,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findOne({ _id: id })
        .populate("category")
        .populate("nominals")
        .populate("user", "_id name phoneNumber");

      console.log("data voucher: ", voucher);

      if (!voucher) {
        return res.status(404).json({ message: "Data is not found.!" });
      }

      res.status(200).json({
        data: voucher,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },
  category: async (req, res) => {
    try {
      const category = await Category.find();

      res.status(200).json({ data: category });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  },
  checkout: async (req, res) => {
    try {
      const { accountUser, name, nominal, voucher, payment, bank } = req.body;

      const res_nominal = await Nominal.findById({ _id: nominal });
      const res_payment = await Payment.findOne({ _id: payment });
      const res_bank = await Bank.findOne({ _id: bank });
      const res_voucher = await Voucher.findOne({ _id: voucher })
        .select("name category _id thumbnail user")
        .populate("category")
        .populate("user");

      if (!res_voucher || res_voucher === null) {
        res.status(404).json({
          message: `Voucher game not found`,
        });
      }
      if (!res_nominal || res_voucher === null) {
        res.status(404).json({
          message: `Nominal voucher not found`,
        });
      }
      if (!res_payment || res_payment === null) {
        res.status(404).json({
          message: `Payment voucher not found`,
        });
      }
      if (!res_bank || res_bank === null) {
        res.status(404).json({ message: "bank not found", status: 404 });
      }

      let tax = 0.1 * res_nominal._doc.price;

      const payload = {
        historyVoucherTopup: {
          gameName: res_voucher._doc.name,
          gameCategory: res_voucher._doc.category,
          gameThumbnail: res_voucher._doc.thumbnail,
          coinName: res_nominal._doc.name,
          coinQty: res_nominal._doc.qty,
          price: res_nominal._doc.price,
          gameCategory: res_voucher._doc.category
            ? res_voucher._doc.category.name
            : "",
        },
        historyPayment: {
          ownerName: res_bank._doc.ownerName,
          type: res_payment._doc.type,
          bankName: res_bank._doc.bankName,
          accountNumber: res_bank._doc.accountNumber,
        },
        name: name,
        accountUser: accountUser,
        tax: tax,
        value: res_nominal._doc.price - tax,
        player: req.player?._id,
        historyUser: {
          name: res_voucher._doc.user?.name,
          phoneNumber: res_voucher._doc.user?.phoneNumber,
        },
        category: res_voucher._doc.category?._id,
        user: res_voucher._doc.user?._id,
      };

      const transaction = new Transaction(payload);
      await transaction.save();

      res.status(201).json({
        data: transaction,
      });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  },
  historyTransaction: async (req, res) => {
    try {
      const { status = "" } = req.query;
      let criteria = {};

      if (status.length) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: `i` },
        };
      }

      //get all history will filter by player id
      if (req.player._id) {
        criteria = {
          ...criteria,
          player: req.player._id,
        };
      }

      const history = await Transaction.find(criteria);

      let totalValue = await Transaction.aggregate([
        { $match: criteria },
        {
          $group: {
            _id: null,
            value: { $sum: "$value" },
          },
        },
      ]);

      res.status(200).json({
        dataLength: history.length,
        data: history,
        totalValue: totalValue.length ? totalValue[0].value : 0,
      });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  },
  historyTransactionDetail: async (req, res) => {
    try {
      const { id } = req.params;

      const history = await Transaction.findById({ _id: id });

      if (!history || history === null) {
        return res
          .status(404)
          .json({ message: "History transaction detail is not found" });
      }

      res.status(200).json({ data: history });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  },
  dashboard: async (req, res) => {
    try {
      const valueTransactions = await Transaction.aggregate([
        { $match: { player: req.player._id } },
        {
          $group: {
            _id: "$category",
            value: { $sum: "$value" },
          },
        },
      ]);

      const categories = await Category.find({});

      // insert name to each category
      categories.forEach((category) => {
        valueTransactions.forEach((valueTransaction) => {
          if (valueTransaction._id.toString() === category._id.toString()) {
            valueTransaction.name = category.name;
          }
        });
      });

      const history = await Transaction.find({
        player: req.player._id,
      })
        .populate("category")
        .sort({ updatedAt: -1 });

      res.status(200).json({ data: history, counts: valueTransactions });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  },
  profile: async (req, res) => {
    try {
      res.status(200).json({ data: req.player });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  },
};
