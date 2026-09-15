import React from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ user, onLogout }) => {
  const handleLogout = () => {
    if (window.confirm('តើអ្នកប្រាកដជាចង់ចាកចេញឬ?')) {
      onLogout();
    }
  };

  return (
    <nav className="bg-primary text-white px-6 py-4 flex justify-between items-center shadow-md no-print">
      <h1 className="text-xl font-bold">ប្រព័ន្ធគ្រប់គ្រងការបោះឆ្នោតឃុំ</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-2xl" />
          <div className="text-sm">
            <p className="font-semibold">{user?.full_name || 'អ្នកប្រើ'}</p>
            <p className="text-xs opacity-80">
              {user?.role === 'admin' ? 'អ្នកគ្រប់គ្រង' : 'អ្នកសង្កេតការណ៍'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg flex items-center gap-2 transition text-sm"
        >
          <FaSignOutAlt /> ចាកចេញ
        </button>
      </div>
    </nav>
  );
};

export default Navbar;