const express = require("express");
const router = express.Router();
const multer = require("multer");
const os = require("os");

const {
  landingPage,
  detailPage,
  category,
  checkout,
  historyTransaction,
  historyTransactionDetail,
  dashboard,
  profile,
  updateProfile,
} = require("./controller");
const { isLoginPlayer } = require("../middleware/auth");

router.get("/landingpage", landingPage);
router.get("/:id/details", detailPage);
router.get("/category", category);
router.post("/checkout", isLoginPlayer, checkout);
router.get("/history", isLoginPlayer, historyTransaction);
router.get("/historydetail/:id", isLoginPlayer, historyTransactionDetail);
router.get("/dashboard", isLoginPlayer, dashboard);
router.get("/profile", isLoginPlayer, profile);
router.put(
  "/profile",
  isLoginPlayer,
  multer({ dest: os.tmpdir() }).single("avatar"),
  updateProfile
);

module.exports = router;
