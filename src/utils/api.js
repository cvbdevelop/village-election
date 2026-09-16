// src/utils/api.js
// src/utils/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// មុខងារជំនួយសម្រាប់ធ្វើ Request
const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'API Error');
    }
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============ CANDIDATES ============
export const apiGetCandidates = () => request('/candidates');
export const apiAddCandidate = (candidate) =>
  request('/candidates', {
    method: 'POST',
    body: JSON.stringify(candidate),
  });
export const apiUpdateCandidate = (id, candidate) =>
  request(`/candidates/${id}`, {
    method: 'PUT',
    body: JSON.stringify(candidate),
  });
export const apiDeleteCandidate = (id) =>
  request(`/candidates/${id}`, { method: 'DELETE' });

// ============ VOTERS ============
export const apiGetVoters = () => request('/voters');
export const apiAddVoter = (voter) =>
  request('/voters', {
    method: 'POST',
    body: JSON.stringify(voter),
  });
export const apiUpdateVoter = (id, voter) =>
  request(`/voters/${id}`, {
    method: 'PUT',
    body: JSON.stringify(voter),
  });
export const apiDeleteVoter = (id) =>
  request(`/voters/${id}`, { method: 'DELETE' });
export const apiVerifyVoter = (idCard) =>
  request('/voters/verify', {
    method: 'POST',
    body: JSON.stringify({ idCard }),
  });

// ============ VOTES ============
export const apiVote = (candidateId, voterId) =>
  request('/votes', {
    method: 'POST',
    body: JSON.stringify({ candidateId, voterId }),
  });
export const apiGetResults = () => request('/votes/results');

// ============ STATS ============
export const apiGetStats = () => request('/stats');
export const apiGetTimeline = () => request('/stats/timeline');
export const apiGetAdvancedStats = () => request('/stats/advanced'); // ⬅️ បន្ថែមថ្មី