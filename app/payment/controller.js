const Payment = require("./model");
const Bank = require("../bank/model");

module.exports = {
  index: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");

    const alert = { message: alertMessage, status: alertStatus };

    const payment = await Payment.find().populate("banks");
    const { name } = req.session.user;
    try {
      res.render("admin/payment/view_payment", {
        payment,
        alert,
        name,
        title: "Payment",
      });
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alert status", "danger");
      res.redirect("/payment");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const banks = await Bank.find();
      const { name } = req.session.user;
      res.render("admin/payment/create", {
        banks,
        name,
        title: "Payment",
      });
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { banks, type } = req.body;

      let payment = await Payment({
        banks,
        type,
      });
      await payment.save();

      req.flash("alertMessage", "add new payment type is successfull");
      req.flash("alertStatus", "success");

      res.redirect("/payment");
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  viewUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findOne({ _id: id }).populate("banks");
      const banks = await Bank.find();
      const { name } = req.session.user;

      res.render("admin/payment/update", {
        payment,
        banks,
        name,
        title: "Payment",
      });
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  actionUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const { banks, type } = req.body;

      await Payment.findOneAndUpdate(
        { _id: id },
        {
          banks,
          type,
        }
      );

      req.flash("alertMessage", `Update Payment with id ${id} is successfull`);
      req.flash("alertStatus", "success");
      res.redirect("/payment");
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      const payment = await Payment.findOneAndRemove({ _id: id });

      req.flash(
        "alertMessage",
        `payment with id ${id} is deleted successfully`
      );
      req.flash("alertStatus", "success");

      res.redirect("/payment");
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;

      let payment = await Payment.findOne({ _id: id });

      let paymentStatus = payment.status === "Y" ? "N" : "Y";

      payment = await Payment.findOneAndUpdate(
        { _id: id },
        { status: paymentStatus }
      );

      req.flash("alertMessage", `Status payment with id ${id} is updated`);
      req.flash("alertStatus", "success");

      res.redirect("/payment");
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/payment");
    }
  },
};
