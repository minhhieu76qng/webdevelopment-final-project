const router = require("express").Router();
const { authenticateUser, authorize } = require("../../middlewares/auth.mdw");
const { ROLES } = require("../../constance/constance");

router.get(
  "/u/:toUserId",
  authenticateUser(),
  authorize([ROLES.student, ROLES.teacher]),
  (req, res, next) => {
    const { toUserId } = req.params;
  }
);
