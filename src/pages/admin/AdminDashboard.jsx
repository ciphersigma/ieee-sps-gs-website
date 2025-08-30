// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, Users, LogOut, Plus, FileText, Settings, 
  BarChart2, TrendingUp, Image, MessageSquare, Activity,
  CheckCircle, AlertCircle, Clock
} from 'lucide-react';
import { supabase, TABLES } from '../../services/supabase';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    events: { count: 0, loading: true },
    members: { count: 0, loading: true },
    gallery: { count: 0, loading: true },
    messages: { count: 0, loading: true }
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loadingRecentEvents, setLoadingRecentEvents] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Events count
        const { count: eventsCount, error: eventsError } = await supabase
          .from(TABLES.EVENTS)
          .select('*', { count: 'exact', head: true });
        
        if (eventsError) throw eventsError;
        
        // Members count
        const { count: membersCount, error: membersError } = await supabase
          .from(TABLES.MEMBERS)
          .select('*', { count: 'exact', head: true });
        
        if (membersError) throw membersError;
        
        // Gallery count
        const { count: galleryCount, error: galleryError } = await supabase
          .from(TABLES.GALLERY)
          .select('*', { count: 'exact', head: true });
        
        if (galleryError) throw galleryError;
        
        // Contact messages count
        const { count: messagesCount, error: messagesError } = await supabase
          .from(TABLES.CONTACT_MESSAGES)
          .select('*', { count: 'exact', head: true });
        
        if (messagesError) throw messagesError;
        
        // Update stats
        setStats({
          events: { count: eventsCount || 0, loading: false },
          members: { count: membersCount || 0, loading: false },
          gallery: { count: galleryCount || 0, loading: false },
          messages: { count: messagesCount || 0, loading: false }
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setDashboardError('Failed to load dashboard statistics');
      }
    };
    
    const fetchRecentEvents = async () => {
      try {
        setLoadingRecentEvents(true);
        
        const { data, error } = await supabase
          .from(TABLES.EVENTS)
          .select('*')
          .order('event_date', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        
        setRecentEvents(data || []);
        setLoadingRecentEvents(false);
      } catch (error) {
        console.error('Error fetching recent events:', error);
        setLoadingRecentEvents(false);
      }
    };
    
    fetchDashboardData();
    fetchRecentEvents();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Admin modules
  const adminModules = [
    {
      id: 'events',
      name: 'Events Management',
      description: 'Add, edit, or delete events and manage registrations',
      icon: Calendar,
      link: '/admin/events',
      color: 'bg-blue-100 text-blue-600',
      count: stats.events.count
    },
    {
      id: 'members',
      name: 'Members Directory',
      description: 'Manage chapter members and executive committee',
      icon: Users,
      link: '/admin/members',
      color: 'bg-green-100 text-green-600',
      count: stats.members.count
    },
    {
      id: 'carousel',
      name: 'Carousel Management',
      description: 'Manage homepage carousel images and slideshow',
      icon: Image,
      link: '/admin/carousel',
      color: 'bg-amber-100 text-amber-600',
      count: stats.gallery.count
    },
    {
      id: 'content',
      name: 'Content Management',
      description: 'Update website content, blog posts, and resources',
      icon: FileText,
      link: '/admin/content/news',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'settings',
      name: 'Site Settings',
      description: 'Configure general website settings and SEO',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-gray-100 text-gray-600',
    },
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.email}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Website
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
        
        {/* Error Alert */}
        {dashboardError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{dashboardError}</p>
            </div>
          </div>
        )}
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Events Stat */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
            <div className="rounded-full p-3 bg-blue-100 mr-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Events</p>
              {stats.events.loading ? (
                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats.events.count}</p>
              )}
            </div>
          </div>
          
          {/* Members Stat */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
            <div className="rounded-full p-3 bg-green-100 mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Members</p>
              {stats.members.loading ? (
                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats.members.count}</p>
              )}
            </div>
          </div>
          
          {/* Gallery Stat */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
            <div className="rounded-full p-3 bg-amber-100 mr-4">
              <Image className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Gallery Images</p>
              {stats.gallery.loading ? (
                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats.gallery.count}</p>
              )}
            </div>
          </div>
          
          {/* Messages Stat */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
            <div className="rounded-full p-3 bg-purple-100 mr-4">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Messages</p>
              {stats.messages.loading ? (
                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stats.messages.count}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Dashboard Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Events */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">Recent Events</h2>
              <Link to="/admin/events" className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </Link>
            </div>
            
            {loadingRecentEvents ? (
              <div className="p-6">
                <div className="flex justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              </div>
            ) : recentEvents.length === 0 ? (
              <div className="p-6 text-center">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-900">No events found</h3>
                <p className="text-gray-500 mt-1">Get started by creating your first event</p>
                <div className="mt-4">
                  <Link 
                    to="/admin/events/new"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add New Event</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentEvents.map((event) => (
                  <div key={event.id} className="p-4 hover:bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatDate(event.event_date)}</span>
                          <span className="mx-2">•</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <Link 
                          to={`/admin/events/edit/${event.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit Event
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Link 
                  to="/admin/events/new" 
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="rounded-full p-2 bg-blue-100 mr-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">Add New Event</span>
                </Link>
                
                <Link 
                  to="/admin/carousel" 
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="rounded-full p-2 bg-amber-100 mr-3">
                    <Image className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="font-medium text-gray-700">Manage Carousel</span>
                </Link>
                
                <Link 
                  to="/admin/content/news/new" 
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="rounded-full p-2 bg-purple-100 mr-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-700">Add News Item</span>
                </Link>
                
                <Link 
                  to="/admin/settings" 
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="rounded-full p-2 bg-gray-100 mr-3">
                    <Settings className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-700">Site Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Admin Modules */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {adminModules.map((module) => (
            <Link
              key={module.id}
              to={module.link}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${module.color} inline-block`}>
                  <module.icon size={24} />
                </div>
                {module.count !== undefined && (
                  <div className="ml-auto bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-600">
                    {module.count}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">{module.name}</h3>
              <p className="text-gray-600 text-sm">{module.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;