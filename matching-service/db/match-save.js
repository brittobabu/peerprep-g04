const Match = require('../db/match-model.js');

async function saveMatch(user1, user2, topic, difficulty) {
  try {
    const match = new Match({
      user1: user1.userId,
      user2: user2.userId,
      topic,
      difficulty,
    });
  console.log(match)
    await match.save();
    console.log(' Match saved to db ');
  } catch (err) {
    console.error(' Failed to save match:', err);
  }
}

module.exports = { saveMatch };
