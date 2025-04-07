/*
const consumer = require ("./consumer/consumer.js")

consumer.startConsumer()
*/
const mockQueue = {
  publish: (msg) => console.log('Mock publish:', msg),
  consume: (handler) => setInterval(() => handler({ content: 'test' }), 1000)
};
// Replace your queue with mockQueue