const Player = require("../player/model");

const fs = require("fs");
const path = require("path");
const config = require("../../config");

module.exports = {
  signUp: async (req, res, next) => {
    try {
      //   const { name, email, username, password } = req.body;
      const payload = req.body;

      if (req.file) {
        let tempPath = req.file.path;

        let originalExt =
          req.file.originalname.split(".")[
            req.file.originalname.split(".").length - 1
          ];

        let fileName = req.file.filename + "." + originalExt;

        let targetPath = path.resolve(
          config.rootPath,
          `public/uploads/${fileName}`
        );

        const src = fs.createReadStream(tempPath);
        const dest = fs.createWriteStream(targetPath);

        src.pipe(dest);

        src.on("end", async () => {
          try {
            const player = new Player({
              ...payload,
              avatar: fileName,
            });

            await player.save();

            //delete original password string, because we just save only the hashed
            delete player._doc.password;

            res.status(201).json({
              data: player,
            });
          } catch (err) {
            if (err && err.name === "ValidationError") {
              return res
                .status(422)
                .json({ error: 1, message: err.message, fields: err.errors });
            }
            next(err);
          }
        });
      } else {
        const player = new Player(payload);
        await player.save();

        delete player._doc.password;

        res.status(201).json({
          data: player,
        });
      }
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
