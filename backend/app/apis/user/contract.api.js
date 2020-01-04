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

// get all
router.get(
  "/",
  authenticateUser(),
  authorize([ROLES.student, ROLES.teacher]),
  async (req, res, next) => {
    let { limit, page } = req.body;
    try {
      const { contracts, total } = await contractService.getAllContracts(
        req.user._id,
        limit,
        page
      );
      return res.status(httpCode.OK).json({
        contracts,
        total
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
    let { limit, page } = req.body;
    try {
      const { contracts, total } = await contractService.getAcceptedContracts(
        req.user._id,
        limit,
        page
      );
      return res.status(httpCode.OK).json({
        contracts,
        total
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
    let { limit, page } = req.body;
    try {
      const { contracts, total } = await contractService.getPendingContracts(
        req.user._id,
        limit,
        page
      );
      return res.status(httpCode.OK).json({
        contracts,
        total
      });
    } catch (err) {
      return next(err);
    }
  }
);

// reject contract
router.put(
  "/:id",
  authenticateUser(),
  authorize(ROLES.teacher),
  (req, res, next) => {
    const { contractId } = req.params;
  }
);

module.exports = router;
