const { Message } = require("../models/message.model");
module.exports = {
  add: async function({ from, to, msg, date }) {
    const mess = new Message({ from, to, msg, time: date });
    const result = await mess.save();
    return result;
  },

  find: async function(filter) {
    return await Message.find(filter);
  }
};
