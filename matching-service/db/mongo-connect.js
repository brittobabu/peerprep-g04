const mongoose = require('mongoose');

async function connectToDB() {
  const uri = 'mongodb://root:rootpassword@mongodb:27017'; 
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

