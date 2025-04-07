const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Initialize app
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // Allow all frontend origins (update in production)
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a collaboration session
  socket.on("join-session", (sessionId) => {
    socket.join(sessionId);
    console.log(`User ${socket.id} joined session ${sessionId}`);
  });

  // Handle code updates
  socket.on("code-update", ({ sessionId, code }) => {
    socket.to(sessionId).emit("code-update", code); // Broadcast to others in session
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`Collaboration service running on port ${PORT}`);
});
