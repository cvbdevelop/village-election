import React, { useState, useEffect } from 'react';
import {
  FaPlus, FaSearch, FaCheckCircle, FaTimesCircle, FaFilePdf,
  FaEdit, FaTrash, FaSave, FaTimes,
} from 'react-icons/fa';
import { exportVotersToPDF } from '../utils/pdfExport';
import { getCommunes, getVillagesByCommune } from '../data/locations';
import {
  apiGetVoters, apiAddVoter, apiUpdateVoter, apiDeleteVoter,
} from '../utils/api';

const Voters = () => {
  const [voters, setVoters] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '',
    idCard: '',
    commune: '',
    village: '',
    station: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

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
    setForm({ name: '', idCard: '', commune: '', village: '', station: '' });
    setEditingId(null);
  };

  // ពេលប្តូរឃុំ ត្រូវ Reset ភូមិចោល
  const handleCommuneChange = (communeValue) => {
    setForm({ ...form, commune: communeValue, village: '' });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.idCard) {
      alert('សូមបំពេញឈ្មោះ និងអត្តសញ្ញាណប័ណ្ណ!');
      return;
    }
    if (!form.commune || !form.village) {
      alert('សូមជ្រើសរើសឃុំ និងភូមិ!');
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
      commune: voter.commune || '',
      village: voter.village || '',
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

  // ស្វែងរកតាមឈ្មោះ, អត្តសញ្ញាណប័ណ្ណ, ឃុំ, ភូមិ
  const filteredVoters = voters.filter(
    (v) =>
      v.name?.toLowerCase().includes(search.toLowerCase()) ||
      v.id_card?.includes(search) ||
      v.commune?.toLowerCase().includes(search.toLowerCase()) ||
      v.village?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">គ្រប់គ្រងអ្នកបោះឆ្នោត</h1>
        <button onClick={handleExportPDF} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition">
          <FaFilePdf /> ទាញយក PDF
        </button>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? '✏️ កែប្រែព័ត៌មានអ្នកបោះឆ្នោត' : '➕ ចុះឈ្មោះអ្នកបោះឆ្នោតថ្មី'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">ឈ្មោះអ្នកបោះឆ្នោត</label>
            <input type="text" placeholder="ឈ្មោះអ្នកបោះឆ្នោត" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">អត្តសញ្ញាណប័ណ្ណ</label>
            <input type="text" placeholder="អត្តសញ្ញាណប័ណ្ណ" value={form.idCard} onChange={(e) => setForm({ ...form, idCard: e.target.value })} className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">ឃុំ</label>
            <select value={form.commune} onChange={(e) => handleCommuneChange(e.target.value)} className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">-- ជ្រើសរើសឃុំ --</option>
              {getCommunes().map((c) => (<option key={c} value={c}>ឃុំ{c}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">ភូមិ</label>
            <select value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} disabled={!form.commune} className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${!form.commune ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
              <option value="">{form.commune ? '-- ជ្រើសរើសភូមិ --' : '-- ជ្រើសរើសឃុំជាមុន --'}</option>
              {getVillagesByCommune(form.commune).map((v) => (<option key={v} value={v}>{v}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">ការិយាល័យបោះឆ្នោត</label>
            <input type="text" placeholder="ការិយាល័យបោះឆ្នោត" value={form.station} onChange={(e) => setForm({ ...form, station: e.target.value })} className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="flex items-end gap-2">
            {editingId ? (
              <>
                <button onClick={handleSubmit} className="flex-1 bg-green-600 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 hover:bg-green-700 transition"><FaSave /> រក្សាទុក</button>
                <button onClick={resetForm} className="flex-1 bg-gray-500 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-600 transition"><FaTimes /> បោះបង់</button>
              </>
            ) : (
              <button onClick={handleSubmit} className="w-full bg-primary text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 hover:bg-blue-700 transition"><FaPlus /> ចុះឈ្មោះ</button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex items-center gap-2">
        <FaSearch className="text-gray-400" />
        <input type="text" placeholder="ស្វែងរកតាមឈ្មោះ, អត្តសញ្ញាណប័ណ្ណ, ឃុំ ឬភូមិ..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full outline-none" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <h3 className="p-4 bg-gray-100 font-semibold">គ្រប់គ្រងអ្នកបោះឆ្នោត</h3>
        <table className="w-full text-left min-w-[1000px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">ឈ្មោះ</th>
              <th className="p-4">អត្តសញ្ញាណប័ណ្ណ</th>
              <th className="p-4">ឃុំ</th>
              <th className="p-4">ភូមិ</th>
              <th className="p-4">ការិយាល័យ</th>
              <th className="p-4">ស្ថានភាព</th>
              <th className="p-4 text-center">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {filteredVoters.length === 0 ? (
              <tr><td colSpan="7" className="p-6 text-center text-gray-500">មិនទាន់មានអ្នកបោះឆ្នោតទេ។</td></tr>
            ) : (
              filteredVoters.map((v) => (
                <tr key={v.id} className={`border-b hover:bg-gray-50 transition ${editingId === v.id ? 'bg-yellow-50' : ''}`}>
                  <td className="p-4">{v.name}</td>
                  <td className="p-4">{v.id_card}</td>
                  <td className="p-4">{v.commune || '-'}</td>
                  <td className="p-4">{v.village || '-'}</td>
                  <td className="p-4">{v.station}</td>
                  <td className="p-4">
                    {v.voted ? (<span className="text-green-600 flex items-center gap-1"><FaCheckCircle /> បានបោះឆ្នោត</span>) : (<span className="text-gray-500 flex items-center gap-1"><FaTimesCircle /> មិនទាន់បោះ</span>)}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleEdit(v)} className="text-blue-500 hover:text-blue-700 transition" title="កែប្រែ"><FaEdit size={18} /></button>
                      <button onClick={() => handleDelete(v.id)} className="text-red-500 hover:text-red-700 transition" title="លុប"><FaTrash size={18} /></button>
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