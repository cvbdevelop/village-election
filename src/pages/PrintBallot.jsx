import React, { useState, useEffect } from 'react';
import { FaPrint, FaVoteYea } from 'react-icons/fa';
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
        // តម្រៀបតាមលេខរៀង
        const sorted = data.sort((a, b) => parseInt(a.number) - parseInt(b.number));
        setCandidates(sorted);
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

  // បង្កើត Grid ៥ ជួរឈរ x ៥ ជួរដេក (សរុប ២៥ ប្រអប់)
  const renderGridCells = () => {
    const totalRows = 5;
    const totalCols = 5;
    const cells = [];

    for (let row = 0; row < totalRows; row++) {
      for (let col = 0; col < totalCols; col++) {
        const index = row * totalCols + col;
        const candidate = candidates[index];

        cells.push(
          <div
            key={`${row}-${col}`}
            className="border-r border-b border-black relative"
            style={{ minHeight: '140px', height: '140px' }}
          >
            {/* ព័ត៌មានបេក្ខជន (ប្រសិនបើមាន) */}
            {candidate && (
              <div className="flex flex-col items-center p-2 h-full">
                {/* រូបថត */}
                <div className="w-16 h-20 border border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 mb-1">
                  {candidate.photo ? (
                    <img
                      src={candidate.photo}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-[10px] text-center">គ្មានរូប</span>
                  )}
                </div>
                {/* លេខរៀង និងឈ្មោះ */}
                <p className="text-[11px] font-bold text-center leading-tight">
                  {candidate.number}. {candidate.name}
                </p>
                <p className="text-[9px] text-gray-600 text-center leading-tight">
                  ({candidate.party_role || candidate.gov_role || '-'})
                </p>
              </div>
            )}

            {/* ប្រអប់ធីក (Checkbox) ជ្រុងខាងក្រោមស្តាំ */}
            <div
              className="absolute border-2 border-blue-600 bg-white"
              style={{ width: '28px', height: '28px', bottom: '8px', right: '8px' }}
            ></div>
          </div>
        );
      }
    }
    return cells;
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
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-center">
          មិនទាន់មានបេក្ខជនទេ។ សូមបន្ថែមបេក្ខជនជាមុនសិន។
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Control Panel (លាក់ពេលបោះពុម្ព) */}
      <div className="no-print bg-white p-4 md:p-6 rounded-xl shadow mb-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <FaVoteYea className="text-primary" /> បោះពុម្ពសន្លឹកឆ្នោត
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              បង្កើតសន្លឹកឆ្នោតសម្រាប់ការបោះឆ្នោតជាក់ស្តែង
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold whitespace-nowrap">ចំនួនច្បាប់៖</label>
              <input
                type="number"
                min="1"
                max="200"
                value={copies}
                onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                className="border p-2 rounded-lg w-24 text-center"
              />
            </div>
            <button
              onClick={handlePrint}
              className="bg-primary text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition font-semibold"
            >
              <FaPrint /> បោះពុម្ព
            </button>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>ចំណាំ៖</strong> សូមជ្រើសរើស "Save as PDF" ក្នុងប្រអប់បោះពុម្ព ដើម្បីរក្សាទុកជាឯកសារ PDF ឬជ្រើសរើស Printer ដើម្បីបោះពុម្ពផ្ទាល់។
          </p>
        </div>
      </div>

      {/* តំបន់សន្លឹកឆ្នោត */}
      <div id="ballot-print-area" className="ballot-container">
        {Array.from({ length: copies }).map((_, copyIndex) => (
          <div
            key={copyIndex}
            className="ballot-page bg-white p-4 md:p-6 mb-8"
            style={{ pageBreakAfter: copyIndex < copies - 1 ? 'always' : 'auto' }}
          >
            {/* ============ Header សន្លឹកឆ្នោត ============ */}
            <div className="text-center mb-3">
              <div className="flex justify-between items-start text-[10px] md:text-xs font-bold">
                <div className="text-left leading-tight w-1/3">
                  <p>គណៈកម្មាធិការជាតិរៀបចំការបោះឆ្នោត</p>
                  <p>គណៈកម្មការរៀបចំការបោះឆ្នោតឃុំ/សង្កាត់</p>
                  <p>គណៈអចិន្ត្រៃយ៍</p>
                </div>
                <div className="flex flex-col items-center justify-center w-1/3">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center border-2 border-blue-900 text-blue-900 font-bold text-[8px] md:text-[9px] text-center leading-tight p-1">
                    ព្រះរាជាណាចក្រ<br/>កម្ពុជា
                  </div>
                </div>
                <div className="text-right leading-tight w-1/3">
                  <p>ឯករាជ្យ សន្តិភាព សេរីភាព ប្រជាធិបតេយ្យ</p>
                  <p>អព្យាក្រឹត និង វឌ្ឍនភាពសង្គម</p>
                </div>
              </div>

              <h1 className="text-sm md:text-base font-bold mt-3 text-blue-900">
                សន្លឹកឆ្នោតបោះឆ្នោតជ្រើសរើសក្រុមប្រឹក្សាឃុំ/សង្កាត់
              </h1>
              <p className="text-xs md:text-sm font-bold text-blue-900 mt-1">
                អាណត្តិទី៦ ឆ្នាំ២០២៧
              </p>
            </div>

            {/* ============ សេចក្តីណែនាំ ============ */}
            <div className="border border-blue-400 p-2 rounded mb-3 text-center bg-blue-50">
              <p className="text-[10px] md:text-xs text-gray-800">
                សូមគូសសញ្ញា <span className="font-bold text-blue-600">✓</span> ក្នុងប្រអប់បន្ទាត់ដេកខាងក្រោមរូបថតបេក្ខជនដែលលោកអ្នកពេញចិត្តចំនួន.........រូប។
              </p>
            </div>

            {/* ============ Grid បេក្ខជន ៥ ជួរឈរ x ៥ ជួរដេក ============ */}
            <div className="grid grid-cols-5 border-t-2 border-l-2 border-black">
              {renderGridCells()}
            </div>

            {/* ============ Footer ============ */}
            <div className="mt-3 text-center text-[9px] md:text-xs text-gray-500">
              <p>សន្លឹកឆ្នោតនេះមានសុពលភាពសម្រាប់ការបោះឆ្នោតតែម្តងគត់</p>
              <p className="mt-1">ច្បាប់ទី {copyIndex + 1} / {copies}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CSS សម្រាប់ការបោះពុម្ព */}
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          .ballot-page {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 15px !important;
            page-break-after: always;
          }
          .ballot-page:last-child { page-break-after: auto; }
          @page {
            size: A4 landscape;
            margin: 8mm;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintBallot;