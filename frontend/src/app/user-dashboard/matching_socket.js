// matchService.js
import io from 'socket.io-client';
import axios from 'axios';

let socket;

export const registerSocket = (userId, onMatchFound) => {
  socket = io('http://localhost:5000');

  socket.emit('register', userId);

  socket.on('matchFound', onMatchFound);
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

export const sendMatchRequest = async (userId, topic, complexity) => {
  return axios.post('http://localhost:5000/api/match', {
    userId,
    topic,
    complexity
  });
};
