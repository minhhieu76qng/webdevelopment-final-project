const router = require("express").Router();
const httpCode = require("http-status-codes");
const teacherService = require("../../services/teacher.service");
const { authenticateUser, authorize } = require("../../middlewares/auth.mdw");
const { ROLES } = require("../../constance/constance");
const { ErrorHandler } = require("../../helpers/error.helper");

router.get(
  "/me",
  authenticateUser(),
  authorize([ROLES.teacher]),
  async (req, res, next) => {
    const accountId = req.user._id;
    try {
      const teacher = await teacherService.getTeacherTags(accountId);
      return res.status(httpCode.OK).json({ teacher });
    } catch (err) {
      return next(err);
    }
  }
);

router.put(
  "/:id/price",
  authenticateUser(),
  authorize([ROLES.teacher]),
  async (req, res, next) => {
    const { id } = req.params;
    const { price } = req.body;

    try {
      const { isUpdated } = await teacherService.updatePrice(id, price);
      return res.status(httpCode.OK).json({ isUpdated });
    } catch (err) {
      return next(err);
    }
  }
);

router.put(
  "/:id/tags",
  authenticateUser(),
  authorize(ROLES.teacher),
  async (req, res, next) => {}
);

module.exports = router;
