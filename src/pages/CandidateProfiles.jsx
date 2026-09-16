import React, { useState, useEffect } from 'react';
import { FaUserTie } from 'react-icons/fa';
import { apiGetResults } from '../utils/api';

const CandidateProfiles = () => {
  const [results, setResults] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        const data = await apiGetResults();
        setResults(data.results || []);
        setTotalVotes(data.totalVotes || 0);
      } catch (error) {
        console.error('Error loading results:', error);
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen bg-[#0b1b3d]">
        <div className="text-white text-lg">កំពុងទាញទិន្នន័យ...</div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-6 bg-[#0b1b3d] min-h-screen">
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-center max-w-2xl mx-auto">
          មិនទាន់មានបេក្ខជនទេ។ សូមបន្ថែមបេក្ខជនជាមុនសិន។
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-[#0b1b3d] min-h-screen">
      <div className="max-w-5xl mx-auto bg-[#0b1b3d] rounded-2xl shadow-2xl overflow-hidden border border-white/10">
        
        {/* ============ Header Title ============ */}
        <div className="bg-white p-4 md:p-6 text-center">
          <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-[#0b1b3d] uppercase tracking-wide">
            លទ្ធផលបោះឆ្នោតជ្រើសរើសបេក្ខជន
          </h1>
          <p className="text-gray-600 text-xs md:text-sm mt-2">
            ក្រុមប្រឹក្សាឃុំ/សង្កាត់ — កាលបរិច្ឆេទ៖ {new Date().toLocaleDateString('km-KH')}
          </p>
        </div>

        {/* ============ Candidate Grid ============ */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {results.map((candidate, index) => {
              const rank = index + 1;
              const percent = candidate.percent || '0.00';

              return (
                <div
                  key={candidate.id}
                  className="bg-white rounded-xl p-3 md:p-4 flex items-center gap-3 md:gap-4 shadow-md hover:shadow-lg transition duration-300"
                >
                  {/* Rank Number */}
                  <div className="text-2xl md:text-3xl font-bold text-[#0b1b3d] min-w-[35px] md:min-w-[45px] text-center flex-shrink-0">
                    {rank}.
                  </div>

                  {/* Candidate Photo */}
                  <div className="flex-shrink-0">
                    {candidate.photo ? (
                      <img
                        src={candidate.photo}
                        alt={candidate.name}
                        className="w-14 h-14 md:w-20 md:h-20 object-cover rounded-full border-2 border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 md:w-20 md:h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 border-2 border-gray-300">
                        <FaUserTie size={24} />
                      </div>
                    )}
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base lg:text-lg font-bold text-gray-800 truncate">
                      {candidate.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 truncate">
                      ({candidate.party || 'គ្មានគណបក្ស'})
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs md:text-sm font-bold text-green-700">
                        {candidate.votes} សំឡេង
                      </span>
                      <span className="text-xs md:text-sm text-gray-500">
                        ({percent}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============ Footer Summary ============ */}
        <div className="bg-[#0b1b3d] p-3 md:p-4 text-center border-t border-white/10">
          <p className="text-gray-300 text-xs md:text-sm">
            សំឡេងឆ្នោតសរុប៖{' '}
            <span className="font-bold text-white">{totalVotes}</span>
            {' | '}
            ចំនួនបេក្ខជន៖{' '}
            <span className="font-bold text-white">{results.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfiles;