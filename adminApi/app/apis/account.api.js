const router = require("express").Router();
const httpCode = require("http-status-codes");
const accountService = require("../services/account.service");
const { authorize } = require("../middlewares/auth.mdw");
const { ROLES } = require("../constance/role");

router.post("/", authorize(ROLES.root), (req, res, next) => {
  accountService
    .createNewLocalUser(req.body)
    .then(result => {
      return res.status(httpCode.CREATED).json({
        _id: result._id,
        name: result.name
      });
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
