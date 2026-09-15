// backend/routes/stats.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET ស្ថិតិ Dashboard
router.get('/', async (req, res) => {
  try {
    const [candidatesCount] = await db.query('SELECT COUNT(*) AS count FROM candidates');
    const [votersCount] = await db.query('SELECT COUNT(*) AS count FROM voters');
    const [votedCount] = await db.query('SELECT COUNT(*) AS count FROM voters WHERE voted = TRUE');
    const [votesCount] = await db.query('SELECT COUNT(*) AS count FROM votes');

    const totalVoters = votersCount[0].count;
    const voted = votedCount[0].count;

    res.json({
      candidates: candidatesCount[0].count,
      voters: totalVoters,
      voted: voted,
      notVoted: totalVoters - voted,
      totalVotes: votesCount[0].count,
      votePercentage: totalVoters > 0 ? ((voted / totalVoters) * 100).toFixed(1) : 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET ការវិវត្តនៃការបោះឆ្នោតតាមពេលវេលា (Timeline)
router.get('/timeline', async (req, res) => {
  try {
    // ទាញទិន្នន័យតាមម៉ោង (ក្នុង ២៤ ម៉ោងចុងក្រោយ)
    const [hourlyData] = await db.query(`
      SELECT 
        DATE_FORMAT(voted_at, '%Y-%m-%d %H:00') AS time_label,
        COUNT(*) AS vote_count
      FROM votes
      WHERE voted_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      GROUP BY DATE_FORMAT(voted_at, '%Y-%m-%d %H:00')
      ORDER BY time_label ASC
    `);

    // ទាញទិន្នន័យតាមថ្ងៃ (ក្នុង ៧ ថ្ងៃចុងក្រោយ)
    const [dailyData] = await db.query(`
      SELECT 
        DATE_FORMAT(voted_at, '%Y-%m-%d') AS time_label,
        COUNT(*) AS vote_count
      FROM votes
      WHERE voted_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE_FORMAT(voted_at, '%Y-%m-%d')
      ORDER BY time_label ASC
    `);

    // ទាញទិន្នន័យតាមខែ (ក្នុង ១២ ខែចុងក្រោយ)
    const [monthlyData] = await db.query(`
      SELECT 
        DATE_FORMAT(voted_at, '%Y-%m') AS time_label,
        COUNT(*) AS vote_count
      FROM votes
      WHERE voted_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(voted_at, '%Y-%m')
      ORDER BY time_label ASC
    `);

    // គណនាស្ថិតិសង្ខេប
    const totalVotes = hourlyData.reduce((sum, d) => sum + d.vote_count, 0);
    const avgPerHour = hourlyData.length > 0 ? (totalVotes / hourlyData.length).toFixed(1) : 0;
    const peakHour = hourlyData.reduce(
      (max, d) => (d.vote_count > (max?.vote_count || 0) ? d : max),
      null
    );

    res.json({
      hourly: hourlyData,
      daily: dailyData,
      monthly: monthlyData,
      summary: {
        totalVotes,
        avgPerHour,
        peakHour: peakHour || null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;