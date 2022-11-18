const Voucher = require("./model");
const Category = require("../category/model");
const Nominal = require("../nominal/model");

const fs = require("fs");
const path = require("path");
const config = require("../../config");

module.exports = {
  index: async (req, res) => {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");

    const alert = { message: alertMessage, status: alertStatus };

    const voucher = await Voucher.find()
      .populate("category")
      .populate("nominals");
    try {
      const { name } = req.session.user;
      res.render("admin/voucher/view_voucher", {
        voucher,
        alert,
        name,
        title: "Voucher",
        appUrl: config.appUrl,
      });
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alert status", "danger");
      res.redirect("/voucher");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const categories = await Category.find();
      const nominals = await Nominal.find();

      const { name } = req.session.user;
      res.render("admin/voucher/create", {
        categories,
        nominals,
        name,
        title: "Voucher",
      });
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { gameName, gameCategory, voucherNominals } = req.body;

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
            const voucher = new Voucher({
              name: gameName,
              category: gameCategory,
              nominals: voucherNominals,
              thumbnail: fileName,
              user: req.session.user.id,
            });

            await voucher.save();

            req.flash("alertMessage", "add new game voucher is successfull");
            req.flash("alertStatus", "success");

            res.redirect("/voucher");
          } catch (err) {
            req.flash("alertMessage", `upload data error: ${err.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/voucher");
          }
        });
      } else {
        const voucher = new Voucher({
          name: gameName,
          category: gameCategory,
          nominals: voucherNominals,
        });

        await voucher.save();

        req.flash("alertMessage", "add new game voucher is successfull");
        req.flash("alertStatus", "success");

        res.redirect("/voucher");
      }
    } catch (err) {
      req.flash("alertMessage", `action create error: ${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  viewUpdate: async (req, res) => {
    try {
      const { id } = req.params;

      const categories = await Category.find();
      const nominals = await Nominal.find();

      const voucher = await Voucher.findOne({ _id: id })
        .populate("category")
        .populate("nominals");

      const { name } = req.session.user;
      res.render("admin/voucher/update", {
        voucher,
        categories,
        nominals,
        name,
        title: "Voucher",
        appUrl: config.appUrl,
      });
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  actionUpdate: async (req, res) => {
    try {
      const { id } = req.params;
      const { gameName, gameCategory, voucherNominals } = req.body;

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
            const voucher = await Voucher.findOne({ _id: id });
            let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Voucher.findOneAndUpdate(
              { _id: id },
              {
                name: gameName,
                category: gameCategory,
                nominals: voucherNominals,
                thumbnail: fileName,
              }
            );

            req.flash(
              "alertMessage",
              `update voucher ${gameName} is successfull`
            );
            req.flash("alertStatus", "success");

            res.redirect("/voucher");
          } catch (err) {
            req.flash("alertMessage", `upload data error: ${err.message}`);
            req.flash("alertStatus", "danger");

            res.redirect("/voucher");
          }
        });
      } else {
        await Voucher.findOneAndUpdate(
          { _id: id },
          {
            name: gameName,
            category: gameCategory,
            nominals: voucherNominals,
          }
        );

        req.flash("alertMessage", `update voucher ${gameName} is successfull`);
        req.flash("alertStatus", "success");

        res.redirect("/voucher");
      }
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      const voucher = await Voucher.findOneAndRemove({ _id: id });

      //define stored image path url
      let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

      //delete unused image
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      req.flash(
        "alertMessage",
        `Voucher with id ${id} is deleted successfully`
      );
      req.flash("alertStatus", "success");

      res.redirect("/voucher");
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;

      let voucher = await Voucher.findOne({ _id: id });

      let voucherStatus = voucher.status === "Y" ? "N" : "Y";

      voucher = await Voucher.findOneAndUpdate(
        { _id: id },
        { status: voucherStatus }
      );

      req.flash("alertMessage", `Status voucher with id ${id} is updated`);
      req.flash("alertStatus", "success");

      res.redirect("/voucher");
    } catch (err) {
      req.flash("alertMessage", err.message);
      req.flash("alertStatus", "danger");
      res.redirect("/voucher");
    }
  },
};
