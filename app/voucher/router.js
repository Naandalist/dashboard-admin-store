const express = require("express");
const router = express.Router();
const multer = require("multer");
const os = require("os");

const {
  index,
  viewCreate,
  actionCreate,
  //   viewUpdate,
  //   actionUpdate,
  //   actionDelete,
} = require("./controller");

router.get("/", index);
router.get("/create", viewCreate);
router.post(
  "/create",
  multer({ dest: os.tmpdir() }).single("voucherImage"),
  actionCreate
);
// router.get("/update/:id", viewUpdate);
// router.put("/update/:id", actionUpdate);
// router.delete("/delete/:id", actionDelete);

module.exports = router;
