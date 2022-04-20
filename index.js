const io = require("socket.io")("https://tiny-fox-3c36d5.netlify.app", {
  "rejectUnauthorized": false,
    cors: {
      origin: "https://beamish-cascaron-902bd4.netlify.app",
    },
  });

  let users = []
  
  const addUser = (userId, socketId) => {
    !users.some((user) => user?.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user?.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    return users.find((user) => user?.userId === userId);
  };
  
  io.on("connection", (socket) => {


    //when ceonnect
    console.log("a user connected.");
  
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket?.id);
      io.emit("getUsers", users);
    });
  
    //send and get message
    socket.on("sendMessage", ({ fromId, toId, message }) => {
      const user = getUser(toId);
      io.to(user?.socketId).emit("getMessage", {
        fromId,
        message,
      });
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket?.id);
      io.emit("getUsers", users);
    });
    });