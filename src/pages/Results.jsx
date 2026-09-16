import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { FaFilePdf, FaPrint, FaTrophy } from 'react-icons/fa';
import { exportResultsToPDF } from '../utils/pdfExport';
import { apiGetResults } from '../utils/api';

const Results = () => {
  const [results, setResults] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadResults = async () => {
    try {
      setLoading(true);
      const data = await apiGetResults();
      setResults(data.results || []);
      setTotalVotes(data.totalVotes || 0);
    } catch (error) {
      console.error('Error loading results:', error);
      setErrorMessage('មានបញ្ហាក្នុងការទាញលទ្ធផល: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const chartData = results.map((r) => ({
    name: r.name,
    votes: r.votes,
    party: r.party,
  }));

  // ============ កំណត់អ្នកឈ្នះ (គិតពីករណីស្មើគ្នា) ============
  const getWinners = () => {
    if (results.length === 0 || totalVotes === 0) return [];
    const maxVotes = Math.max(...results.map((r) => r.votes));
    if (maxVotes === 0) return [];
    return results.filter((r) => r.votes === maxVotes);
  };

  const winners = getWinners();
  const isTie = winners.length > 1;

  const handleExportPDF = async () => {
    if (results.length === 0) {
      alert('មិនមានទិន្នន័យសម្រាប់ Export ទេ!');
      return;
    }
    await exportResultsToPDF();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">លទ្ធផលបោះឆ្នោត</h1>
        <div className="flex gap-3">
          <button
            onClick={handleExportPDF}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
          >
            <FaFilePdf /> ទាញយក PDF
          </button>
          <button
            onClick={() => window.print()}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition"
          >
            <FaPrint /> បោះពុម្ព
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {errorMessage}
        </div>
      )}

      {/* តំបន់សម្រាប់ Export PDF */}
      <div id="results-print-area" className="bg-white p-8 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-bold text-center mb-3">
          របាយការណ៍លទ្ធផលបោះឆ្នោត
        </h2>
        <p className="text-center text-base text-gray-600 mb-6">
          កាលបរិច្ឆេទ៖ {new Date().toLocaleDateString('km-KH')}
        </p>

        {/* អ្នកឈ្នះ ឬ ករណីស្មើគ្នា */}
        {winners.length > 0 && (
          <div
            className={`text-white p-6 rounded-xl mb-6 ${
              isTie
                ? 'bg-gradient-to-r from-blue-500 to-blue-700'
                : 'bg-gradient-to-r from-yellow-400 to-yellow-600'
            }`}
          >
            <h3 className="text-sm opacity-90 mb-3 flex items-center gap-2">
              {isTie ? '🤝 សំឡេងស្មើគ្នា' : '🏆 អ្នកទទួលបានសំឡេងច្រើនជាងគេ'}
            </h3>
            <div className="space-y-4">
              {winners.map((winner) => (
                <div key={winner.id} className="flex items-center gap-4">
                  {winner.photo ? (
                    <img
                      src={winner.photo}
                      alt={winner.name}
                      className="w-20 h-20 object-cover rounded-full border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="bg-white bg-opacity-20 p-3 rounded-full">
                      <FaTrophy size={28} />
                    </div>
                  )}
                  <div>
                    <p className="text-xl font-bold">{winner.name}</p>
                    <p className="text-sm opacity-90">{winner.party}</p>
                    <p className="text-base mt-1 font-semibold">
                      {winner.votes} សំឡេង ({winner.percent}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {isTie && (
              <p
                className="text-sm mt-4 p-2 rounded font-semibold"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', color: '#ffffff' }}
              >
                ⚠️ មានបេក្ខជន {winners.length} នាក់ ដែលទទួលបានសំឡេងស្មើគ្នា ({winners[0].votes} សំឡេង)
              </p>
            )}
          </div>
        )}

        {/* តារាងលទ្ធផល */}
        <table className="w-full text-left border-collapse text-base">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-3 border text-center text-base">រូបថត</th>
              <th className="p-3 border text-center text-base">លេខរៀង</th>
              <th className="p-3 border text-base">បេក្ខជន</th>
              <th className="p-3 border text-base">គណបក្ស</th>
              <th className="p-3 border text-center text-base">សំឡេងឆ្នោត</th>
              <th className="p-3 border text-center text-base">ភាគរយ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500 border text-lg">
                  កំពុងទាញទិន្នន័យ...
                </td>
              </tr>
            ) : results.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500 border text-lg">
                  មិនទាន់មានលទ្ធផលទេ។
                </td>
              </tr>
            ) : (
              results.map((c) => {
                const isWinner = winners.some((w) => w.id === c.id);
                return (
                  <tr key={c.id} className={`border-b ${isWinner ? 'bg-yellow-50' : ''}`}>
                    <td className="p-3 border text-center">
                      {c.photo ? (
                        <img
                          src={c.photo}
                          alt={c.name}
                          className="w-16 h-16 object-cover rounded-full mx-auto border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-gray-400 text-xs">
                          គ្មាន
                        </div>
                      )}
                    </td>
                    <td className="p-3 border text-center text-base">{c.number}</td>
                    <td className="p-3 border text-base font-semibold">
                      {c.name} {isWinner && '🏆'}
                    </td>
                    <td className="p-3 border text-base">{c.party}</td>
                    <td className="p-3 border text-center font-semibold text-base">
                      {c.votes}
                    </td>
                    <td className="p-3 border text-center text-base">{c.percent}%</td>
                  </tr>
                );
              })
            )}
          </tbody>
          {results.length > 0 && (
            <tfoot className="bg-gray-100 font-bold">
              <tr>
                <td colSpan="4" className="p-3 border text-right text-base">
                  សរុប៖
                </td>
                <td className="p-3 border text-center text-base">{totalVotes}</td>
                <td className="p-3 border text-center text-base">100%</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* ក្រាហ្វិក */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">ក្រាហ្វិកលទ្ធផល</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="votes" fill="#1e40af" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            មិនទាន់មានទិន្នន័យទេ
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;