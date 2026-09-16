import React, { useState, useEffect } from 'react';
import {
  FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaFilePdf, FaCamera, FaExclamationTriangle, FaEye,
} from 'react-icons/fa';
import { exportCandidatesToPDF } from '../utils/pdfExport';
import CandidateDetailModal from '../components/CandidateDetailModal';
import { getCommunes } from '../data/locations';
import {
  apiGetCandidates, apiAddCandidate, apiUpdateCandidate, apiDeleteCandidate,
} from '../utils/api';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    number: '', name: '', gender: '', dob: '', education: '',
    address: '', commune: '', party_role: '', gov_role: '', nec_id: '', photo: '',
  });

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

  useEffect(() => { loadCandidates(); }, []);

  const resetForm = () => {
    setForm({
      number: '', name: '', gender: '', dob: '', education: '',
      address: '', commune: '', party_role: '', gov_role: '', nec_id: '', photo: '',
    });
    setPhotoPreview('');
    setEditingId(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.number) newErrors.number = 'សូមបំពេញលេខរៀង!';
    else if (isNaN(form.number) || parseInt(form.number) <= 0) newErrors.number = 'លេខរៀងត្រូវតែជាលេខវិជ្ជមាន!';
    else {
      const duplicate = candidates.find((c) => parseInt(c.number) === parseInt(form.number) && c.id !== editingId);
      if (duplicate) newErrors.number = 'លេខរៀងនេះមានរួចហើយ!';
    }

    if (!form.name || form.name.trim().length < 2) newErrors.name = 'ឈ្មោះត្រូវតែមានយ៉ាងហោចណាស់ ២ តួអក្សរ!';
    if (!form.gender) newErrors.gender = 'សូមជ្រើសរើសភេទ!';
    if (!form.commune) newErrors.commune = 'សូមជ្រើសរើសឃុំ!';

    if (form.dob) {
      const dob = new Date(form.dob);
      const today = new Date();
      if (dob >= today) newErrors.dob = 'ថ្ងៃខែឆ្នាំកំណើតត្រូវតែជាកាលបរិច្ឆេទអតីតកាល!';
      else {
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 18) newErrors.dob = 'បេក្ខជនត្រូវតែមានអាយុយ៉ាងហោចណាស់ ១៨ ឆ្នាំ!';
      }
    }

    if (!form.nec_id) newErrors.nec_id = 'សូមបំពេញអត្តលេខ គជប!';
    else if (!/^\d{6,}$/.test(form.nec_id)) newErrors.nec_id = 'អត្តលេខ គជប ត្រូវតែជាលេខយ៉ាងហោចណាស់ ៦ ខ្ទង់!';
    else {
      const duplicate = candidates.find((c) => c.nec_id === form.nec_id && c.id !== editingId);
      if (duplicate) newErrors.nec_id = 'អត្តលេខ គជប នេះមានរួចហើយ!';
    }

    if (form.photo && !form.photo.startsWith('data:image/')) newErrors.photo = 'រូបថតត្រូវតែជាឯកសាររូបភាព!';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) { setErrors({ ...errors, photo: 'សូមជ្រើសរើសឯកសាររូបភាពតែប៉ុណ្ណោះ!' }); return; }
      if (file.size > 5 * 1024 * 1024) { setErrors({ ...errors, photo: 'រូបថតត្រូវតែតូចជាង 5MB!' }); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, photo: reader.result });
        setPhotoPreview(reader.result);
        setErrors({ ...errors, photo: null });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) { alert('សូមពិនិត្យទិន្នន័យដែលបានបំពេញ!'); return; }
    try {
      setSubmitting(true);
      if (editingId) await apiUpdateCandidate(editingId, form);
      else await apiAddCandidate(form);
      await loadCandidates();
      resetForm();
      alert('✅ រក្សាទុកដោយជោគជ័យ!');
    } catch (error) {
      alert('មានបញ្ហា: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (candidate) => {
    setForm({
      number: candidate.number || '', name: candidate.name || '', gender: candidate.gender || '',
      dob: candidate.dob ? candidate.dob.split('T')[0] : '', education: candidate.education || '',
      address: candidate.address || '', commune: candidate.commune || '',
      party_role: candidate.party_role || '', gov_role: candidate.gov_role || '',
      nec_id: candidate.nec_id || '', photo: candidate.photo || '',
    });
    setPhotoPreview(candidate.photo || '');
    setEditingId(candidate.id);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('តើអ្នកប្រាកដជាចង់លុបបេក្ខជននេះឬ?')) {
      try { await apiDeleteCandidate(id); await loadCandidates(); }
      catch (error) { alert('មានបញ្ហា: ' + error.message); }
    }
  };

  const handleExportPDF = async () => {
    if (candidates.length === 0) { alert('មិនមានទិន្នន័យសម្រាប់ Export ទេ!'); return; }
    await exportCandidatesToPDF();
  };

  const handleViewDetail = (candidate) => { setSelectedCandidate(candidate); setShowModal(true); };
  const handleCloseModal = () => { setShowModal(false); setSelectedCandidate(null); };

  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return (<p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FaExclamationTriangle /> {error}</p>);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-xl md:text-2xl font-bold">គ្រប់គ្រងបេក្ខជន</h1>
        <button onClick={handleExportPDF} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition text-sm">
          <FaFilePdf /> ទាញយក PDF
        </button>
      </div>

      {/* Form */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-6">
        <h2 className="text-base md:text-lg font-semibold mb-4">
          {editingId ? '✏️ កែប្រែព័ត៌មានបេក្ខជន' : '➕ បន្ថែមបេក្ខជនថ្មី'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">លេខរៀង <span className="text-red-500">*</span></label>
            <input type="number" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 ${errors.number ? 'border-red-500 focus:ring-red-300' : 'focus:ring-primary'}`} />
            <ErrorMessage error={errors.number} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">ឈ្មោះ <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-300' : 'focus:ring-primary'}`} />
            <ErrorMessage error={errors.name} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">ភេទ <span className="text-red-500">*</span></label>
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 ${errors.gender ? 'border-red-500 focus:ring-red-300' : 'focus:ring-primary'}`}>
              <option value="">-- ជ្រើសរើស --</option>
              <option value="ប្រុស">ប្រុស</option>
              <option value="ស្រី">ស្រី</option>
            </select>
            <ErrorMessage error={errors.gender} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">ថ្ងៃខែឆ្នាំកំណើត</label>
            <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 ${errors.dob ? 'border-red-500 focus:ring-red-300' : 'focus:ring-primary'}`} />
            <ErrorMessage error={errors.dob} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">កំរិតវប្បធម៌</label>
            <input type="text" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} placeholder="ឧ. បរិញ្ញាបត្រ" className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">ទីលំនៅបច្ចុប្បន្ន</label>
            <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="ឧ. ភូមិ... ឃុំ..." className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">ឃុំ <span className="text-red-500">*</span></label>
            <select value={form.commune} onChange={(e) => setForm({ ...form, commune: e.target.value })} className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 ${errors.commune ? 'border-red-500 focus:ring-red-300' : 'focus:ring-primary'}`}>
              <option value="">-- ជ្រើសរើសឃុំ --</option>
              {getCommunes().map((c) => (<option key={c} value={c}>ឃុំ{c}</option>))}
            </select>
            <ErrorMessage error={errors.commune} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">តួនាទីក្នុងបក្ស</label>
            <input type="text" value={form.party_role} onChange={(e) => setForm({ ...form, party_role: e.target.value })} placeholder="ឧ. សមាជិក..." className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">តួនាទីក្នុងរដ្ឋ</label>
            <input type="text" value={form.gov_role} onChange={(e) => setForm({ ...form, gov_role: e.target.value })} placeholder="ឧ. មន្ត្រី..." className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">អត្តលេខ គជប <span className="text-red-500">*</span></label>
            <input type="text" value={form.nec_id} onChange={(e) => setForm({ ...form, nec_id: e.target.value })} className={`w-full border p-2 rounded-lg focus:outline-none focus:ring-2 ${errors.nec_id ? 'border-red-500 focus:ring-red-300' : 'focus:ring-primary'}`} />
            <ErrorMessage error={errors.nec_id} />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-sm font-semibold mb-1">រូបថត</label>
            <div className="flex flex-wrap items-center gap-4">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg px-4 py-3 flex items-center gap-2">
                <FaCamera className="text-gray-600" />
                <span className="text-sm text-gray-600">ជ្រើសរើសរូបថត</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
              {photoPreview && (<img src={photoPreview} alt="Preview" className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border shadow" />)}
            </div>
            <ErrorMessage error={errors.photo} />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          {editingId ? (
            <>
              <button onClick={handleSubmit} disabled={submitting} className={`rounded-lg px-6 py-2 flex items-center justify-center gap-2 transition ${submitting ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                <FaSave /> {submitting ? 'កំពុងរក្សាទុក...' : 'រក្សាទុក'}
              </button>
              <button onClick={resetForm} className="bg-gray-500 text-white rounded-lg px-6 py-2 flex items-center justify-center gap-2 hover:bg-gray-600 transition">
                <FaTimes /> បោះបង់
              </button>
            </>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className={`rounded-lg px-6 py-2 flex items-center justify-center gap-2 transition ${submitting ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-primary hover:bg-blue-700 text-white'}`}>
              <FaPlus /> {submitting ? 'កំពុងរក្សាទុក...' : 'បន្ថែមបេក្ខជន'}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <h3 className="p-4 bg-gray-100 font-semibold">គ្រប់គ្រងបេក្ខជន</h3>
        <table className="w-full text-left min-w-[1100px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-sm">រូបថត</th>
              <th className="p-3 text-sm">លេខរៀង</th>
              <th className="p-3 text-sm">ឈ្មោះ</th>
              <th className="p-3 text-sm">ភេទ</th>
              <th className="p-3 text-sm">ថ្ងៃខែឆ្នាំកំណើត</th>
              <th className="p-3 text-sm">កំរិតវប្បធម៌</th>
              <th className="p-3 text-sm">ទីលំនៅ</th>
              <th className="p-3 text-sm">ឃុំ</th>
              <th className="p-3 text-sm">តួនាទីក្នុងបក្ស</th>
              <th className="p-3 text-sm">តួនាទីក្នុងរដ្ឋ</th>
              <th className="p-3 text-sm">អត្តលេខ គជប</th>
              <th className="p-3 text-sm text-center">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="12" className="p-6 text-center text-gray-500">កំពុងទាញទិន្នន័យ...</td></tr>
            ) : candidates.length === 0 ? (
              <tr><td colSpan="12" className="p-6 text-center text-gray-500">មិនទាន់មានបេក្ខជនទេ។</td></tr>
            ) : (
              candidates.map((c) => (
                <tr key={c.id} className={`border-b hover:bg-gray-50 transition ${editingId === c.id ? 'bg-yellow-50' : ''}`}>
                  <td className="p-3">{c.photo ? <img src={c.photo} alt={c.name} className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full border" /> : <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xs">គ្មាន</div>}</td>
                  <td className="p-3 font-semibold text-sm">{c.number}</td>
                  <td className="p-3 text-sm">{c.name}</td>
                  <td className="p-3 text-sm">{c.gender}</td>
                  <td className="p-3 text-sm">{c.dob ? new Date(c.dob).toLocaleDateString('km-KH') : '-'}</td>
                  <td className="p-3 text-sm">{c.education || '-'}</td>
                  <td className="p-3 text-sm">{c.address || '-'}</td>
                  <td className="p-3 text-sm">{c.commune || '-'}</td>
                  <td className="p-3 text-sm">{c.party_role || '-'}</td>
                  <td className="p-3 text-sm">{c.gov_role || '-'}</td>
                  <td className="p-3 text-sm">{c.nec_id || '-'}</td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2 md:gap-3">
                      <button onClick={() => handleViewDetail(c)} className="text-green-500 hover:text-green-700 transition" title="មើលលម្អិត"><FaEye size={16} /></button>
                      <button onClick={() => handleEdit(c)} className="text-blue-500 hover:text-blue-700 transition" title="កែប្រែ"><FaEdit size={16} /></button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 transition" title="លុប"><FaTrash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (<CandidateDetailModal candidate={selectedCandidate} onClose={handleCloseModal} />)}
    </div>
  );
};

export default Candidates;