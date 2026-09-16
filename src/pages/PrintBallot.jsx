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
    const totalCells = 25;
    const cells = [];

    for (let i = 0; i < totalCells; i++) {
      const candidate = candidates[i]; // យកបេក្ខជនតាមលំដាប់

      cells.push(
        <div key={i} className="border border-black flex flex-col justify-between relative min-h-[140px] p-2">
          {candidate ? (
            <div className="flex flex-col items-center flex-1">
              {/* រូបថតបេក្ខជន */}
              <div className="w-20 h-24 border border-gray-400 mb-1 flex items-center justify-center overflow-hidden bg-gray-50">
                {candidate.photo ? (
                  <img src={candidate.photo} alt={candidate.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs text-center">គ្មានរូបថត</span>
                )}
              </div>
              {/* លេខរៀង និងឈ្មោះ */}
              <div className="w-full text-center">
                <p className="font-bold text-sm leading-tight">
                  {candidate.number}. {candidate.name}
                </p>
                <p className="text-xs text-gray-600 leading-tight">
                  ({candidate.party_role || candidate.gov_role || 'គ្មានគណបក្ស'})
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1"></div> // ទំហំទទេសម្រាប់ប្រអប់ដែលគ្មានបេក្ខជន
          )}

          {/* ប្រអប់ធីក (Checkbox) នៅខាងក្រោមស្តាំ */}
          <div className="self-end mt-auto pt-2">
            <div className="w-8 h-8 border-2 border-blue-600 rounded-sm bg-white"></div>
          </div>
        </div>
      );
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
      <div className="no-print bg-white p-4 md:p-6 rounded-xl shadow mb-6 max-w-5xl mx-auto">
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
          <div key={copyIndex} className="ballot-page bg-white p-6 md:p-8 mb-8" style={{ pageBreakAfter: copyIndex < copies - 1 ? 'always' : 'auto' }}>
            
            {/* ============ Header សន្លឹកឆ្នោត ============ */}
            <div className="text-center mb-4">
              <div className="flex justify-between items-start text-xs md:text-sm font-bold">
                <div className="text-left leading-tight">
                  <p>គណៈកម្មាធិការជាតិរៀបចំការបោះឆ្នោត</p>
                  <p>គណៈកម្មការរៀបចំការបោះឆ្នោតឃុំ/សង្កាត់</p>
                  <p>គណៈអចិន្ត្រៃយ៍</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  {/* រូបសញ្ញាជាតិ (ឧបមា) */}
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full flex items-center justify-center border-2 border-blue-900 text-blue-900 font-bold text-[10px] text-center leading-tight p-1">
                    ព្រះរាជាណាចក្រ<br/>កម្ពុជា
                  </div>
                </div>
                <div className="text-right leading-tight">
                  <p>ឯករាជ្យ សន្តិភាព សេរីភាព ប្រជាធិបតេយ្យ</p>
                  <p>អព្យាក្រឹត និង វឌ្ឍនភាពសង្គម</p>
                </div>
              </div>

              <h1 className="text-lg md:text-xl font-bold mt-4 text-blue-900">
                សន្លឹកឆ្នោតបោះឆ្នោតជ្រើសរើសក្រុមប្រឹក្សាឃុំ/សង្កាត់
              </h1>
              <p className="text-sm md:text-base font-bold text-blue-900">
                អាណត្តិទី៦ ឆ្នាំ២០២៧
              </p>
            </div>

            {/* ============ សេចក្តីណែនាំ ============ */}
            <div className="bg-blue-50 border border-blue-400 p-3 rounded-lg mb-4 text-center">
              <p className="text-xs md:text-sm text-gray-800">
                សូមគូសសញ្ញា <span className="font-bold text-blue-600">✓</span> ក្នុងប្រអប់បន្ទាត់ដេកខាងក្រោមរូបថតបេក្ខជនដែលលោកអ្នកពេញចិត្តចំនួន.........រូប។
              </p>
            </div>

            {/* ============ Grid បេក្ខជន ៥ ជួរឈរ ============ */}
            <div className="grid grid-cols-5 border-t-2 border-l-2 border-black">
              {renderGridCells()}
            </div>

            {/* ============ Footer ============ */}
            <div className="mt-4 text-center text-xs text-gray-500">
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
          .ballot-page { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 20px !important; page-break-after: always; }
          .ballot-page:last-child { page-break-after: auto; }
          @page { size: A4 landscape; margin: 10mm; } /* ប្រើ Landscape ដើម្បីឱ្យសមនឹង ៥ ជួរឈរ */
        }
      `}</style>
    </div>
  );
};

export default PrintBallot;