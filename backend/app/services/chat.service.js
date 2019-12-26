const httpCode = require("http-status-codes");
const _ = require("lodash");
const { ObjectId } = require("mongoose").Types;
const chatRepo = require("../repositories/chat.repo");
const { ErrorHandler } = require("../helpers/error.helper");
const accountService = require("./account.service");
module.exports = {
  createMessage: async function({ from, roomId, msg, date }) {
    let current = new Date(date);
    if (!ObjectId.isValid(from) || !ObjectId.isValid(roomId)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Require valid ObjectId");
    }

    if (!_.isString(msg) || msg.length === 0) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Message must be a string.");
    }

    if (!_.isDate(new Date(current))) {
      throw new ErrorHandler(
        httpCode.BAD_REQUEST,
        "The send date is not valid."
      );
    }

    const room = await chatRepo.findRoomById(roomId);
    if (!room) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Room not found.");
    }

    const message = await chatRepo.createMessage({
      from,
      roomId,
      msg,
      current
    });
    return {
      room,
      message
    };
  },

  getRooms: async function(accountId) {
    const result = await chatRepo.findRoomsByAccount(accountId);
    let temp = [...result];

    temp = temp.map(room => {
      let tmp = { ...room };
      // kiem tra room
      if (
        _.toString(tmp.createdBy) !== _.toString(accountId) &&
        tmp.messages.length === 0
      ) {
        return null;
      }

      let avatar = null,
        name = null;
      for (let i = 0; i < tmp.accounts.length; i += 1) {
        const acc = tmp.accounts[i];
        if (_.toString(acc._id) !== _.toString(accountId)) {
          avatar = acc.avatar;
          name = `${acc.name.firstName} ${acc.name.lastName}`;
          break;
        }
      }

      tmp.avatar = avatar;
      tmp.name = name;
      return tmp;
    });

    temp = temp.filter(val => val !== null);

    return temp;
  },

  createRoom: async function(from, to) {
    if (!(ObjectId.isValid(from) && ObjectId.isValid(to))) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "User ID is not valid.");
    }

    const toAccount = await accountService.findById(to);
    if (!toAccount) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Not found receiver.");
    }

    // kiem tra cac room da co from va to hay chua
    const exists = await chatRepo.checkExistRoom(from, to);
    if (exists && exists.length > 0) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Room is existed");
    }

    return await chatRepo.createRoom(from, to);
  },

  getMsgInRoom: async function(roomId, userId) {
    if (!ObjectId.isValid(roomId)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Room ID is not valid.");
    }

    const room = await chatRepo.findRoomById(roomId);
    if (!room) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Room not found.");
    }

    if (!room.accounts.includes(userId)) {
      throw new ErrorHandler(httpCode.BAD_REQUEST, "Not your room.");
    }

    return await chatRepo.findMsgInRoom(roomId);
  }
};
