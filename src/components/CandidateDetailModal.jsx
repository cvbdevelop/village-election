import React from 'react';
import {
  FaTimes,
  FaUserTie,
  FaCalendarAlt,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaUsers,
  FaIdCard,
  FaFlag,
} from 'react-icons/fa';

const CandidateDetailModal = ({ candidate, onClose }) => {
  if (!candidate) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaUserTie /> ព័ត៌មានលម្អិតបេក្ខជន
          </h2>
          <button
            onClick={onClose}
            className="hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* រូបថត + ឈ្មោះ */}
          <div className="flex flex-col items-center mb-6">
            {candidate.photo ? (
              <img
                src={candidate.photo}
                alt={candidate.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-blue-200 shadow-lg mb-4"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <FaUserTie size={60} className="text-gray-400" />
              </div>
            )}
            <h3 className="text-2xl font-bold text-gray-800">{candidate.name}</h3>
            <p className="text-gray-500">
              {candidate.party_role || candidate.gov_role || '-'}
            </p>
          </div>

          {/* ព័ត៌មានលម្អិត */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
              icon={<FaFlag className="text-blue-500" />}
              label="លេខរៀង"
              value={candidate.number || '-'}
            />
            <DetailItem
              icon={<FaUserTie className="text-blue-500" />}
              label="ភេទ"
              value={candidate.gender || '-'}
            />
            <DetailItem
              icon={<FaCalendarAlt className="text-blue-500" />}
              label="ថ្ងៃខែឆ្នាំកំណើត"
              value={
                candidate.dob
                  ? new Date(candidate.dob).toLocaleDateString('km-KH')
                  : '-'
              }
            />
            <DetailItem
              icon={<FaGraduationCap className="text-blue-500" />}
              label="កំរិតវប្បធម៌"
              value={candidate.education || '-'}
            />
            <DetailItem
              icon={<FaUsers className="text-blue-500" />}
              label="តួនាទីក្នុងបក្ស"
              value={candidate.party_role || '-'}
            />
            <DetailItem
              icon={<FaIdCard className="text-blue-500" />}
              label="តួនាទីក្នុងរដ្ឋ"
              value={candidate.gov_role || '-'}
            />
            <DetailItem
              icon={<FaIdCard className="text-blue-500" />}
              label="អត្តលេខ គជប"
              value={candidate.nec_id || '-'}
            />
            <DetailItem
              icon={<FaMapMarkerAlt className="text-blue-500" />}
              label="ទីលំនៅបច្ចុប្បន្ន"
              value={candidate.address || '-'}
              fullWidth
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            បិទ
          </button>
        </div>
      </div>
    </div>
  );
};

// Component សម្រាប់បង្ហាញព័ត៌មាននីមួយៗ
const DetailItem = ({ icon, label, value, fullWidth }) => (
  <div className={`bg-gray-50 p-3 rounded-lg ${fullWidth ? 'md:col-span-2' : ''}`}>
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <p className="text-gray-500 text-sm font-semibold">{label}</p>
    </div>
    <p className="text-gray-800 font-medium">{value}</p>
  </div>
);

export default CandidateDetailModal;