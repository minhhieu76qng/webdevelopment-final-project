const pIO = require("socket.io");
const chatService = require("./services/chat.service");
module.exports = function(server) {
  const io = pIO(server);

  const activeUser = {};

  io.on("connection", socket => {
    socket.on("NEW_USER", (id, callback) => {
      if (id in activeUser) {
        callback(false);
      } else {
        socket.accountId = id;
        activeUser[socket.accountId] = socket;
        callback(true);
      }
      console.log("In: ", Object.keys(activeUser).length);
    });

    socket.on("SEND_MESSAGE", async (data, callback) => {
      let payload = { ...data };
      payload.from = socket.accountId;
      // luu vao trong db
      try {
        const result = await chatService.addNewMessage(payload);
        if (result) {
          if (payload.to in activeUser) {
            // emit event toi socket con lai
            activeUser[payload.to].emit("RECEIVE_MESSAGE", result);
          }
          callback();
        }
      } catch (err) {
        callback("Can't send message");
      }
    });

    socket.on("disconnect", function() {
      if (!socket.accountId) return;
      delete activeUser[socket.accountId];
      console.log("OUT: ", Object.keys(activeUser).length);
    });
  });
};
