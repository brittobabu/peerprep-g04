const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store documents for each room (using room name as the key)
const rooms = {};
const roomClients = {};

wss.on('connection', (ws) => {
  console.log('New client connected');

  let currentRoom = null;

  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);

      if (parsedMessage.type === 'join') {
        currentRoom = parsedMessage.roomId;

        if (!rooms[currentRoom]) {
          rooms[currentRoom] = { document: '// Start typing...' };
          roomClients[currentRoom] = new Set();
        }

        roomClients[currentRoom].add(ws);

        ws.send(JSON.stringify({ type: 'init', data: rooms[currentRoom].document }));

        broadcastToRoom(currentRoom, JSON.stringify({
          type: 'userJoined',
          message: `A user joined room: ${currentRoom}`
        }));

      } else if (parsedMessage.type === 'update') {
        if (currentRoom) {
          rooms[currentRoom].document = parsedMessage.data;

          broadcastToRoom(currentRoom, JSON.stringify({
            type: 'update',
            data: rooms[currentRoom].document
          }));
        }

      } else if (parsedMessage.type === 'suggest-question') {
        const { roomId, suggestedBy, question } = parsedMessage;

        if (roomId && question) {
          broadcastToRoom(roomId, JSON.stringify({
            type: 'receive-suggestion',
            suggestedBy,
            question
          }));
        }
      }

    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');

    if (currentRoom) {
      broadcastToRoom(currentRoom, JSON.stringify({
        type: 'userLeft',
        message: `A user left room: ${currentRoom}`
      }));

      roomClients[currentRoom].delete(ws);

      if (roomClients[currentRoom].size === 0) {
        delete rooms[currentRoom];
        delete roomClients[currentRoom];
      }
    }
  });
});

// Broadcast to all clients in a specific room
function broadcastToRoom(roomId, message) {
  if (roomClients[roomId]) {
    roomClients[roomId].forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
