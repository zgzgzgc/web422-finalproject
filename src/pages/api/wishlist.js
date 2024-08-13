import connectMongoDB from '../../lib/mongodb';
import User from '../../user-service'; // Ensure the path to user-service.js is correct

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await connectMongoDB();

      const { username, appid } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.favorites.includes(appid)) {
        user.favorites.push(appid);
        await user.save();
      }

      res.status(200).json({ message: 'Added to wish list' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add to wish list' });
    }
  } else if (req.method === 'GET') {
    try {
      await connectMongoDB();

      const { username } = req.query;

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ games: user.favorites });
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve wish list' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
