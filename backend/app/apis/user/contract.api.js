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
      const { contractId } = await contractService.sendRequest({
        ...req.body,
        studentAccountId: _.toString(req.user._id)
      });

      return res.status(httpCode.OK).json({
        created: true,
        contractId
      });
    } catch (err) {
      return next(err);
    }
  }
);

// get all
router.get(
  "/",
  authenticateUser(),
  authorize([ROLES.student, ROLES.teacher]),
  async (req, res, next) => {
    let { limit, page } = req.query;
    try {
      const result = await contractService.getAllContracts(
        req.user._id,
        limit,
        page
      );
      return res.status(httpCode.OK).json({
        ...result
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.get(
  "/active",
  authenticateUser(),
  authorize([ROLES.student, ROLES.teacher]),
  async (req, res, next) => {
    let { limit, page } = req.query;
    try {
      const result = await contractService.getAcceptedContracts(
        req.user._id,
        limit,
        page
      );
      return res.status(httpCode.OK).json({
        ...result
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.get(
  "/pending",
  authenticateUser(),
  authorize([ROLES.student, ROLES.teacher]),
  async (req, res, next) => {
    let { limit, page } = req.query;
    try {
      const result = await contractService.getPendingContracts(
        req.user._id,
        limit,
        page
      );
      return res.status(httpCode.OK).json({
        ...result
      });
    } catch (err) {
      return next(err);
    }
  }
);

// accept contract
router.put(
  "/:id/accept",
  authenticateUser(),
  authorize(ROLES.teacher),
  (req, res, next) => {
    const { contractId } = req.params;
  }
);

// reject contract -> teacher -> change status

// cancel contract -> student -> delete
module.exports = router;
