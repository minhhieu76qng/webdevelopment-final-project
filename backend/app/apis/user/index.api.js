const router = require("express").Router();

router.use("/account", require("./account.api"));
router.use("/auth", require("./auth.api"));

module.exports = router;
