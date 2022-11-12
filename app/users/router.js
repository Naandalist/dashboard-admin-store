const express = require("express");
const router = express.Router();

const { viewSignIn, actionSignIn, actionLogOut } = require("./controller");

router.get("/", viewSignIn);
router.post("/", actionSignIn);
router.get("/logout", actionLogOut)

module.exports = router;
