const httpCode = require("http-status-codes");
const _ = require("lodash");
const { ObjectId } = require("mongoose").Types;
const chatRepo = require("../repositories/chat.repo");
const { ErrorHandler } = require("../helpers/error.helper");
module.exports = {
  addNewMessage: async function({ from, to, msg, date }) {
    let current = new Date(date);
    if (!ObjectId.isValid(from) || !ObjectId.isValid(to)) {
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

    // kiem tra room theo from, to
    // tao room

    return await chatRepo.add({ from, to, msg, current });
  },

  getChatsWithUser: async function(accountId) {
    return await chatRepo.find({ to: accountId });
  }
};
