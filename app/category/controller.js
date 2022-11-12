const Category = require("./model");

module.exports = {
  index: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");

    const alert = { message: alertMessage, status: alertStatus };

    const category = await Category.find();
    const { name } = req.session.user;
    try {
      res.render("admin/category/view_category", {
        category,
        alert,
        name,
        title: "Category",
      });
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alert status", "danger");
      res.redirect("/category");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const { name } = req.session.user;
      res.render("admin/category/create", { name, title: "Category" });
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { categoryName } = req.body;
      const name = categoryName;
      let category = await Category({ name });
      await category.save();

      req.flash("alertMessage", "add new category is successfully");
      req.flash("alertStatus", "success");

      res.redirect("/category");
      s;
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },
  viewUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      const { name } = req.session.user;

      res.render("admin/category/update", {
        category,
        name,
        title: "Category",
      });
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },
  actionUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const { categoryName } = req.body;

      const category = await Category.findOneAndUpdate(
        { _id: id },
        { name: categoryName }
      );

      req.flash(
        "alertMessage",
        `Update category ${categoryName} is successfully`
      );
      req.flash("alertStatus", "success");
      res.redirect("/category");
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },

  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await Category.findOneAndRemove({ _id: id });

      req.flash(
        "alertMessage",
        `Category with id ${id} is deleted successfully`
      );
      req.flash("alertStatus", "success");

      res.redirect("/category");
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/category");
    }
  },
};
