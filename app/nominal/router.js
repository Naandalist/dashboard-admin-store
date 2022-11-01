const express = require("express");
const router = express.Router();

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
router.post("/create", actionCreate);
// router.get("/update/:id", viewUpdate);
// router.put("/update/:id", actionUpdate);
// router.delete("/delete/:id", actionDelete);

module.exports = router;
