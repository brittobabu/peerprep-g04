const mongoose = require('mongoose');

async function connectToDB() {
  const uri = 'mongodb://localhost:27017/PeerPrep'; 
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB' + uri);
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

module.exports = connectToDB;

