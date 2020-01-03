const _ = require("lodash");
const { ObjectId } = require("mongoose").Types;
const { Message } = require("../models/message.model");
const { Room } = require("../models/room.model");
module.exports = {
  createMessage: async function({ from, roomId, msg, date }) {
    const mess = new Message({ from, roomId, msg, time: date });
    const result = await mess.save();
    return result;
  },

  findMsgInRoom: async function(roomId) {
    return await Message.find({ roomId });
  },

  findRoomsByAccount: async function(accountId) {
    return await Room.aggregate([
      {
        $match: {
          accounts: ObjectId(accountId)
        }
      },
      {
        $lookup: {
          from: "accounts",
          localField: "accounts",
          foreignField: "_id",
          as: "out"
        }
      },
      {
        $project: {
          _id: 1,
          out: 1,
          createdBy: 1
        }
      },
      {
        $project: {
          _id: 1,
          accounts: "$out",
          createdBy: 1
        }
      },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "roomId",
          as: "messages"
        }
      }
    ]);
  },

  findRoomById: async function(id) {
    return await Room.findById(id);
  },

  createRoom: async function(from, to) {
    const room = new Room({ accounts: [from, to], createdBy: from });
    return await room.save();
  },

  checkExistRoom: async function(from, to) {
    const rooms = await Room.find({
      accounts: { $all: [ObjectId(from), ObjectId(to)] }
    });

    if (_.isArray(rooms) && rooms.length > 0) {
      return rooms[0];
    }
    return null;
  }
};
