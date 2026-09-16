import React from 'react';
import { FaUserCircle, FaSignOutAlt, FaBars } from 'react-icons/fa';

const Navbar = ({ user, onLogout, onMenuClick }) => {
  const handleLogout = () => {
    if (window.confirm('តើអ្នកប្រាកដជាចង់ចាកចេញឬ?')) {
      onLogout();
    }
  };

  return (
    <nav className="bg-primary text-white px-4 md:px-6 py-3 md:py-4 flex justify-between items-center shadow-md no-print sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-2xl focus:outline-none"
        >
          <FaBars />
        </button>
        <h1 className="text-sm md:text-xl font-bold leading-tight">
          ប្រព័ន្ធគ្រប់គ្រងការបោះឆ្នោតឃុំ
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-xl md:text-2xl" />
          <div className="text-xs md:text-sm hidden sm:block">
            <p className="font-semibold">{user?.full_name || 'អ្នកប្រើ'}</p>
            <p className="opacity-80">
              {user?.role === 'admin' ? 'អ្នកគ្រប់គ្រង' : 'អ្នកសង្កេតការណ៍'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 p-2 md:px-3 md:py-2 rounded-lg flex items-center gap-2 transition text-sm"
          title="ចាកចេញ"
        >
          <FaSignOutAlt /> <span className="hidden md:inline">ចាកចេញ</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;