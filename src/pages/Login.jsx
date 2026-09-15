import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt, FaExclamationTriangle } from 'react-icons/fa';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('សូមបំពេញឈ្មោះអ្នកប្រើ និងលេខសម្ងាត់!');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login បរាជ័យ');
      }

      // រក្សាទុក Token និង User
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // ហៅ onLogin callback
      onLogin(data.user);

      // ទៅ Dashboard
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-500 to-blue-800 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-primary text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">ចូលប្រើប្រាស់</h1>
          <p className="text-gray-500 text-sm mt-1">
            ប្រព័ន្ធគ្រប់គ្រងការបោះឆ្នោតក្រុមប្រឹក្សាឃុំ
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
            <FaExclamationTriangle />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-semibold text-sm">
              ឈ្មោះអ្នកប្រើ
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ឧ. admin"
                className="w-full border-2 p-3 pl-10 rounded-lg focus:outline-none focus:border-primary"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-semibold text-sm">
              លេខសម្ងាត់
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border-2 p-3 pl-10 rounded-lg focus:outline-none focus:border-primary"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-blue-700'
            }`}
          >
            <FaSignInAlt />
            {loading ? 'កំពុងចូល...' : 'ចូលប្រើ'}
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 text-center">
            <strong>គណនីសាកល្បង៖</strong>
            <br />
            Admin: <code className="bg-white px-1">admin</code> / <code className="bg-white px-1">admin123</code>
            <br />
            Observer: <code className="bg-white px-1">observer</code> / <code className="bg-white px-1">observer123</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;