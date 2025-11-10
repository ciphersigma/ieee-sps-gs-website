import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminSidebar from '../admin/AdminSidebar';

const AdminDashboardLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar user={user} />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {children}
      </div>
    </div>
  );
};

export default AdminDashboardLayout;