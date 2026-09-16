import React, { useState, useEffect } from 'react';
import {
  FaChartBar, FaUsers, FaUserTie, FaVenusMars, FaBirthdayCake, FaMapMarkedAlt,
} from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { apiGetAdvancedStats } from '../utils/api';

const COLORS = ['#1e40af', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const AdvancedStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('commune');

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await apiGetAdvancedStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading advanced stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-lg">កំពុងទាញទិន្នន័យ...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
          មានបញ្ហាក្នុងការទាញទិន្នន័យស្ថិតិ
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'commune', label: 'តាមឃុំ', icon: <FaMapMarkedAlt /> },
    { id: 'gender', label: 'តាមភេទ', icon: <FaVenusMars /> },
    { id: 'age', label: 'តាមអាយុ', icon: <FaBirthdayCake /> },
    { id: 'village', label: 'តាមភូមិ', icon: <FaMapMarkedAlt /> },
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
        <FaChartBar className="text-primary" /> ស្ថិតិជ្រៅ
      </h1>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow mb-6 overflow-hidden">
        <div className="flex flex-wrap border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] px-4 py-3 flex items-center justify-center gap-2 transition text-sm font-semibold ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab ១៖ តាមឃុំ */}
      {activeTab === 'commune' && (
        <div className="space-y-6">
          {/* អ្នកបោះឆ្នោតតាមឃុំ */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
              <FaUsers className="text-primary" /> អ្នកបោះឆ្នោតតាមឃុំ
            </h2>
            {stats.byCommune.voters.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.byCommune.voters}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="commune" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1e40af" radius={[8, 8, 0, 0]} name="ចំនួនអ្នកបោះឆ្នោត" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-6">មិនទាន់មានទិន្នន័យទេ</p>
            )}
          </div>

          {/* បេក្ខជនតាមឃុំ */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
              <FaUserTie className="text-primary" /> បេក្ខជនតាមឃុំ
            </h2>
            {stats.byCommune.candidates.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.byCommune.candidates}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="commune" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} name="ចំនួនបេក្ខជន" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-6">មិនទាន់មានទិន្នន័យទេ</p>
            )}
          </div>

          {/* សំឡេងឆ្នោតតាមឃុំ */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold mb-4">សំឡេងឆ្នោតតាមឃុំ</h2>
            {stats.byCommune.votes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.byCommune.votes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="commune" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} name="សំឡេងឆ្នោត" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-6">មិនទាន់មានទិន្នន័យទេ</p>
            )}
          </div>

          {/* តារាងសង្ខេបតាមឃុំ */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6 overflow-x-auto">
            <h2 className="text-base md:text-lg font-bold mb-4">តារាងសង្ខេបតាមឃុំ</h2>
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-sm">ឃុំ</th>
                  <th className="p-3 text-sm text-center">អ្នកបោះឆ្នោតសរុប</th>
                  <th className="p-3 text-sm text-center">បានបោះឆ្នោត</th>
                  <th className="p-3 text-sm text-center">ភាគរយ</th>
                </tr>
              </thead>
              <tbody>
                {stats.byCommune.voted.map((c) => (
                  <tr key={c.commune} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-semibold">ឃុំ{c.commune}</td>
                    <td className="p-3 text-sm text-center">{c.total}</td>
                    <td className="p-3 text-sm text-center font-semibold text-green-700">{c.voted_count}</td>
                    <td className="p-3 text-sm text-center">
                      {c.total > 0 ? ((c.voted_count / c.total) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab ២៖ តាមភេទ */}
      {activeTab === 'gender' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* អ្នកបោះឆ្នោតតាមភេទ */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
              <FaUsers className="text-primary" /> អ្នកបោះឆ្នោតតាមភេទ
            </h2>
            {stats.byGender.voters.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.byGender.voters}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ gender, count, percent }) => `${gender}: ${count} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={90}
                    dataKey="count"
                    nameKey="gender"
                  >
                    {stats.byGender.voters.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-6">មិនទាន់មានទិន្នន័យទេ</p>
            )}
          </div>

          {/* បេក្ខជនតាមភេទ */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
              <FaUserTie className="text-primary" /> បេក្ខជនតាមភេទ
            </h2>
            {stats.byGender.candidates.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.byGender.candidates}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ gender, count, percent }) => `${gender}: ${count} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={90}
                    dataKey="count"
                    nameKey="gender"
                  >
                    {stats.byGender.candidates.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-6">មិនទាន់មានទិន្នន័យទេ</p>
            )}
          </div>
        </div>
      )}

      {/* Tab ៣៖ តាមអាយុ */}
      {activeTab === 'age' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* អ្នកបោះឆ្នោតតាមអាយុ */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
              <FaUsers className="text-primary" /> អ្នកបោះឆ្នោតតាមក្រុមអាយុ
            </h2>
            {stats.byAge.voters.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.byAge.voters}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age_group" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="ចំនួនអ្នកបោះឆ្នោត" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-6">មិនទាន់មានទិន្នន័យទេ</p>
            )}
          </div>

          {/* បេក្ខជនតាមអាយុ */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
              <FaUserTie className="text-primary" /> បេក្ខជនតាមក្រុមអាយុ
            </h2>
            {stats.byAge.candidates.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.byAge.candidates}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age_group" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ec4899" radius={[8, 8, 0, 0]} name="ចំនួនបេក្ខជន" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-6">មិនទាន់មានទិន្នន័យទេ</p>
            )}
          </div>
        </div>
      )}

      {/* Tab ៤៖ តាមភូមិ */}
      {activeTab === 'village' && (
        <div className="bg-white rounded-xl shadow p-4 md:p-6 overflow-x-auto">
          <h2 className="text-base md:text-lg font-bold mb-4">អ្នកបោះឆ្នោតតាមភូមិ</h2>
          {stats.byVillage.length > 0 ? (
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-sm">ឃុំ</th>
                  <th className="p-3 text-sm">ភូមិ</th>
                  <th className="p-3 text-sm text-center">ចំនួនអ្នកបោះឆ្នោត</th>
                </tr>
              </thead>
              <tbody>
                {stats.byVillage.map((v, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm font-semibold">ឃុំ{v.commune}</td>
                    <td className="p-3 text-sm">{v.village}</td>
                    <td className="p-3 text-sm text-center font-semibold text-primary">{v.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-6">មិនទាន់មានទិន្នន័យទេ</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedStats;