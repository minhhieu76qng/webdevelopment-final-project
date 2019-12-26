const router = require("express").Router();
const httpCode = require("http-status-codes");
const { authenticateUser, authorize } = require("../../middlewares/auth.mdw");
const { ROLES } = require("../../constance/constance");
const chatService = require("../../services/chat.service");

router.get(
  "/rooms",
  authenticateUser(),
  authorize([ROLES.student, ROLES.teacher]),
  async (req, res, next) => {
    try {
      const rooms = await chatService.getRooms(req.user._id);
      return res.status(httpCode.OK).json({
        rooms
      });
    } catch (err) {
      return next(err);
    }
  }
);

router.post(
  "/rooms",
  authenticateUser(),
  authorize([ROLES.student, ROLES.teacher]),
  async (req, res, next) => {
    const { toAccount } = req.body;
    const userId = req.user._id;
    try {
      const result = await chatService.createRoom(userId, toAccount);
      return res.status(httpCode.OK).json({ room: result });
    } catch (err) {
      return next(err);
    }
  }
);

// get message trong room
router.get(
  "/rooms/:roomId/messages",
  authenticateUser(),
  authorize([ROLES.student, ROLES.teacher]),
  async (req, res, next) => {
    const { roomId } = req.params;
    try {
      const messages = await chatService.getMsgInRoom(roomId, req.user._id);
      return res.status(httpCode.OK).json({
        messages,
        roomId
      });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
