const Nominal = require("./model");

module.exports = {
  index: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");

    const alert = { message: alertMessage, status: alertStatus };

    const nominal = await Nominal.find();
    try {
      res.render("admin/nominal/view_nominal", {
        nominal,
        alert,
      });
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alert status", "danger");
      res.redirect("/nominal");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/nominal/create", {});
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { coinName, coinQty, coinPrice } = req.body;

      let nominal = await Nominal({
        name: coinName,
        qty: coinQty,
        price: coinPrice,
      });
      await nominal.save();

      req.flash("alertMessage", "add new nominal is successfull");
      req.flash("alertStatus", "success");

      res.redirect("/nominal");
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
  viewUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const nominal = await Nominal.findOne({ _id: id });

      res.render("admin/nominal/update", {
        nominal,
      });
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
  actionUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const { coinName, coinQty, coinPrice } = req.body;

      const nominal = await Nominal.findOneAndUpdate(
        { _id: id },
        { name: coinName, qty: coinQty, price: coinPrice }
      );

      req.flash("alertMessage", `Update Nominal with id ${id} is successfull`);
      req.flash("alertStatus", "success");
      res.redirect("/nominal");
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      const nominal = await Nominal.findOneAndRemove({ _id: id });

      req.flash(
        "alertMessage",
        `Nominal with id ${id} is deleted successfully`
      );
      req.flash("alertStatus", "success");

      res.redirect("/nominal");
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/nominal");
    }
  },
};
