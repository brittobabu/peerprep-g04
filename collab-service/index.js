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

// Store clients for each room (using room name as the key)
const roomClients = {};

wss.on('connection', (ws) => {
  console.log('New client connected');

  let currentRoom = null;

  // Send the current document state to the new client
  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);

      if (parsedMessage.type === 'join') {
        // Join a room
        currentRoom = parsedMessage.roomId;

        if (!rooms[currentRoom]) {
          rooms[currentRoom] = { document: '// Start typing...' }; // Initialize document for new room
          roomClients[currentRoom] = new Set(); // Initialize the set of clients for the new room
        }

        // Add the client to the room's clients list
        roomClients[currentRoom].add(ws);

        // Send the current document state to the client
        ws.send(JSON.stringify({ type: 'init', data: rooms[currentRoom].document }));

        // Broadcast new user joining the room to all clients in the room
        broadcastToRoom(currentRoom, JSON.stringify({ type: 'userJoined', message: `A user joined room: ${currentRoom}` }));

      } else if (parsedMessage.type === 'update') {
        // Update the document for this room
        if (currentRoom) {
          rooms[currentRoom].document = parsedMessage.data;

          // Broadcast the updated document to all clients in the room
          broadcastToRoom(currentRoom, JSON.stringify({ type: 'update', data: rooms[currentRoom].document }));
        }
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (currentRoom) {
      // Optionally broadcast user leaving the room
      broadcastToRoom(currentRoom, JSON.stringify({ type: 'userLeft', message: `A user left room: ${currentRoom}` }));

      // Remove the client from the room's client list
      roomClients[currentRoom].delete(ws);

      // If no clients are left in the room, clean up the room data
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

