const router = require("express").Router();

router.use("/admin", require("./admin/index.api"));
router.use("/user", require("./user/index.api"));
router.use("/tags", require("./tag.api"));

module.exports = router;
