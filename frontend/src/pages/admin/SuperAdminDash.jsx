// src/pages/admin/SuperAdminDash.jsx - Enhanced Super Admin Dashboard
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, Building, Users, Settings, Clock, ChevronRight, Award,
  TrendingUp, Activity, Plus, Eye, Edit3, BarChart3, MessageSquare,
  Shield, Database, RefreshCw, AlertCircle, CheckCircle2, UserCheck,
  Globe, FileText, Zap
} from 'lucide-react';
import { api, eventsAPI, membersAPI, contentAPI, branchAPI, adminAPI } from '../../services/api';
import AdminPageWrapper from '../../components/admin/AdminPageWrapper';


const SuperAdminDash = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBranches: 0,
    totalMembers: 0,
    totalUsers: 0,
    totalNews: 0,
    systemActivity: 0,
    loading: true
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentBranches, setRecentBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setDashboardError(null);
      
      const [dashboardStats, eventsResult, branchesResult] = await Promise.all([
        api.getDashboardStats().catch(() => ({ data: { totalEvents: 0, totalBranches: 0, totalMembers: 0, totalUsers: 0, totalNews: 0, systemActivity: 0 } })),
        eventsAPI.getEvents().catch(() => ({ data: [] })),
        branchAPI.getBranches().catch(() => ({ data: [] }))
      ]);
      
      const statsData = dashboardStats.data || {};
      const events = Array.isArray(eventsResult.data) ? eventsResult.data : (eventsResult.data?.data || []);
      const branches = Array.isArray(branchesResult.data) ? branchesResult.data : (branchesResult.data?.data || []);
      
      setStats({
        totalEvents: statsData.totalEvents || events.length,
        totalBranches: statsData.totalBranches || branches.length,
        totalMembers: statsData.totalMembers || 0,
        totalUsers: statsData.totalUsers || 0,
        totalNews: statsData.totalNews || 0,
        systemActivity: statsData.systemActivity || (events.length + branches.length),
        loading: false
      });
      
      setRecentEvents(events.slice(0, 5));
      setRecentBranches(branches.slice(0, 3));
      setLastRefresh(new Date());
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setDashboardError('Failed to load dashboard statistics');
      setStats({
        totalEvents: 0,
        totalBranches: 0,
        totalMembers: 0,
        totalUsers: 0,
        totalNews: 0,
        systemActivity: 0,
        loading: false
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Enhanced stats cards
  const statsCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Student Branches',
      value: stats.totalBranches,
      icon: Building,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: Users,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'System Users',
      value: stats.totalUsers,
      icon: UserCheck,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      title: 'News Articles',
      value: stats.totalNews,
      icon: MessageSquare,
      color: 'bg-pink-50 text-pink-600'
    },
    {
      title: 'System Activity',
      value: stats.systemActivity,
      icon: Activity,
      color: 'bg-indigo-50 text-indigo-600'
    }
  ];

  // Quick actions for super admin
  const quickActions = [
    {
      name: 'Create Branch',
      description: 'Add new student branch',
      icon: Building,
      link: '/admin/branches/new',
      color: 'bg-emerald-600 hover:bg-emerald-700'
    },
    {
      name: 'Add User',
      description: 'Create system user',
      icon: UserCheck,
      link: '/admin/users/new',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'System Settings',
      description: 'Configure system',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-gray-600 hover:bg-gray-700'
    },
    {
      name: 'Analytics',
      description: 'View system analytics',
      icon: BarChart3,
      link: '/admin/analytics',
      color: 'bg-indigo-600 hover:bg-indigo-700'
    }
  ];

  // Super Admin modules
  const superAdminModules = [
    {
      id: 'branches',
      name: 'Branch Management',
      description: 'Manage all student branches',
      icon: Building,
      link: '/admin/branches',
      color: 'bg-emerald-100 text-emerald-600',
      count: stats.totalBranches
    },
    {
      id: 'users',
      name: 'User Management',
      description: 'Manage system users and permissions',
      icon: UserCheck,
      link: '/admin/users',
      color: 'bg-blue-100 text-blue-600',
      count: stats.totalUsers
    },
    {
      id: 'events',
      name: 'Global Events',
      description: 'Oversee all branch events',
      icon: Calendar,
      link: '/admin/events',
      color: 'bg-purple-100 text-purple-600',
      count: stats.totalEvents
    },
    {
      id: 'content',
      name: 'Content Management',
      description: 'Manage global content and news',
      icon: FileText,
      link: '/admin/content',
      color: 'bg-pink-100 text-pink-600',
      count: stats.totalNews
    },
    {
      id: 'awards',
      name: 'Awards & Recognition',
      description: 'Manage awards and achievements',
      icon: Award,
      link: '/admin/awards',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'research',
      name: 'Research Management',
      description: 'Oversee research areas and projects',
      icon: Globe,
      link: '/admin/research',
      color: 'bg-teal-100 text-teal-600'
    },
    {
      id: 'analytics',
      name: 'System Analytics',
      description: 'View comprehensive system metrics',
      icon: BarChart3,
      link: '/admin/analytics',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 'settings',
      name: 'System Settings',
      description: 'Configure global system settings',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-gray-100 text-gray-600'
    }
  ];



  return (
    <AdminPageWrapper
      title="Super Admin Dashboard"
      subtitle={`Welcome back, ${user?.name || 'Administrator'} - System Overview`}
      action={
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            System Online
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            Super Admin
          </div>
          <button
            onClick={fetchDashboardData}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="text-sm text-gray-500">
            Last updated: {formatTime(lastRefresh)}
          </div>
        </div>
      }
    >

      {/* Error Alert */}
      {dashboardError && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <p className="text-sm text-red-700">{dashboardError}</p>
        </div>
      )}

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className={`${action.color} text-white p-4 rounded-lg transition-colors flex items-center space-x-3`}
              >
                <Icon className="w-5 h-5" />
                <div>
                  <p className="font-medium">{action.name}</p>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Recent Events
            </h2>
            <Link to="/admin/events" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="p-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : recentEvents.length === 0 ? (
            <div className="p-6 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500">Events will appear here as branches create them</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentEvents.map((event) => (
                <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <p className="text-sm text-gray-500">{event.location || 'Location TBA'}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/events/${event.id}`}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Event"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Branches */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Building className="w-5 h-5 mr-2 text-emerald-600" />
              Student Branches
            </h2>
            <Link to="/admin/branches" className="text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="p-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
          ) : recentBranches.length === 0 ? (
            <div className="p-6 text-center">
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
              <p className="text-gray-500 mb-4">Create your first student branch</p>
              <Link 
                to="/admin/branches/new"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Branch
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentBranches.map((branch) => (
                <div key={branch.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{branch.name}</h3>
                      <p className="text-sm text-gray-500 mb-1">{branch.location}</p>
                      <div className="flex items-center text-xs text-gray-400">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          branch.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {branch.status || 'Active'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/admin/branches/${branch.id}`}
                        className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                        title="View Branch"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link 
                        to={`/admin/branches/edit/${branch.id}`}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Edit Branch"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Super Admin Modules */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Database className="w-6 h-6 mr-2 text-gray-600" />
          System Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {superAdminModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.id}
                to={module.link}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-blue-200 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`rounded-lg p-3 ${module.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {module.count !== undefined && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {module.count}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{module.name}</h3>
                <p className="text-gray-600 text-sm">{module.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

    </AdminPageWrapper>
  );
};

export default SuperAdminDash;