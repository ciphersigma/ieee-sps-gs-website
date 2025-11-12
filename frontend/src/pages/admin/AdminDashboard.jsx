// src/pages/admin/AdminDashboard.jsx - Enhanced Branch Admin Dashboard
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, Users, FileText, Settings, Clock, ChevronRight, Award,
  TrendingUp, Activity, Plus, Eye, Edit3, BarChart3, MessageSquare,
  Bell, RefreshCw, AlertCircle, CheckCircle2
} from 'lucide-react';
import { api, eventsAPI, membersAPI, contentAPI } from '../../services/api';
import AdminPageWrapper from '../../components/admin/AdminPageWrapper';

const AdminDashboard = () => {
  const { user, getUserBranch, hasPermission } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalMembers: 0,
    totalNews: 0,
    recentActivity: 0,
    loading: true
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentNews, setRecentNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  const branchId = getUserBranch();

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, [branchId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setDashboardError(null);
      
      const eventFilters = branchId ? { branch: branchId } : {};
      
      const [dashboardStats, eventsResult, newsResult] = await Promise.all([
        api.getDashboardStats(branchId).catch(() => ({ data: { totalEvents: 0, upcomingEvents: 0, totalMembers: 0, totalNews: 0, recentActivity: 0 } })),
        eventsAPI.getEvents(eventFilters).catch(() => ({ data: [] })),
        contentAPI.getNews({ limit: 3 }).catch(() => ({ data: [] }))
      ]);
      
      const statsData = dashboardStats.data || {};
      const events = Array.isArray(eventsResult.data) ? eventsResult.data : (eventsResult.data?.data || []);
      const news = Array.isArray(newsResult.data) ? newsResult.data : (newsResult.data?.data || []);
      
      setStats({
        totalEvents: statsData.totalEvents || events.length,
        upcomingEvents: statsData.upcomingEvents || events.filter(e => new Date(e.event_date) > new Date()).length,
        totalMembers: statsData.totalMembers || 0,
        totalNews: statsData.totalNews || news.length,
        recentActivity: statsData.recentActivity || (events.length + news.length),
        loading: false
      });
      
      setRecentEvents(events.slice(0, 5));
      setRecentNews(news.slice(0, 3));
      setLastRefresh(new Date());
      
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setDashboardError('Failed to load dashboard statistics');
      setStats({
        totalEvents: 0,
        upcomingEvents: 0,
        totalMembers: 0,
        totalNews: 0,
        recentActivity: 0,
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
      title: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: Clock,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      title: 'Branch Members',
      value: stats.totalMembers,
      icon: Users,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Recent Activity',
      value: stats.recentActivity,
      icon: Activity,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  // Quick actions
  const quickActions = [
    {
      name: 'Create Event',
      description: 'Add a new branch event',
      icon: Plus,
      link: '/admin/events/new',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Add Member',
      description: 'Register new member',
      icon: Users,
      link: '/admin/members/new',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'Create News',
      description: 'Publish branch news',
      icon: FileText,
      link: '/admin/content/news/new',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      name: 'View Analytics',
      description: 'Check performance',
      icon: BarChart3,
      link: '/admin/analytics',
      color: 'bg-indigo-600 hover:bg-indigo-700'
    }
  ];

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
      count: stats?.totalNews || 0,
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
    <AdminPageWrapper
      title="Branch Dashboard"
      subtitle={`Welcome back, ${user?.name || user?.email?.split('@')[0] || 'Admin'}`}
      action={
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            System Online
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                  {loading ? (
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  )}

                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-8 w-8" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-600" />
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
              <p className="text-gray-500 mb-4">Create your first branch event</p>
              <Link 
                to="/admin/events/new"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Event
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentEvents.map((event) => (
                <div key={event._id} className="p-4 hover:bg-gray-50 transition-colors">
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
                        to={`/events/${event._id}`}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Event"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link 
                        to={`/admin/events/edit/${event._id}`}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Edit Event"
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

        {/* Recent News */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
              Recent News
            </h2>
            <Link to="/admin/content/news" className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="p-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : recentNews.length === 0 ? (
            <div className="p-6 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No news articles</h3>
              <p className="text-gray-500 mb-4">Share your branch updates</p>
              <Link 
                to="/admin/content/news/new"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create News
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentNews.map((news) => (
                <div key={news._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{news.title}</h3>
                      <p className="text-sm text-gray-500 mb-1 line-clamp-2">{news.excerpt || news.content?.substring(0, 100) + '...'}</p>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatDate(news.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link 
                        to={`/news/${news._id}`}
                        className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                        title="View News"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link 
                        to={`/admin/content/news/edit/${news._id}`}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Edit News"
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

      {/* Admin Modules */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-gray-600" />
          Branch Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {availableModules.map((module) => {
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

export default AdminDashboard;