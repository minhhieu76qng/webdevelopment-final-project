const router = require("express").Router();

router.use("/accounts", require("./account.api"));
router.use("/auth", require("./auth.api"));

module.exports = router;
