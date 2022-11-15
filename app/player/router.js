const express = require("express");
const router = express.Router();
const {
  landingPage,
  detailPage,
  category,
  checkout,
  historyTransaction,
} = require("./controller");
const { isLoginPlayer } = require("../middleware/auth");

router.get("/landingpage", landingPage);
router.get("/:id/details", detailPage);
router.get("/category", category);
router.post("/checkout", isLoginPlayer, checkout);
router.get("/history", isLoginPlayer, historyTransaction);

module.exports = router;
