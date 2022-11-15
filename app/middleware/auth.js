const jwt = require("jsonwebtoken");
const config = require("../../config");
const Player = require("../player/model");

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
  isLoginPlayer: async (req, res, next) => {
    try {
      const authorization = req.headers.authorization;
      const token = authorization.replace("Bearer ", "");

      const data = jwt.verify(token, config.jwtKey);
      const player = await Player.findOne({ _id: data.player.id });

      if (!player || player === null) throw new Error();

      req.player = player;
      req.token = token;
      next();
    } catch (error) {
      res.status(401).json({ error: "No authorized access" });
    }
  },
};
