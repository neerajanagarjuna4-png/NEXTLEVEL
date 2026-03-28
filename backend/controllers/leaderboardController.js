import User from '../models/User.js';
import StudyReport from '../models/StudyReport.js';
import Leaderboard from '../models/Leaderboard.js';

// GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const entries = await Leaderboard.find()
      .sort({ totalMockScore: -1 })
      .populate('userId', 'name branch streak badges')
      .limit(50);

    const ranked = entries.map((entry, index) => ({
      rank: index + 1,
      name: entry.userId?.name || 'Unknown',
      branch: entry.userId?.branch || 'N/A',
      streak: entry.userId?.streak || 0,
      badgeCount: entry.userId?.badges?.length || 0,
      totalMockScore: entry.totalMockScore,
      latestMockScore: entry.latestMockScore,
      totalStudyHours: entry.totalStudyHours
    }));

    res.json({ success: true, leaderboard: ranked });
  } catch (err) {
    console.error('getLeaderboard error:', err);
    res.status(500).json({ error: true, message: 'Server error.' });
  }
};

// Called by cron job to refresh leaderboard
export const refreshLeaderboard = async () => {
  try {
    const students = await User.find({ role: 'student', status: 'approved' }).select('_id');

    for (const student of students) {
      // Get latest mock test score
      const latestReport = await StudyReport.findOne({
        userId: student._id,
        mockTestScore: { $gt: 0 }
      }).sort({ date: -1 });

      // Get total study hours
      const totalAgg = await StudyReport.aggregate([
        { $match: { userId: student._id } },
        { $group: { _id: null, totalHours: { $sum: '$studyHours' }, totalMock: { $sum: '$mockTestScore' } } }
      ]);

      await Leaderboard.findOneAndUpdate(
        { userId: student._id },
        {
          totalMockScore: totalAgg[0]?.totalMock || 0,
          latestMockScore: latestReport?.mockTestScore || 0,
          totalStudyHours: Math.round((totalAgg[0]?.totalHours || 0) * 10) / 10,
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );
    }

    // Update ranks
    const all = await Leaderboard.find().sort({ totalMockScore: -1 });
    for (let i = 0; i < all.length; i++) {
      all[i].rank = i + 1;
      await all[i].save();
    }

    console.log(`Leaderboard refreshed: ${all.length} entries`);
  } catch (err) {
    console.error('refreshLeaderboard error:', err);
  }
};
