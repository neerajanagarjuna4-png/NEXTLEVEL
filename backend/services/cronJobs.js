import User from '../models/User.js';
import StudyReport from '../models/StudyReport.js';
import { refreshLeaderboard } from '../controllers/leaderboardController.js';

/**
 * Recalculate consistency scores for all approved students.
 * Consistency = average of (actual_hours / target_daily) over last 7 days.
 * Days with no report count as 0.
 */
export async function recalculateConsistencyScores() {
  try {
    const students = await User.find({ role: 'student', status: 'approved' });
    const now = new Date();
    let updated = 0;

    for (const student of students) {
      const targetDaily = student.targets?.daily || 6;
      let totalRatio = 0;

      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(now);
        checkDate.setUTCDate(checkDate.getUTCDate() - i);
        const dayStart = new Date(checkDate);
        dayStart.setUTCHours(0, 0, 0, 0);
        const dayEnd = new Date(checkDate);
        dayEnd.setUTCHours(23, 59, 59, 999);

        const agg = await StudyReport.aggregate([
          { $match: { userId: student._id, date: { $gte: dayStart, $lte: dayEnd } } },
          { $group: { _id: null, total: { $sum: '$studyHours' } } }
        ]);

        const actualHours = agg[0]?.total || 0;
        const ratio = targetDaily > 0 ? Math.min(actualHours / targetDaily, 1) : 0;
        totalRatio += ratio;
      }

      const score = Math.round((totalRatio / 7) * 100);
      student.consistencyScore = score;
      await student.save();
      updated++;
    }

    console.log(`✅ Consistency scores updated for ${updated} students`);
  } catch (err) {
    console.error('Consistency score recalculation error:', err);
  }
}

/**
 * Check and reset streaks for students who missed a day.
 * A missed day = no study report for yesterday.
 */
export async function checkAndResetStreaks() {
  try {
    const students = await User.find({ role: 'student', status: 'approved', streak: { $gt: 0 } });
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    yesterday.setUTCHours(0, 0, 0, 0);
    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setUTCHours(23, 59, 59, 999);

    let reset = 0;

    for (const student of students) {
      if (student.lastActiveDate) {
        const lastActive = new Date(student.lastActiveDate);
        lastActive.setUTCHours(0, 0, 0, 0);
        const diffDays = Math.round((yesterday - lastActive) / (1000 * 60 * 60 * 24));

        if (diffDays >= 1) {
          // Check if they submitted a report yesterday
          const yesterdayReport = await StudyReport.findOne({
            userId: student._id,
            date: { $gte: yesterday, $lte: yesterdayEnd }
          });

          if (!yesterdayReport) {
            student.streak = 0;
            await student.save();
            reset++;
          }
        }
      }
    }

    console.log(`✅ Streak check complete: ${reset} streaks reset`);
  } catch (err) {
    console.error('Streak reset error:', err);
  }
}

/**
 * Initialize cron jobs.
 * Uses dynamic import for node-cron (optional dependency).
 */
export async function initCronJobs() {
  try {
    const cron = await import('node-cron');

    // Midnight daily: recalculate consistency + check streaks
    cron.default.schedule('0 0 * * *', async () => {
      console.log('⏰ Running midnight cron: consistency + streaks');
      await recalculateConsistencyScores();
      await checkAndResetStreaks();
    }, { timezone: 'Asia/Kolkata' });

    // Every hour: refresh leaderboard
    cron.default.schedule('0 * * * *', async () => {
      console.log('⏰ Running hourly cron: leaderboard refresh');
      await refreshLeaderboard();
    }, { timezone: 'Asia/Kolkata' });

    console.log('✅ Cron jobs initialized (midnight consistency/streaks, hourly leaderboard)');
  } catch (err) {
    console.warn('⚠️  node-cron not available. Cron jobs disabled. Install with: npm install node-cron');
  }
}
