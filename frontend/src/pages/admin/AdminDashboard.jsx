// src/pages/admin/AdminDashboard.jsx - Student Branch Admin Dashboard
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, Users, FileText, Settings, 
  Clock, ChevronRight, MapPin, Award, Bell
} from 'lucide-react';
import { db } from '../../services/database';

const AdminDashboard = () => {
  const { user, isStudentBranchAdmin, getUserBranch, hasPermission } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalMembers: 0,
    loading: true
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  
  const branchId = getUserBranch();
  const isBranchAdmin = isStudentBranchAdmin();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const eventFilters = isBranchAdmin && branchId ? { branch: branchId } : {};
        
        const [totalEventsResult, upcomingEventsResult, recentEventsResult] = await Promise.all([
          db.count('events'),
          db.getEvents({ upcoming: true, status: 'upcoming', ...eventFilters }),
          db.getEvents({ limit: 5, ...eventFilters })
        ]);
        
        setStats({
          totalEvents: totalEventsResult?.data || 0,
          upcomingEvents: upcomingEventsResult?.count || 0,
          totalMembers: isBranchAdmin ? 45 : 0,
          loading: false
        });
        
        setRecentEvents(recentEventsResult?.data || []);
        
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setDashboardError('Failed to load dashboard statistics');
        setStats({
          totalEvents: 0,
          upcomingEvents: 0,
          totalMembers: 0,
          loading: false
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [isBranchAdmin, branchId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Branch Admin modules
  const branchAdminModules = [
    {
      id: 'events',
      name: 'Branch Events',
      description: 'Manage events for your student branch',
      icon: Calendar,
      link: '/admin/events',
      color: 'bg-blue-100 text-blue-600',
      count: stats?.totalEvents || 0,
      permission: 'events'
    },
    {
      id: 'members',
      name: 'Branch Members',
      description: 'Manage your branch members and committee',
      icon: Users,
      link: '/admin/members',
      color: 'bg-green-100 text-green-600',
      count: stats?.totalMembers || 0,
      permission: 'members'
    },
    {
      id: 'content',
      name: 'Branch Content',
      description: 'Create and manage branch-specific content',
      icon: FileText,
      link: '/admin/content/news',
      color: 'bg-purple-100 text-purple-600',
      permission: 'content'
    },
    {
      id: 'achievements',
      name: 'Achievements',
      description: 'Showcase branch achievements and awards',
      icon: Award,
      link: '/admin/achievements',
      color: 'bg-yellow-100 text-yellow-600',
      permission: 'content'
    },
    {
      id: 'settings',
      name: 'Branch Settings',
      description: 'Configure branch-specific settings',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-gray-100 text-gray-600',
      permission: 'settings'
    }
  ];
  
  const availableModules = branchAdminModules.filter(module => 
    !module.permission || hasPermission(module.permission)
  );

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <MapPin className="mr-3 text-blue-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Branch Admin Dashboard</h1>
            <p className="text-gray-600">{user?.organization || 'Student Branch'}</p>
            <p className="text-sm text-gray-500">Welcome back, {user?.name || user?.email?.split('@')[0] || 'Admin'}</p>
          </div>
        </div>
        {isBranchAdmin && (
          <div className="flex items-center">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Branch Administrator
            </span>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {dashboardError && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-sm text-red-700">{dashboardError}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Branch Events</p>
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Branch Members</p>
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Achievements</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Recent Branch Events
          </h2>
          <Link to="/admin/events" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        {loading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="p-6 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No branch events found</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first branch event</p>
            <Link 
              to="/admin/events/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add New Event
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentEvents.map((event) => (
              <div key={event.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{event.location || 'Location TBA'}</p>
                  </div>
                  <Link 
                    to={`/admin/events/edit/${event.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Modules */}
      <h2 className="text-xl font-bold mb-6">Branch Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {availableModules.map((module) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.id}
              to={module.link}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`rounded-lg p-3 ${module.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                {module.count !== undefined && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {module.count}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2">{module.name}</h3>
              <p className="text-gray-600 text-sm">{module.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Branch Info */}
      {isBranchAdmin && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <div className="flex">
            <Bell className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Branch Administrator Access</h3>
              <p className="text-sm text-blue-700 mt-1">
                You have administrative access for <strong>{user?.organization}</strong>. 
                You can manage events, members, and content specific to your branch.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;