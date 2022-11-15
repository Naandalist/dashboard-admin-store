const Bank = require("./model");

module.exports = {
  index: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");

    const alert = { message: alertMessage, status: alertStatus };

    const bank = await Bank.find();
    const { name } = req.session?.user;
    try {
      res.render("admin/bank/view_bank", {
        bank,
        alert,
        name,
        title: "Bank",
      });
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alert status", "danger");
      res.redirect("/bank");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const { name } = req.session?.user;
      res.render("admin/bank/create", { name, title: "Bank" });
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { ownerName, bankName, accountNumber } = req.body;
      let bank = await Bank({ ownerName, bankName, accountNumber });
      await bank.save();

      req.flash("alertMessage", "add new bank is successfull");
      req.flash("alertStatus", "success");

      res.redirect("/bank");
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  viewUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      const { name } = req.session?.user;

      res.render("admin/bank/update", {
        bank,
        name,
        title: "Bank",
      });
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
  actionUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const { ownerName, bankName, accountNumber } = req.body;

      const bank = await Bank.findOneAndUpdate(
        { _id: id },
        { ownerName, bankName, accountNumber }
      );

      req.flash("alertMessage", `Update ${ownerName}'s bank is successfull`);
      req.flash("alertStatus", "success");
      res.redirect("/bank");
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      const bank = await Bank.findOneAndRemove({ _id: id });

      req.flash("alertMessage", `Bank with id ${id} is deleted successfully`);
      req.flash("alertStatus", "success");

      res.redirect("/bank");
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/bank");
    }
  },
};
