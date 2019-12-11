const router = require("express").Router();
const { authenticateAdmin } = require("../../middlewares/auth.mdw");

router.use("/accounts", authenticateAdmin(), require("./account.api"));
router.use("/auth", require("./auth.api"));

module.exports = router;
