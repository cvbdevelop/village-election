import React, { useState, useEffect } from 'react';
import {
  FaPlus,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaFilePdf,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
} from 'react-icons/fa';
import { exportVotersToPDF } from '../utils/pdfExport';
import {
  apiGetVoters,
  apiAddVoter,
  apiUpdateVoter,
  apiDeleteVoter,
} from '../utils/api';

const Voters = () => {
  const [voters, setVoters] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', idCard: '', commune: '', station: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ទាញទិន្នន័យពី API
  const loadVoters = async () => {
    try {
      setLoading(true);
      const data = await apiGetVoters();
      setVoters(data);
    } catch (error) {
      alert('មានបញ្ហាក្នុងការទាញទិន្នន័យ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVoters();
  }, []);

  const resetForm = () => {
    setForm({ name: '', idCard: '', commune: '', station: '' });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.idCard) {
      alert('សូមបំពេញឈ្មោះ និងអត្តសញ្ញាណប័ណ្ណ!');
      return;
    }

    try {
      if (editingId) {
        await apiUpdateVoter(editingId, form);
      } else {
        await apiAddVoter(form);
      }
      await loadVoters();
      resetForm();
    } catch (error) {
      alert('មានបញ្ហា: ' + error.message);
    }
  };

  const handleEdit = (voter) => {
    setForm({
      name: voter.name,
      idCard: voter.id_card,
      commune: voter.commune,
      station: voter.station,
    });
    setEditingId(voter.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('តើអ្នកប្រាកដជាចង់លុបអ្នកបោះឆ្នោតនេះឬ?')) {
      try {
        await apiDeleteVoter(id);
        await loadVoters();
      } catch (error) {
        alert('មានបញ្ហា: ' + error.message);
      }
    }
  };

  const handleExportPDF = async () => {
    if (voters.length === 0) {
      alert('មិនមានទិន្នន័យសម្រាប់ Export ទេ!');
      return;
    }
    await exportVotersToPDF();
  };

  // ស្វែងរកតាមឈ្មោះ ឬអត្តសញ្ញាណប័ណ្ណ
  const filteredVoters = voters.filter(
    (v) =>
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.id_card?.includes(search)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">គ្រប់គ្រងអ្នកបោះឆ្នោត</h1>
        <button
          onClick={handleExportPDF}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
        >
          <FaFilePdf /> ទាញយក PDF
        </button>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? '✏️ កែប្រែព័ត៌មានអ្នកបោះឆ្នោត' : '➕ ចុះឈ្មោះអ្នកបោះឆ្នោតថ្មី'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="ឈ្មោះអ្នកបោះឆ្នោត"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="អត្តសញ្ញាណប័ណ្ណ"
            value={form.idCard}
            onChange={(e) => setForm({ ...form, idCard: e.target.value })}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="ឃុំ/សង្កាត់"
            value={form.commune}
            onChange={(e) => setForm({ ...form, commune: e.target.value })}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="ការិយាល័យបោះឆ្នោត"
            value={form.station}
            onChange={(e) => setForm({ ...form, station: e.target.value })}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {editingId ? (
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 hover:bg-green-700 transition"
              >
                <FaSave /> រក្សាទុក
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-500 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-600 transition"
              >
                <FaTimes /> បោះបង់
              </button>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-primary text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 hover:bg-blue-700 transition"
            >
              <FaPlus /> ចុះឈ្មោះ
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex items-center gap-2">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="ស្វែងរកតាមឈ្មោះ ឬអត្តសញ្ញាណប័ណ្ណ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      {/* តំបន់សម្រាប់ Export PDF */}
      <div id="voters-print-area" className="bg-white p-8 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-bold text-center mb-3">បញ្ជីរាយនាមអ្នកបោះឆ្នោត</h2>
        <p className="text-center text-base text-gray-600 mb-6">
          កាលបរិច្ឆេទ៖ {new Date().toLocaleDateString('km-KH')}
        </p>

        <table className="w-full text-left border-collapse text-base">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-4 border text-center text-lg">ល.រ</th>
              <th className="p-4 border text-lg">ឈ្មោះ</th>
              <th className="p-4 border text-lg">អត្តសញ្ញាណប័ណ្ណ</th>
              <th className="p-4 border text-lg">ឃុំ</th>
              <th className="p-4 border text-lg">ការិយាល័យ</th>
              <th className="p-4 border text-center text-lg">ស្ថានភាព</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500 border text-lg">
                  កំពុងទាញទិន្នន័យ...
                </td>
              </tr>
            ) : voters.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500 border text-lg">
                  មិនទាន់មានអ្នកបោះឆ្នោតទេ។
                </td>
              </tr>
            ) : (
              voters.map((v, index) => (
                <tr key={v.id} className="border-b">
                  <td className="p-4 border text-center text-base">{index + 1}</td>
                  <td className="p-4 border text-base">{v.name}</td>
                  <td className="p-4 border text-center text-base">{v.id_card}</td>
                  <td className="p-4 border text-base">{v.commune}</td>
                  <td className="p-4 border text-base">{v.station}</td>
                  <td className="p-4 border text-center text-base">
                    {v.voted ? 'បានបោះ' : 'មិនទាន់'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <p className="mt-6 text-base text-gray-600">
          សរុប៖ <span className="font-bold text-primary">{voters.length}</span> អ្នកបោះឆ្នោត
        </p>
      </div>

      {/* តារាងសម្រាប់គ្រប់គ្រង */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <h3 className="p-4 bg-gray-100 font-semibold">គ្រប់គ្រងអ្នកបោះឆ្នោត</h3>
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">ឈ្មោះ</th>
              <th className="p-4">អត្តសញ្ញាណប័ណ្ណ</th>
              <th className="p-4">ឃុំ</th>
              <th className="p-4">ការិយាល័យ</th>
              <th className="p-4">ស្ថានភាព</th>
              <th className="p-4 text-center">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {filteredVoters.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  មិនទាន់មានអ្នកបោះឆ្នោតទេ។
                </td>
              </tr>
            ) : (
              filteredVoters.map((v) => (
                <tr
                  key={v.id}
                  className={`border-b hover:bg-gray-50 transition ${
                    editingId === v.id ? 'bg-yellow-50' : ''
                  }`}
                >
                  <td className="p-4">{v.name}</td>
                  <td className="p-4">{v.id_card}</td>
                  <td className="p-4">{v.commune}</td>
                  <td className="p-4">{v.station}</td>
                  <td className="p-4">
                    {v.voted ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <FaCheckCircle /> បានបោះឆ្នោត
                      </span>
                    ) : (
                      <span className="text-gray-500 flex items-center gap-1">
                        <FaTimesCircle /> មិនទាន់បោះ
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(v)}
                        className="text-blue-500 hover:text-blue-700 transition"
                        title="កែប្រែ"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="text-red-500 hover:text-red-700 transition"
                        title="លុប"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Voters;