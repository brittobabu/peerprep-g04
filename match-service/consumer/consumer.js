const amqp = require('amqplib');


const startConsumer = async () => {
    const connection = await amqp.connect( 'amqp://guest:guest@localhost:5672/');
    const channel = await connection.createChannel();
    const queue = 'matching_queue';
  
    await channel.assertQueue(queue, { durable: true });
  
    console.log('🔁 Waiting for messages in queue:', queue);
  
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const data = JSON.parse(msg.content.toString());
        console.log('✅ Received message:', data);
  
        // Call your matcher logic here
        console.log("implement matching")
  
        channel.ack(msg);
      }
    });
  };

  module.exports = {startConsumer}