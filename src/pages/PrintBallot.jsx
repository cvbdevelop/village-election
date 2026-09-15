import React, { useState, useEffect } from 'react';
import { FaPrint, FaCheckSquare, FaSquare, FaVoteYea } from 'react-icons/fa';
import { apiGetCandidates } from '../utils/api';

const PrintBallot = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copies, setCopies] = useState(1);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setLoading(true);
        const data = await apiGetCandidates();
        setCandidates(data);
      } catch (error) {
        alert('មានបញ្ហាក្នុងការទាញទិន្នន័យ: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    loadCandidates();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  // បង្កើតសន្លឹកឆ្នោតច្រើនច្បាប់
  const renderBallots = () => {
    const ballots = [];
    for (let i = 0; i < copies; i++) {
      ballots.push(
        <div
          key={i}
          className="ballot-page bg-white p-8 mb-8"
          style={{
            pageBreakAfter: i < copies - 1 ? 'always' : 'auto',
            border: '2px solid #1e40af',
            borderRadius: '12px',
          }}
        >
          {/* Header សន្លឹកឆ្នោត */}
          <div className="text-center mb-6 border-b-2 border-blue-800 pb-4">
            <h1 className="text-2xl font-bold text-blue-800 mb-2">
              ព្រះរាជាណាចក្រកម្ពុជា
            </h1>
            <h2 className="text-xl font-bold">ជាតិ សាសនា ព្រះមហាក្សត្រ</h2>
            <div className="mt-4">
              <p className="text-lg font-bold">សន្លឹកឆ្នោតបោះឆ្នោត</p>
              <p className="text-md">ជ្រើសរើសក្រុមប្រឹក្សាឃុំ/សង្កាត់</p>
              <p className="text-sm text-gray-600 mt-2">
                កាលបរិច្ឆេទ៖ {new Date().toLocaleDateString('km-KH')}
              </p>
            </div>
          </div>

          {/* សេចក្តីណែនាំ */}
          <div className="bg-yellow-50 border border-yellow-400 p-3 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              <strong>សេចក្តីណែនាំ៖</strong> សូមដាក់សញ្ញា ✓ ក្នុងប្រអប់ចំពោះមុខបេក្ខជន
              ដែលអ្នកចង់បោះឆ្នោតឱ្យ។ សូមបោះឆ្នោតតែម្តងគត់។
            </p>
          </div>

          {/* បញ្ជីបេក្ខជន */}
          <div className="space-y-3">
            {candidates.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 border-2 border-gray-300 rounded-lg p-4 hover:border-blue-500"
              >
                {/* ប្រអប់ធីក */}
                <div className="flex-shrink-0">
                  <FaSquare className="text-gray-400" size={28} />
                </div>

                {/* រូបថត */}
                {c.photo ? (
                  <img
                    src={c.photo}
                    alt={c.name}
                    className="w-20 h-20 object-cover rounded-full border-2 border-gray-300 flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 flex-shrink-0">
                    គ្មាន
                  </div>
                )}

                {/* ព័ត៌មានបេក្ខជន */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      {c.number}
                    </span>
                    <h3 className="text-lg font-bold">{c.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    គណបក្ស៖ {c.party_role || c.gov_role || '-'}
                  </p>
                  <p className="text-xs text-gray-500">
                    ភេទ៖ {c.gender || '-'} | កំរិតវប្បធម៌៖ {c.education || '-'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer សន្លឹកឆ្នោត */}
          <div className="mt-6 pt-4 border-t-2 border-blue-800 text-center">
            <p className="text-xs text-gray-500">
              សន្លឹកឆ្នោតនេះមានសុពលភាពសម្រាប់ការបោះឆ្នោតតែម្តងគត់
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ច្បាប់ទី {i + 1} / {copies}
            </p>
          </div>
        </div>
      );
    }
    return ballots;
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-lg">កំពុងទាញទិន្នន័យ...</div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          មិនទាន់មានបេក្ខជនទេ។ សូមបន្ថែមបេក្ខជនជាមុនសិន។
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Control Panel (លាក់ពេលបោះពុម្ព) */}
      <div className="no-print bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaVoteYea className="text-primary" /> បោះពុម្ពសន្លឹកឆ្នោត
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              បង្កើតសន្លឹកឆ្នោតសម្រាប់ការបោះឆ្នោតជាក់ស្តែង
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* ចំនួនច្បាប់ */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold">ចំនួនច្បាប់៖</label>
              <input
                type="number"
                min="1"
                max="100"
                value={copies}
                onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                className="border p-2 rounded-lg w-20 text-center"
              />
            </div>

            {/* ប៊ូតុងបោះពុម្ព */}
            <button
              onClick={handlePrint}
              className="bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition font-semibold"
            >
              <FaPrint /> បោះពុម្ព
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>ចំណាំ៖</strong> សូមជ្រើសរើស "Save as PDF" ក្នុងប្រអប់បោះពុម្ព
            ដើម្បីរក្សាទុកជាឯកសារ PDF ឬជ្រើសរើស Printer ដើម្បីបោះពុម្ពផ្ទាល់។
          </p>
        </div>
      </div>

      {/* តំបន់សន្លឹកឆ្នោត */}
      <div id="ballot-print-area" className="ballot-container">
        {renderBallots()}
      </div>

      {/* CSS សម្រាប់ការបោះពុម្ព */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .ballot-page {
            box-shadow: none !important;
            border: 2px solid #1e40af !important;
            margin: 0 !important;
            padding: 20px !important;
            page-break-after: always;
          }
          .ballot-page:last-child {
            page-break-after: auto;
          }
          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintBallot;