const router = require("express").Router();
const httpCode = require("http-status-codes");
const _ = require("lodash");
const teacherService = require("../../services/teacher.service");
const { authenticateUser, authorize } = require("../../middlewares/auth.mdw");
const { ROLES } = require("../../constance/constance");

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
  "/me/price",
  authenticateUser(),
  authorize([ROLES.teacher]),
  async (req, res, next) => {
    const { price } = req.body;

    try {
      const { isUpdated } = await teacherService.updatePrice(
        req.user._id,
        price
      );
      return res.status(httpCode.OK).json({ isUpdated });
    } catch (err) {
      return next(err);
    }
  }
);

router.put(
  "/me/tags",
  authenticateUser(),
  authorize(ROLES.teacher),
  async (req, res, next) => {
    const { tags } = req.body;

    try {
      const { isUpdated } = await teacherService.updateTags(req.user._id, tags);
      return res.status(httpCode.OK).json({
        isUpdated
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.put(
  "/me/intro",
  authenticateUser(),
  authorize(ROLES.teacher),
  async (req, res, next) => {
    const { intro } = req.body;

    try {
      const { isUpdated } = await teacherService.updateIntro(
        req.user._id,
        intro
      );
      return res.status(httpCode.OK).json({
        isUpdated
      });
    } catch (err) {
      return next(err);
    }
  }
);

// ---------------------------
router.get("/impressed", async (req, res, next) => {
  let limit = req.query.limit || 5;

  limit = _.toInteger(limit);
  if (!_.isInteger(limit)) {
    limit = 5;
  }

  try {
    const teachers = await teacherService.getImpressedTeacher(limit);
    return res.status(httpCode.OK).json({ teachers });
  } catch (err) {
    return next(err);
  }
});

router.get("/cat/:catId", async (req, res, next) => {
  const { catId } = req.params;
  // let limit = req.query.limit || 10,
  //   page = req.query.page || 1;

  // limit = _.toInteger(limit);
  // if (!_.isInteger(_.toInteger(limit))) {
  //   limit = 10;
  // }

  // page = _.toInteger(page);
  // if (!_.isInteger(_.toInteger(page))) {
  //   page = 1;
  // }

  try {
    const { teachers } = await teacherService.getTeachersByCatId(
      catId
      // limit,
      // page - 1
    );
    return res.status(httpCode.OK).json({
      teachers
      // total
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const teacher = await teacherService.getTeacherById(id);

    return res.status(httpCode.OK).json({ teacher });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
