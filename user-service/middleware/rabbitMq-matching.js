import amqp from 'amqplib'

let channel, connection;


// Send message to RabbitMQ
export async function sendToQueue (message)  {
 
    try {
        connection = await amqp.connect('amqp://guest:guest@localhost:5672');
        channel = await connection.createChannel();
        const queue = 'matching_queue';
    
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    
        console.log('Sent message to queue:', message);
    
        // Optional: close after a short delay to ensure the message is sent
        setTimeout(() => {
          connection.close();
        }, 500);
      } catch (err) {
        console.error('Error sending to queue:', err.message);
      }
};

