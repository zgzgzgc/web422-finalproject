import connectMongoDB from '../../lib/mongodb';
import User from '../../user-service'; // Ensure the correct path to your User model

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectMongoDB();
      const { username, appid } = req.body;

      
      const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
      
      console.log("Request to add to view history:", { username, appid });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.history.includes(appid)) {
        user.history.push(appid);
        await user.save();
      }

      res.status(200).json({ message: 'Added to view history' });
    } catch (err) {
      console.error('Error adding to view history:', err);
      res.status(500).json({ error: 'Failed to add to view history' });
    }
  } else if (req.method === 'GET') {
    try {
      await connectMongoDB();
      const { username } = req.query;

      console.log("Request to fetch view history for:", username);

      const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ games: user.history });
    } catch (err) {
      console.error('Error fetching view history:', err);
      res.status(500).json({ error: 'Failed to retrieve view history' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
