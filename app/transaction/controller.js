const Transaction = require("./model");
const config = require("../../config");

module.exports = {
  index: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");

    const alert = { message: alertMessage, status: alertStatus };

    const transaction = await Transaction.find()
      .populate("category")
      .populate("player");
    const { name } = req.session.user;

    try {
      res.render("admin/transaction/view_transaction", {
        transaction,
        alert,
        name: name,
        title: "Transaction",
        appUrl: config.appUrl,
      });
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alert status", "danger");
      res.redirect("/transaction");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.query;

      await Transaction.findByIdAndUpdate({ _id: id }, { status });

      req.flash(
        "alertMessage",
        `Status transaction with id ${id} is successfull updated`
      );
      req.flash("alertStatus", "success");

      res.redirect("/transaction");
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/transaction");
    }
  },
};
