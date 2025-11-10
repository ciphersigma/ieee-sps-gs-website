// src/pages/admin/SuperAdminDash.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, Building, Users
} from 'lucide-react';
import { api } from '../../services/api';
import AdminPageWrapper from '../../components/admin/AdminPageWrapper';


const SuperAdminDash = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBranches: 0,
    totalMembers: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, members, branchesResponse] = await Promise.all([
          api.getAllEvents(),
          api.getMembers(),
          fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/branches`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('ieee_admin_token')}`
            }
          })
        ]);
        
        const branches = branchesResponse.ok ? await branchesResponse.json() : { data: [] };
        
        setStats({
          totalEvents: events?.length || 0,
          totalBranches: branches.data?.length || 0,
          totalMembers: members?.length || 0,
          loading: false
        });
      } catch (error) {
        setStats({
          totalEvents: 0,
          totalBranches: 0,
          totalMembers: 0,
          loading: false
        });
      }
    };
    
    fetchStats();
  }, []);



  return (
    <AdminPageWrapper
      title="Dashboard Overview"
      subtitle={`Welcome back, ${user?.name || 'Administrator'}`}
      action={
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
            System Online
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>
      }
    >
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Events</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
              <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
                <span className="mr-1">↗</span> Active
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Student Branches</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBranches}</p>
              <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
                <span className="mr-1">↗</span> Growing
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Building className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Members</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalMembers}</p>
              <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
                <span className="mr-1">↗</span> Engaged
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  );
};

export default SuperAdminDash;