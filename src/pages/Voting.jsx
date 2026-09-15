import React, { useState, useEffect } from 'react';
import {
  FaVoteYea,
  FaCheckCircle,
  FaIdCard,
  FaUserCheck,
  FaExclamationTriangle,
  FaSignOutAlt,
} from 'react-icons/fa';
import { apiGetCandidates, apiVerifyVoter, apiVote } from '../utils/api';

const Voting = () => {
  const [idCardInput, setIdCardInput] = useState('');
  const [verifiedVoter, setVerifiedVoter] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState('verify'); // 'verify' | 'vote' | 'success'

  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(true);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoadingCandidates(true);
        const data = await apiGetCandidates();
        setCandidates(data);
      } catch (error) {
        console.error('Error loading candidates:', error);
        setErrorMessage('មានបញ្ហាក្នុងការទាញទិន្នន័យបេក្ខជន');
      } finally {
        setLoadingCandidates(false);
      }
    };
    loadCandidates();
  }, []);

  const handleVerify = async () => {
    setErrorMessage('');

    if (!idCardInput.trim()) {
      setErrorMessage('សូមបញ្ចូលអត្តសញ្ញាណប័ណ្ណ!');
      return;
    }

    try {
      setLoading(true);
      const result = await apiVerifyVoter(idCardInput.trim());

      if (result.success && result.voter) {
        setVerifiedVoter(result.voter);
        setStep('vote');
      }
    } catch (error) {
      setErrorMessage('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selected || !verifiedVoter) return;

    try {
      setLoading(true);
      await apiVote(selected, verifiedVoter.id);
      setStep('success');
    } catch (error) {
      setErrorMessage('មានបញ្ហា: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setVerifiedVoter(null);
    setIdCardInput('');
    setSelected(null);
    setStep('verify');
    setErrorMessage('');
  };

  // ============ ជំហានទី ១៖ ផ្ទៀងផ្ទាត់ ============
  if (step === 'verify') {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <div className="bg-primary text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaIdCard size={40} />
            </div>
            <h1 className="text-2xl font-bold mb-2">ផ្ទៀងផ្ទាត់អត្តសញ្ញាណ</h1>
            <p className="text-gray-500 text-sm">
              សូមបញ្ចូលលេខអត្តសញ្ញាណប័ណ្ណរបស់អ្នកដើម្បីបោះឆ្នោត
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2">
              <FaExclamationTriangle className="mt-1 flex-shrink-0" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-semibold">
              លេខអត្តសញ្ញាណប័ណ្ណ
            </label>
            <input
              type="text"
              value={idCardInput}
              onChange={(e) => setIdCardInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="ឧ. 010234567"
              className="w-full border-2 p-3 rounded-lg focus:outline-none focus:border-primary text-lg"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-primary hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              'កំពុងផ្ទៀងផ្ទាត់...'
            ) : (
              <>
                <FaUserCheck /> ផ្ទៀងផ្ទាត់
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ============ ជំហានទី ២៖ បោះឆ្នោត ============
  if (step === 'vote') {
    return (
      <div className="p-6">
        <div className="bg-green-50 border border-green-400 rounded-xl p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-green-600 text-2xl" />
            <div>
              <p className="font-bold text-green-800">
                សូមស្វាគមន៍៖ {verifiedVoter.name}
              </p>
              <p className="text-sm text-gray-600">
                អត្តសញ្ញាណប័ណ្ណ៖ {verifiedVoter.id_card} | ឃុំ៖ {verifiedVoter.commune}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-500 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition text-sm"
          >
            <FaSignOutAlt /> ចាកចេញ
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-6">បោះឆ្នោត</h1>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {errorMessage}
          </div>
        )}

        {loadingCandidates ? (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
            កំពុងទាញទិន្នន័យបេក្ខជន...
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            មិនទាន់មានបេក្ខជនទេ។ សូមទាក់ទងអ្នកគ្រប់គ្រង។
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {candidates.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={`bg-white rounded-xl shadow p-6 cursor-pointer transition border-2 ${
                    selected === c.id
                      ? 'border-primary ring-2 ring-primary'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                      {c.number}
                    </span>
                    {selected === c.id && (
                      <FaCheckCircle className="text-primary text-2xl" />
                    )}
                  </div>

                  {/* រូបថតបេក្ខជន */}
                  {c.photo ? (
                    <img
                      src={c.photo}
                      alt={c.name}
                      className="w-24 h-24 object-cover rounded-full mx-auto mb-3 border-4 border-gray-100"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center text-gray-400 text-xs">
                      គ្មានរូបថត
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-1 text-center">{c.name}</h3>
                  <p className="text-gray-500 text-center text-sm">{c.gender}</p>
                  <p className="text-gray-500 text-center text-sm mt-1">
                    {c.party_role || c.gov_role || '-'}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={handleVote}
              disabled={!selected || loading}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition ${
                !selected || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-blue-700'
              }`}
            >
              <FaVoteYea /> {loading ? 'កំពុងបោះឆ្នោត...' : 'បោះឆ្នោត'}
            </button>
          </>
        )}
      </div>
    );
  }

  // ============ ជំហានទី ៣៖ ជោគជ័យ ============
  if (step === 'success') {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="bg-green-500 text-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle size={60} />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-green-700">
            បោះឆ្នោតជោគជ័យ!
          </h1>
          <p className="text-gray-600 mb-6">
            អ្នកបានបោះឆ្នោតដោយជោគជ័យ។ សូមអរគុណសម្រាប់ការចូលរួម!
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            បោះឆ្នោតអ្នកផ្សេងទៀត
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default Voting;