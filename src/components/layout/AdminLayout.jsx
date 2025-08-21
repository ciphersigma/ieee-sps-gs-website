// src/components/layout/AdminLayout.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminHeader from '../admin/AdminHeader';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader user={user} onLogout={logout} />
      <div className="pt-32 pb-12">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;