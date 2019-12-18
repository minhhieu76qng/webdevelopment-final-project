const router = require("express").Router();
const httpCode = require("http-status-codes");
const accountService = require("../../services/account.service");
const { ErrorHandler } = require("../../helpers/error.helper");
const { authorize, authenticateUser } = require("../../middlewares/auth.mdw");
const { ROLES } = require("../../constance/constance");

router.get(
  "/me",
  authenticateUser(),
  authorize([ROLES.student, ROLES.teacher]),
  (req, res, next) => {
    let temp = req.user;
    delete temp.local.password;
    return res.status(httpCode.OK).json({
      account: temp
    });
  }
);

router.put(
  "/:id",
  authenticateUser(),
  authorize([ROLES.student, ROLES.teacher]),
  async (req, res, next) => {
    const { id } = req.params;
    if (id != req.user._id) {
      return next(
        new ErrorHandler(
          httpCode.NOT_ACCEPTABLE,
          "Your credentials and api are not valid!"
        )
      );
    }

    try {
      const { token, updatedResult } = await accountService.updateAccount(
        req.user._id,
        req.body
      );

      return res.status(httpCode.OK).json({
        isUpdated:
          updatedResult.n === 1 && updatedResult.nModified === 1 ? true : false,
        token
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.put(
  "/:id/avatar",
  authenticateUser(),
  authorize([ROLES.student, ROLES.teacher]),
  async (req, res, next) => {
    const { id } = req.params;
    if (id != req.user._id) {
      return next(
        new ErrorHandler(
          httpCode.NOT_ACCEPTABLE,
          "Your credentials and api are not valid!"
        )
      );
    }

    await accountService.uploadAvatar(req, res);
  }
);

module.exports = router;
