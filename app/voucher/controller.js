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
      res.render("admin/voucher/view_voucher", {
        voucher,
        alert,
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

      res.render("admin/voucher/create", { categories, nominals });
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
            });

            console.log("voucher will send>>>", voucher);

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

        // await voucher.save();

        console.log("voucher will send>>>", voucher);

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
  //   viewUpdate: async (req, res) => {
  //     try {
  //       const { id } = req.params;
  //       const nominal = await Nominal.findOne({ _id: id });

  //       res.render("admin/nominal/update", {
  //         nominal,
  //       });
  //     } catch (err) {
  //       req.flash("alertMessage", err.message);
  //       req.flash("alertStatus", "danger");
  //       res.redirect("/nominal");
  //     }
  //   },
  //   actionUpdate: async (req, res) => {
  //     try {
  //       const { id } = req.params;
  //       const { coinName, coinQty, coinPrice } = req.body;

  //       const nominal = await Nominal.findOneAndUpdate(
  //         { _id: id },
  //         { name: coinName, qty: coinQty, price: coinPrice }
  //       );

  //       req.flash("alertMessage", `Update Nominal with id ${id} is successfull`);
  //       req.flash("alertStatus", "success");
  //       res.redirect("/nominal");
  //     } catch (err) {
  //       req.flash("alertMessage", err.message);
  //       req.flash("alertStatus", "danger");
  //       res.redirect("/nominal");
  //     }
  //   },
  //   actionDelete: async (req, res) => {
  //     try {
  //       const { id } = req.params;

  //       const nominal = await Nominal.findOneAndRemove({ _id: id });

  //       req.flash(
  //         "alertMessage",
  //         `Nominal with id ${id} is deleted successfully`
  //       );
  //       req.flash("alertStatus", "success");

  //       res.redirect("/nominal");
  //     } catch (err) {
  //       req.flash("alertMessage", err.message);
  //       req.flash("alertStatus", "danger");
  //       res.redirect("/nominal");
  //     }
  //   },
};
