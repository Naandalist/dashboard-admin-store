module.exports = {
  isLoginAdmin: (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash(
        "alertMessage",
        "Your session has been expired. You can login back, please."
      );
      req.flash("alert status", "danger");
      res.redirect("/");
    } else {
      next();
    }
  },
};
