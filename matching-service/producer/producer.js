const amqp = require('amqplib');

let channel;

async function sendToQueue(message) {
  const connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672');
  channel = await connection.createChannel();
  const queue = 'matching_queue';

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true
  });

  setTimeout(() => connection.close(), 500);
}

module.exports = { sendToQueue };
