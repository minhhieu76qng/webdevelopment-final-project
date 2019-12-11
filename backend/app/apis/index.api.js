const router = require("express").Router();

router.use("/admin", require("./admin/index.api"));
router.use("/user", require("./user/index.api"));

module.exports = router;
