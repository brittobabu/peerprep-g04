const Match = require('../db/match-model');

exports.getFilteredMatchHistory = async (req, res) => {
    try {
      const { username } = req.params;
      const { topic, from, to } = req.query;
  
      if (!username) {
        return res.status(400).json({ error: "Username is required" });
      }
  
      const filter = {
        $or: [{ user1: username }, { user2: username }]
      };
  
      if (topic) {
        filter.topic = topic;
      }
  
      if (from || to) {
        filter.matchedAt = {};
        if (from) filter.matchedAt.$gte = new Date(from);
        if (to) filter.matchedAt.$lte = new Date(to);
      }
  
      const matches = await Match.find(filter).sort({ matchedAt: -1 });
      
      res.status(200).json({ data: matches });
    } catch (err) {
      console.log("Failed to fetch match history:", err);
      res.status(500).json({ error: "Failed to fetch match history" });
    }
};
