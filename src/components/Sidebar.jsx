import React from 'react';
import { FaIdCard } from 'react-icons/fa'; // ឬ Icon ផ្សេង
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt, FaUsers, FaVoteYea, FaChartBar,
  FaUserTie, FaPrint, FaTimes,
} from 'react-icons/fa';

const menuItems = [
  { path: '/', label: 'ផ្ទាំងគ្រប់គ្រង', icon: <FaTachometerAlt /> },
  { path: '/candidates', label: 'បេក្ខជន', icon: <FaUserTie /> },
  { path: '/candidate-profiles', label: 'ទម្រង់បេក្ខជន', icon: <FaIdCard /> }, // ⬅️ បន្ថែមថ្មី
  { path: '/voters', label: 'អ្នកបោះឆ្នោត', icon: <FaUsers /> },
  { path: '/voting', label: 'បោះឆ្នោត', icon: <FaVoteYea /> },
  { path: '/results', label: 'លទ្ធផល', icon: <FaChartBar /> },
  { path: '/print-ballot', label: 'បោះពុម្ពសន្លឹកឆ្នោត', icon: <FaPrint /> },
];

const Sidebar = ({ user, isOpen, onClose }) => {
  const location = useLocation();

  const filteredMenuItems = menuItems.filter((item) => {
    if (user?.role === 'observer') {
      return !['/candidates', '/voters'].includes(item.path);
    }
    return true;
  });

  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white shadow-lg p-4
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        no-print flex flex-col h-full
      `}
    >
      <div className="flex justify-between items-center mb-4 md:hidden">
        <h2 className="text-lg font-bold text-primary">ម៉ឺនុយ</h2>
        <button onClick={onClose} className="text-gray-500 text-2xl focus:outline-none">
          <FaTimes />
        </button>
      </div>

      <ul className="space-y-2 flex-1 overflow-y-auto">
        {filteredMenuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                location.pathname === item.path
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;