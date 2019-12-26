const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  msg: {
    type: String,
    required: true
  },
  roomId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  from: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  time: {
    type: Date,
    default: new Date()
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

const Message = mongoose.model("messages", MessageSchema);
module.exports = {
  Message
};
