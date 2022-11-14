const express = require("express");
const router = express.Router();
const { landingPage, detailPage, category } = require("./controller");

router.get("/landingpage", landingPage);
router.get("/:id/details", detailPage);
router.get("/category", category);

module.exports = router;
