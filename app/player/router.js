const express = require("express");
const router = express.Router();
const { landingPage, detailPage } = require("./controller");

router.get("/landingpage", landingPage);
router.get("/:id/details", detailPage);

module.exports = router;
