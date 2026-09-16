import React, { useState, useEffect } from 'react';
import { FaPrint, FaSquare, FaVoteYea } from 'react-icons/fa';
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

  const handlePrint = () => { window.print(); };

  const renderBallots = () => {
    const ballots = [];
    for (let i = 0; i < copies; i++) {
      ballots.push(
        <div key={i} className="ballot-page bg-white p-6 md:p-8 mb-8" style={{ pageBreakAfter: i < copies - 1 ? 'always' : 'auto', border: '2px solid #1e40af', borderRadius: '12px' }}>
          <div className="text-center mb-6 border-b-2 border-blue-800 pb-4">
            <h1 className="text-xl md:text-2xl font-bold text-blue-800 mb-2">ព្រះរាជាណាចក្រកម្ពុជា</h1>
            <h2 className="text-lg md:text-xl font-bold">ជាតិ សាសនា ព្រះមហាក្សត្រ</h2>
            <div className="mt-4">
              <p className="text-base md:text-lg font-bold">សន្លឹកឆ្នោតបោះឆ្នោត</p>
              <p className="text-sm md:text-md">ជ្រើសរើសក្រុមប្រឹក្សាឃុំ/សង្កាត់</p>
              <p className="text-xs md:text-sm text-gray-600 mt-2">កាលបរិច្ឆេទ៖ {new Date().toLocaleDateString('km-KH')}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-400 p-3 rounded-lg mb-6">
            <p className="text-xs md:text-sm text-gray-700">
              <strong>សេចក្តីណែនាំ៖</strong> សូមដាក់សញ្ញា ✓ ក្នុងប្រអប់ចំពោះមុខបេក្ខជន ដែលអ្នកចង់បោះឆ្នោតឱ្យ។ សូមបោះឆ្នោតតែម្តងគត់។
            </p>
          </div>

          <div className="space-y-3">
            {candidates.map((c) => (
              <div key={c.id} className="flex items-center gap-3 md:gap-4 border-2 border-gray-300 rounded-lg p-3 md:p-4">
                <FaSquare className="text-gray-400 flex-shrink-0" size={24} />
                {c.photo ? (
                  <img src={c.photo} alt={c.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full border-2 border-gray-300 flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 flex-shrink-0 text-xs">គ្មាន</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-800 text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm flex-shrink-0">{c.number}</span>
                    <h3 className="text-base md:text-lg font-bold truncate">{c.name}</h3>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">គណបក្ស៖ {c.party_role || c.gov_role || '-'}</p>
                  <p className="text-xs text-gray-500">ភេទ៖ {c.gender || '-'} | កំរិតវប្បធម៌៖ {c.education || '-'}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t-2 border-blue-800 text-center">
            <p className="text-xs text-gray-500">សន្លឹកឆ្នោតនេះមានសុពលភាពសម្រាប់ការបោះឆ្នោតតែម្តងគត់</p>
            <p className="text-xs text-gray-400 mt-1">ច្បាប់ទី {i + 1} / {copies}</p>
          </div>
        </div>
      );
    }
    return ballots;
  };

  if (loading) {
    return (<div className="p-6 flex justify-center items-center min-h-screen"><div className="text-gray-500 text-lg">កំពុងទាញទិន្នន័យ...</div></div>);
  }

  if (candidates.length === 0) {
    return (<div className="p-6"><div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">មិនទាន់មានបេក្ខជនទេ។ សូមបន្ថែមបេក្ខជនជាមុនសិន។</div></div>);
  }

  return (
    <div className="p-4 md:p-6">
      <div className="no-print bg-white p-4 md:p-6 rounded-xl shadow mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2"><FaVoteYea className="text-primary" /> បោះពុម្ពសន្លឹកឆ្នោត</h1>
            <p className="text-gray-500 text-xs md:text-sm mt-1">បង្កើតសន្លឹកឆ្នោតសម្រាប់ការបោះឆ្នោតជាក់ស្តែង</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <label className="text-xs md:text-sm font-semibold whitespace-nowrap">ចំនួនច្បាប់៖</label>
              <input type="number" min="1" max="100" value={copies} onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))} className="border p-2 rounded-lg w-20 text-center" />
            </div>
            <button onClick={handlePrint} className="bg-primary text-white px-6 py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition font-semibold text-sm md:text-base">
              <FaPrint /> បោះពុម្ព
            </button>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs md:text-sm text-blue-800">💡 <strong>ចំណាំ៖</strong> សូមជ្រើសរើស "Save as PDF" ក្នុងប្រអប់បោះពុម្ព ដើម្បីរក្សាទុកជាឯកសារ PDF ឬជ្រើសរើស Printer ដើម្បីបោះពុម្ពផ្ទាល់។</p>
        </div>
      </div>

      <div id="ballot-print-area" className="ballot-container">{renderBallots()}</div>

      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          .ballot-page { box-shadow: none !important; border: 2px solid #1e40af !important; margin: 0 !important; padding: 20px !important; page-break-after: always; }
          .ballot-page:last-child { page-break-after: auto; }
          @page { size: A4; margin: 10mm; }
        }
      `}</style>
    </div>
  );
};

export default PrintBallot;