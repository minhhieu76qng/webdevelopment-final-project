const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  from: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  to: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  msg: {
    type: String,
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

/*
msg: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: new Date()
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  roomId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  from: {
    type: mongoose.Types.ObjectId,
    required: true
  }
  */
