const amqp = require('amqplib');
const { matchUser } = require('../matching/matching.js');
const { getIO, getSocketMap } = require('../socket.js');

async function connectWithRetry(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672');
      console.log(' Connected to RabbitMQ');
      return connection;
    } catch (err) {
      console.error(` RabbitMQ connection failed (Attempt ${i + 1}/${retries}):`, err.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw new Error('All RabbitMQ connection attempts failed.');
      }
    }
  }
}

async function startConsumer() {
  try {
    const connection = await connectWithRetry();
    const channel = await connection.createChannel();
    const queue = 'matching_queue';

    await channel.assertQueue(queue, { durable: true });
    console.log('📡 Listening for matches...');

    const waitingList = [];

    channel.consume(queue, async (msg) => {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString());
      console.log('📨 Received from queue:', data);

      const matchedPair = matchUser(data, waitingList);
      if (matchedPair) {
        const io = getIO();
        const sockets = getSocketMap();

        [matchedPair.user1, matchedPair.user2].forEach((user) => {
          const socketId = sockets[user.userId];
          if (socketId) {
            io.to(socketId).emit('matchFound', { partner: matchedPair });
            console.log(`📤 Match sent to socket ${socketId} for user ${user.userId}`);
          }
        });
      }

      channel.ack(msg);
    });
  } catch (err) {
    console.error('Failed to start RabbitMQ consumer:', err.message);
  }
}

module.exports = { startConsumer };
