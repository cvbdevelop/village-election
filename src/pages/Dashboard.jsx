import React, { useState, useEffect } from 'react';
import {
  FaUserTie,
  FaUsers,
  FaVoteYea,
  FaCheckCircle,
  FaTrophy,
  FaChartPie,
  FaChartBar,
  FaChartLine,
  FaClock,
  FaFire,
  FaChartArea,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import { apiGetStats, apiGetResults, apiGetVoters, apiGetTimeline } from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    candidates: 0,
    voters: 0,
    voted: 0,
    notVoted: 0,
    totalVotes: 0,
    votePercentage: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [recentVoters, setRecentVoters] = useState([]);
  const [topCandidate, setTopCandidate] = useState(null);
  const [timeline, setTimeline] = useState({
    hourly: [],
    daily: [],
    monthly: [],
    summary: { totalVotes: 0, avgPerHour: 0, peakHour: null },
  });
  const [timelineView, setTimelineView] = useState('hourly'); // 'hourly' | 'daily' | 'monthly'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const statsData = await apiGetStats();
        setStats(statsData);

        const resultsData = await apiGetResults();
        const barData = (resultsData.results || []).map((r) => ({
          name: r.name,
          votes: r.votes,
          party: r.party,
        }));
        setChartData(barData);

        if (
          resultsData.results &&
          resultsData.results.length > 0 &&
          resultsData.totalVotes > 0
        ) {
          setTopCandidate(resultsData.results[0]);
        }

        const votersData = await apiGetVoters();
        const votedList = votersData
          .filter((v) => v.voted)
          .slice(-5)
          .reverse();
        setRecentVoters(votedList);

        // ទាញទិន្នន័យ Timeline
        const timelineData = await apiGetTimeline();
        setTimeline(timelineData);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const pieData = [
    { name: 'បានបោះឆ្នោត', value: stats.voted, color: '#10b981' },
    { name: 'មិនទាន់បោះ', value: stats.notVoted, color: '#ef4444' },
  ];

  const statCards = [
    {
      label: 'បេក្ខជនសរុប',
      value: stats.candidates,
      icon: <FaUserTie />,
      color: 'bg-blue-500',
    },
    {
      label: 'អ្នកបោះឆ្នោតសរុប',
      value: stats.voters,
      icon: <FaUsers />,
      color: 'bg-green-500',
    },
    {
      label: 'បានបោះឆ្នោត',
      value: stats.voted,
      icon: <FaVoteYea />,
      color: 'bg-yellow-500',
    },
    {
      label: 'មិនទាន់បោះ',
      value: stats.notVoted,
      icon: <FaCheckCircle />,
      color: 'bg-red-500',
    },
  ];

  // ទិន្នន័យសម្រាប់ Line Chart តាម View ដែលបានជ្រើស
  const getTimelineData = () => {
    if (timelineView === 'hourly') return timeline.hourly || [];
    if (timelineView === 'daily') return timeline.daily || [];
    return timeline.monthly || [];
  };

  const timelineData = getTimelineData();

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-lg">កំពុងទាញទិន្នន័យ...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">ផ្ទាំងគ្រប់គ្រង</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-6 flex items-center gap-4 hover:shadow-lg transition"
          >
            <div className={`${stat.color} text-white p-4 rounded-full text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ភាគរយអ្នកបោះឆ្នោត */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FaChartPie className="text-primary" /> ភាគរយអ្នកបានបោះឆ្នោត
          </h2>
          <span className="text-2xl font-bold text-primary">
            {stats.votePercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${stats.votePercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          បានបោះឆ្នោត {stats.voted} នាក់ ក្នុងចំណោម {stats.voters} នាក់
        </p>
      </div>

      {/* Top Candidate */}
      {topCandidate && (
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center gap-6">
            {topCandidate.photo ? (
              <img
                src={topCandidate.photo}
                alt={topCandidate.name}
                className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-lg"
              />
            ) : (
              <div className="bg-white bg-opacity-20 p-4 rounded-full">
                <FaTrophy size={40} />
              </div>
            )}
            <div>
              <h2 className="text-sm opacity-90 mb-1">
                🏆 បេក្ខជនទទួលបានសំឡេងច្រើនជាងគេ
              </h2>
              <p className="text-2xl font-bold">{topCandidate.name}</p>
              <p className="text-sm opacity-90">{topCandidate.party}</p>
              <p className="text-lg mt-1 font-semibold">
                {topCandidate.votes} សំឡេង ({topCandidate.percent}%)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============ Line Chart - ការវិវត្តនៃការបោះឆ្នោត ============ */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FaChartLine className="text-primary" /> ការវិវត្តនៃការបោះឆ្នោត
          </h2>

          {/* Toggle Buttons */}
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTimelineView('hourly')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                timelineView === 'hourly'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              តាមម៉ោង
            </button>
            <button
              onClick={() => setTimelineView('daily')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                timelineView === 'daily'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              តាមថ្ងៃ
            </button>
            <button
              onClick={() => setTimelineView('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                timelineView === 'monthly'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              តាមខែ
            </button>
          </div>
        </div>

        {/* ស្ថិតិសង្ខេប */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
            <FaChartArea className="text-blue-600 text-xl" />
            <div>
              <p className="text-xs text-gray-600">សំឡេងឆ្នោតសរុប</p>
              <p className="text-lg font-bold text-blue-800">
                {timeline.summary?.totalVotes || 0}
              </p>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
            <FaClock className="text-green-600 text-xl" />
            <div>
              <p className="text-xs text-gray-600">មធ្យមភាគក្នុងម៉ោង</p>
              <p className="text-lg font-bold text-green-800">
                {timeline.summary?.avgPerHour || 0}
              </p>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-3">
            <FaFire className="text-orange-600 text-xl" />
            <div>
              <p className="text-xs text-gray-600">ម៉ោងច្រើនបំផុត</p>
              <p className="text-lg font-bold text-orange-800">
                {timeline.summary?.peakHour
                  ? `${timeline.summary.peakHour.vote_count} សំឡេង`
                  : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Line Chart */}
        {timelineData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorVotes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e40af" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time_label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="vote_count"
                stroke="#1e40af"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorVotes)"
                name="សំឡេងឆ្នោត"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <FaChartLine className="text-4xl text-gray-300 mx-auto mb-2" />
              <p>មិនទាន់មានទិន្នន័យសម្រាប់រយៈពេលនេះទេ</p>
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaChartBar className="text-primary" /> សំឡេងឆ្នោតតាមបេក្ខជន
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="votes" fill="#1e40af" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              មិនទាន់មានទិន្នន័យទេ
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FaChartPie className="text-primary" /> ស្ថិតិអ្នកបោះឆ្នោត
          </h2>
          {stats.voters > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              មិនទាន់មានអ្នកបោះឆ្នោតទេ
            </div>
          )}
        </div>
      </div>

      {/* បញ្ជីអ្នកបោះឆ្នោតចុងក្រោយ */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FaCheckCircle className="text-green-500" /> អ្នកបានបោះឆ្នោតចុងក្រោយ
        </h2>
        {recentVoters.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">ឈ្មោះ</th>
                <th className="p-3">អត្តសញ្ញាណប័ណ្ណ</th>
                <th className="p-3">ឃុំ</th>
                <th className="p-3 text-center">ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody>
              {recentVoters.map((v) => (
                <tr key={v.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{v.name}</td>
                  <td className="p-3">{v.id_card}</td>
                  <td className="p-3">{v.commune}</td>
                  <td className="p-3 text-center">
                    <span className="text-green-600 flex items-center justify-center gap-1">
                      <FaCheckCircle /> បានបោះ
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center py-6">
            មិនទាន់មានអ្នកបោះឆ្នោតទេ
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;