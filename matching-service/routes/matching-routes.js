const express = require('express');
const { sendToQueue } = require('../producer/producer.js');
const { getFilteredMatchHistory } = require('../controllers/match-controller');
const router = express.Router();

router.post('/match', async (req, res) => {
  const { userId, topic, complexity } = req.body;
  if (!userId || !topic || !complexity) {
    return res.status(400).json({ message: 'Missing data' });
  }
  await sendToQueue({ userId, topic, complexity });
  res.json({ message: 'Searchings for match...' });
});


router.get('/match-history/:username', getFilteredMatchHistory);


module.exports = router;

