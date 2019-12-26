const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  accounts: [
    {
      type: mongoose.Types.ObjectId
    }
  ],
  createdBy: mongoose.Types.ObjectId
});

const Room = mongoose.model("rooms", RoomSchema);

module.exports = {
  Room
};
