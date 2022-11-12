const User = require("./model");
const bcrypt = require("bcryptjs");

module.exports = {
  viewSignIn: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");

    const alert = { message: alertMessage, status: alertStatus };

    try {
      if (req.session.user) {
        res.redirect("/dashboard");
      } else {
        res.render("admin/users/view_signin", {
          alert,
        });
      }
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alert status", "danger");
      res.redirect("/");
    }
  },
  actionSignIn: async (req, res) => {
    try {
      const { email, password } = req.body;

      const checkUser = await User.findOne({ email: email });

      if (checkUser) {
        if (checkUser.status === "Y") {
          const checkPassword = await bcrypt.compare(
            password,
            checkUser.password
          );

          if (checkPassword) {
            const user = checkUser;
            req.session.user = {
              id: user._id,
              email: user.email,
              status: user.status,
              name: user.name,
            };

            res.redirect("/dashboard");
          } else {
            req.flash("alertMessage", "Password is incorrect");
            req.flash("alert status", "danger");
            res.redirect("/");
          }
        } else {
          req.flash("alertMessage", "Your account is not active");
          req.flash("alert status", "danger");
          res.redirect("/");
        }
      } else {
        req.flash("alertMessage", "Oops. Email is not registered.");
        req.flash("alert status", "danger");
        res.redirect("/");
      }
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alert status", "danger");
      res.redirect("/");
    }
  },
};
