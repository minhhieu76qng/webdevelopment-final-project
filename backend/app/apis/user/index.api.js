const router = require("express").Router();

router.use("/accounts", require("./account.api"));
router.use("/auth", require("./auth.api"));
router.use("/teachers", require("./teacher.api"));

module.exports = router;
