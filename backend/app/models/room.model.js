const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema(
  {
    account: {
      type: Array,
      required: true
    }
  },
  { timestamps: true }
);

const Room = mongoose.model("rooms", RoomSchema);

module.exports = {
  Room
};
