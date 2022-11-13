const Player = require("../player/model");

module.exports = {
  signUp: async (req, res, next) => {
    try {
      //   const { name, email, username, password } = req.body;
      const payload = req.body;

      if (req.file) {
      } else {
        const player = new Player(payload);
        await player.save();

        delete player._doc.password;

        res.status(201).json({
          data: player,
        });
      }

      res.status(201).json({
        message: payload,
      });
    } catch (err) {
      if (err && err.name === "ValidationError") {
        return res
          .status(422)
          .json({ error: 1, message: err.message, fields: err.errors });
      }
      next(err);
    }
  },
};
