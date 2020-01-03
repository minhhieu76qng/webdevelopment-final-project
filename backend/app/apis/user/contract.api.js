const router = require("express").Router();
const httpCode = require("http-status-codes");
const _ = require("lodash");
const { authenticateUser, authorize } = require("../../middlewares/auth.mdw");
const { ROLES } = require("../../constance/constance");
const contractService = require("../../services/contract.service");

// yêu cầu một hợp đồng tới người dạy | cần gửi một tin nhắn tới người dạy
router.post(
  "/",
  authenticateUser(),
  authorize([ROLES.student]),
  async (req, res, next) => {
    try {
      const { contractId } = await contractService.sendRequest(req.body);

      return res.status(httpCode.OK).json({
        created: true,
        contractId
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.get(
  "/",
  authenticateUser(),
  authorize([ROLES.student, ROLES.teacher]),
  async (req, res, next) => {
    try {
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
