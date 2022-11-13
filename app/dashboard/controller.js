const Category = require("../category/model");
const Player = require("../player/model");
const Transaction = require("../transaction/model");
const Voucher = require("../voucher/model");

module.exports = {
  index: async (req, res) => {
    try {
      const { name } = req.session.user;

      const transaction = await Transaction.countDocuments();
      const voucher = await Voucher.countDocuments();
      const category = await Category.countDocuments();
      const player = await Player.countDocuments();

      res.render("admin/dashboard/view_dashboard", {
        name,
        title: "Dashboard",
        count: {
          transaction,
          voucher,
          category,
          player,
        },
      });
    } catch (error) {
      console.log("error: ", error);
    }
  },
};
