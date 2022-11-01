const Category = require("./model");

module.exports = {
  index: async (req, res) => {
    const category = await Category.find();
    try {
      res.render("admin/category/view_category", {
        category,
      });
    } catch (error) {
      console.log("error: ", error);
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("admin/category/create", {});
    } catch (error) {
      console.log("err: ", error);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { categoryName } = req.body;
      const name = categoryName;
      let category = await Category({ name });
      await category.save();

      res.redirect("/category");
    } catch (error) {
      console.log(error);
    }
  },
  viewUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });

      console.log("category: ", category);

      res.render("admin/category/update", {
        category,
      });
    } catch (error) {
      console.log("err: ", error);
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

      console.log("category: ", category)
      res.redirect("/category");
    } catch (err) {
      console.log(err);
    }
  },
};
