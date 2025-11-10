// src/components/layout/AdminLayout.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminHeader from '../admin/AdminHeader';
import AdminSidebar from '../admin/AdminSidebar';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="h-screen bg-gray-50">
      <AdminHeader user={user} onLogout={logout} />
      <div className="flex h-full pt-16">
        <AdminSidebar user={user} />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;