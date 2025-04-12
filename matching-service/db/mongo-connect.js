const mongoose = require('mongoose');

async function connectToDB() {
  const uri = "mongodb+srv://peerprep:peerprep@cluster0.143cd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 
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

