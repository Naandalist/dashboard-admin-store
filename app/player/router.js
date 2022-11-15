const express = require("express");
const router = express.Router();
const {
  landingPage,
  detailPage,
  category,
  checkout,
  historyTransaction,
  historyTransactionDetail,
  dashboard,
} = require("./controller");
const { isLoginPlayer } = require("../middleware/auth");

router.get("/landingpage", landingPage);
router.get("/:id/details", detailPage);
router.get("/category", category);
router.post("/checkout", isLoginPlayer, checkout);
router.get("/history", isLoginPlayer, historyTransaction);
router.get("/historydetail/:id", isLoginPlayer, historyTransactionDetail);
router.get("/dashboard", isLoginPlayer, dashboard);

module.exports = router;
