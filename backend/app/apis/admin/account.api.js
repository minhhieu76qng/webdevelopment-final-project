const router = require("express").Router();
const httpCode = require("http-status-codes");
const _ = require("lodash");
const accountService = require("../../services/account.service");
const { authorize } = require("../../middlewares/auth.mdw");
const { ROLES } = require("../../constance/constance");

router.post("/", authorize(ROLES.root), (req, res, next) => {
  accountService
    .createNewAdmin(req.body)
    .then(result => {
      return res.status(httpCode.CREATED).json({
        _id: result._id,
        name: result.name
      });
    })
    .catch(err => {
      return next(err);
    });
});

router.get(
  "/",
  authorize([ROLES.root, ROLES.admin]),
  async (req, res, next) => {
    let page = _.toInteger(req.query.page) || 1;
    let limit = _.toInteger(req.query.limit) || 10;

    if (page <= 0) {
      page = 1;
    }

    if (limit <= 0) {
      limit = 10;
    }

    try {
      const { list, total } = await accountService.getAccounts(page - 1, limit);
      return res.status(httpCode.OK).json({
        list,
        total
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.get(
  "/:id",
  authorize([ROLES.admin, ROLES.root]),
  async (req, res, next) => {
    const { id } = req.params;

    console.log(id);

    try {
      const account = await accountService.getInfo(id);

      return res.status(httpCode.OK).json({
        account
      });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
