import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Voters from './pages/Voters';
import Voting from './pages/Voting';
import Results from './pages/Results';
import PrintBallot from './pages/PrintBallot';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import CandidateProfiles from './pages/CandidateProfiles';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-gray-500 text-lg">កំពុងផ្ទុក...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar
          user={user}
          onLogout={handleLogout}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="flex flex-1 relative">
          {/* Sidebar - Responsive */}
          <Sidebar
            user={user}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Overlay សម្រាប់ទូរស័ព្ទ */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          {/* Main Content */}
          <main className="flex-1 w-full overflow-x-hidden">
            <Routes>
              <Route path="/" element={<ProtectedRoute user={user} allowedRoles={['admin', 'observer']}><Dashboard /></ProtectedRoute>} />
              <Route path="/candidates" element={<ProtectedRoute user={user} allowedRoles={['admin', 'observer']}><Candidates /></ProtectedRoute>} />
              <Route path="/voters" element={<ProtectedRoute user={user} allowedRoles={['admin', 'observer']}><Voters /></ProtectedRoute>} />
              <Route path="/voting" element={<ProtectedRoute user={user} allowedRoles={['admin', 'observer']}><Voting /></ProtectedRoute>} />
              <Route path="/results" element={<ProtectedRoute user={user} allowedRoles={['admin', 'observer']}><Results /></ProtectedRoute>} />
              <Route path="/print-ballot" element={<ProtectedRoute user={user} allowedRoles={['admin', 'observer']}><PrintBallot /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/candidate-profiles" element={<ProtectedRoute user={user} allowedRoles={['admin', 'observer']}><CandidateProfiles /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;