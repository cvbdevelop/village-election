// backend/routes/stats.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET ស្ថិតិ Dashboard
router.get('/', async (req, res) => {
  try {
    const [candidatesCount] = await db.query('SELECT COUNT(*)::int AS count FROM candidates');
    const [votersCount] = await db.query('SELECT COUNT(*)::int AS count FROM voters');
    const [votedCount] = await db.query('SELECT COUNT(*)::int AS count FROM voters WHERE voted = TRUE');
    const [votesCount] = await db.query('SELECT COUNT(*)::int AS count FROM votes');

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

// GET ស្ថិតិជ្រៅ (Advanced Statistics)
router.get('/advanced', async (req, res) => {
  try {
    // ============ ១. ស្ថិតិតាមឃុំ ============
    const [votersByCommune] = await db.query(`
      SELECT commune, COUNT(*)::int AS count
      FROM voters
      WHERE commune IS NOT NULL AND commune != ''
      GROUP BY commune
      ORDER BY count DESC
    `);

    const [candidatesByCommune] = await db.query(`
      SELECT commune, COUNT(*)::int AS count
      FROM candidates
      WHERE commune IS NOT NULL AND commune != ''
      GROUP BY commune
      ORDER BY count DESC
    `);

    const [votesByCommune] = await db.query(`
      SELECT c.commune, COUNT(v.id)::int AS count
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      WHERE c.commune IS NOT NULL AND c.commune != ''
      GROUP BY c.commune
      ORDER BY count DESC
    `);

    // ============ ២. ស្ថិតិតាមភេទ ============
    const [votersByGender] = await db.query(`
      SELECT gender, COUNT(*)::int AS count
      FROM voters
      WHERE gender IS NOT NULL AND gender != ''
      GROUP BY gender
    `);

    const [candidatesByGender] = await db.query(`
      SELECT gender, COUNT(*)::int AS count
      FROM candidates
      WHERE gender IS NOT NULL AND gender != ''
      GROUP BY gender
    `);

    // ============ ៣. ស្ថិតិតាមក្រុមអាយុ ============
    const [votersByAge] = await db.query(`
      SELECT 
        CASE 
          WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, dob)) BETWEEN 18 AND 25 THEN '18-25'
          WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, dob)) BETWEEN 26 AND 35 THEN '26-35'
          WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, dob)) BETWEEN 36 AND 45 THEN '36-45'
          WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, dob)) BETWEEN 46 AND 55 THEN '46-55'
          WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, dob)) >= 56 THEN '56+'
          ELSE 'មិនស្គាល់'
        END AS age_group,
        COUNT(*)::int AS count
      FROM voters
      WHERE dob IS NOT NULL
      GROUP BY age_group
      ORDER BY 
        CASE age_group
          WHEN '18-25' THEN 1
          WHEN '26-35' THEN 2
          WHEN '36-45' THEN 3
          WHEN '46-55' THEN 4
          WHEN '56+' THEN 5
          ELSE 6
        END
    `);

    const [candidatesByAge] = await db.query(`
      SELECT 
        CASE 
          WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, dob)) BETWEEN 18 AND 25 THEN '18-25'
          WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, dob)) BETWEEN 26 AND 35 THEN '26-35'
          WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, dob)) BETWEEN 36 AND 45 THEN '36-45'
          WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, dob)) BETWEEN 46 AND 55 THEN '46-55'
          WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, dob)) >= 56 THEN '56+'
          ELSE 'មិនស្គាល់'
        END AS age_group,
        COUNT(*)::int AS count
      FROM candidates
      WHERE dob IS NOT NULL
      GROUP BY age_group
      ORDER BY 
        CASE age_group
          WHEN '18-25' THEN 1
          WHEN '26-35' THEN 2
          WHEN '36-45' THEN 3
          WHEN '46-55' THEN 4
          WHEN '56+' THEN 5
          ELSE 6
        END
    `);

    // ============ ៤. ស្ថិតិតាមភូមិ ============
    const [votersByVillage] = await db.query(`
      SELECT commune, village, COUNT(*)::int AS count
      FROM voters
      WHERE village IS NOT NULL AND village != ''
      GROUP BY commune, village
      ORDER BY commune, count DESC
    `);

    // ============ ៥. ស្ថិតិការបោះឆ្នោតតាមឃុំ ============
    const [votedByCommune] = await db.query(`
      SELECT 
        commune,
        COUNT(*)::int AS total,
        COUNT(CASE WHEN voted = TRUE THEN 1 END)::int AS voted_count
      FROM voters
      WHERE commune IS NOT NULL AND commune != ''
      GROUP BY commune
      ORDER BY commune
    `);

    res.json({
      byCommune: {
        voters: votersByCommune,
        candidates: candidatesByCommune,
        votes: votesByCommune,
        voted: votedByCommune,
      },
      byGender: {
        voters: votersByGender,
        candidates: candidatesByGender,
      },
      byAge: {
        voters: votersByAge,
        candidates: candidatesByAge,
      },
      byVillage: votersByVillage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error: ' + error.message });
  }
});

// GET ការវិវត្តនៃការបោះឆ្នោតតាមពេលវេលា (Timeline)
router.get('/timeline', async (req, res) => {
  try {
    const [hourlyData] = await db.query(`
      SELECT 
        TO_CHAR(voted_at, 'YYYY-MM-DD HH24:00') AS time_label,
        COUNT(*)::int AS vote_count
      FROM votes
      WHERE voted_at >= NOW() - INTERVAL '24 hours'
      GROUP BY TO_CHAR(voted_at, 'YYYY-MM-DD HH24:00')
      ORDER BY time_label ASC
    `);

    const [dailyData] = await db.query(`
      SELECT 
        TO_CHAR(voted_at, 'YYYY-MM-DD') AS time_label,
        COUNT(*)::int AS vote_count
      FROM votes
      WHERE voted_at >= NOW() - INTERVAL '7 days'
      GROUP BY TO_CHAR(voted_at, 'YYYY-MM-DD')
      ORDER BY time_label ASC
    `);

    const [monthlyData] = await db.query(`
      SELECT 
        TO_CHAR(voted_at, 'YYYY-MM') AS time_label,
        COUNT(*)::int AS vote_count
      FROM votes
      WHERE voted_at >= NOW() - INTERVAL '12 months'
      GROUP BY TO_CHAR(voted_at, 'YYYY-MM')
      ORDER BY time_label ASC
    `);

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