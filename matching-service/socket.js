let io = null;
const socketMap = {};

function initSocket(serverIO) {
  io = serverIO;

  io.on('connection', (socket) => {
    console.log(' New client connected:', socket.id);
    
    socket.on('register', (userId) => {
      socketMap[userId] = socket.id;
      console.log(`Registered user ${userId} with socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
      for (const [userId, sockId] of Object.entries(socketMap)) {
        if (sockId === socket.id) {
          delete socketMap[userId];
          console.log(`Disconnected user ${userId}`);
        }
      }
    });
  });
}

function getIO() {
  return io;
}

function getSocketMap() {
  return socketMap;
}

module.exports = { initSocket, getIO, getSocketMap };
