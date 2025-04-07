const amqp = require('amqplib');
const { matchUser } = require('../matching/matching.js');
const { getIO, getSocketMap } = require('../socket.js');

async function startConsumer() {
  const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
  const channel = await connection.createChannel();
  const queue = 'matching_queue';

  await channel.assertQueue(queue, { durable: true });
  console.log('Listening for matches...');

  const waitingList = [];

  channel.consume(queue, async (msg) => {
    if (!msg) return;
    const data = JSON.parse(msg.content.toString());
    console.log('Received from queue:', data);

    const matchedPair = matchUser(data, waitingList);
    if (matchedPair) {
      const io = getIO();
      const sockets = getSocketMap();
      [matchedPair.user1, matchedPair.user2].forEach((user) => {
        const socketId = sockets[user.userId];
        if (socketId) {
          io.to(socketId).emit('matchFound', { partner: matchedPair });
        }
      });
    }

    
    channel.ack(msg);
  });
}

module.exports = { startConsumer };
