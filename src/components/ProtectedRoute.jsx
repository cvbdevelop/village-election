import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user, allowedRoles }) => {
  // ប្រសិនបើមិនទាន់ Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ប្រសិនបើមានកំណត់សិទ្ធិ
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">⛔ គ្មានសិទ្ធិចូលប្រើ</h2>
          <p>អ្នកគ្មានសិទ្ធិចូលប្រើទំព័រនេះទេ។</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;