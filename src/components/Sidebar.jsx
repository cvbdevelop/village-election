import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaVoteYea,
  FaChartBar,
  FaUserTie,
  FaPrint,
} from 'react-icons/fa';

const menuItems = [
  { path: '/', label: 'ផ្ទាំងគ្រប់គ្រង', icon: <FaTachometerAlt /> },
  { path: '/candidates', label: 'បេក្ខជន', icon: <FaUserTie /> },
  { path: '/voters', label: 'អ្នកបោះឆ្នោត', icon: <FaUsers /> },
  { path: '/voting', label: 'បោះឆ្នោត', icon: <FaVoteYea /> },
  { path: '/results', label: 'លទ្ធផល', icon: <FaChartBar /> },
  { path: '/print-ballot', label: 'បោះពុម្ពសន្លឹកឆ្នោត', icon: <FaPrint /> },
];

const Sidebar = ({ user }) => {
  const location = useLocation();

  // ប្រសិនបើជា Observer → លាក់ម៉ឺនុយមួយចំនួន
  const filteredMenuItems = menuItems.filter((item) => {
    if (user?.role === 'observer') {
      // Observer មិនអាចចូល "គ្រប់គ្រងបេក្ខជន", "គ្រប់គ្រងអ្នកបោះឆ្នោត"
      return !['/candidates', '/voters'].includes(item.path);
    }
    return true;
  });

  return (
    <aside className="w-64 bg-white h-screen shadow-lg p-4 no-print">
      <ul className="space-y-2">
        {filteredMenuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
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