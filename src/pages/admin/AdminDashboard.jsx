// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, Users, FileText, Settings, Image,
  BarChart2, MessageSquare, Activity, Clock, ChevronRight
} from 'lucide-react';
import { supabase, TABLES } from '../../services/supabase';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    events: { count: 0, loading: true },
    members: { count: 0, loading: true },
    gallery: { count: 0, loading: true },
    messages: { count: 0, loading: true }
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loadingRecentEvents, setLoadingRecentEvents] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);

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
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Admin Header - Mobile Friendly */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome, {user?.email?.split('@')[0] || 'Admin'}
            </p>
          </div>
          
          <div>
            <Link 
              to="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0077B5] hover:bg-[#00588a]"
            >
              View Website
            </Link>
          </div>
        </div>
        
        {/* Error Alert */}
        {dashboardError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{dashboardError}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Quick Stats - Mobile Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Events Stat */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <div className="rounded-full p-2 bg-blue-100 mr-3">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-500">Events</p>
            </div>
            {stats.events.loading ? (
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-xl font-bold text-gray-900">{stats.events.count}</p>
            )}
          </div>
          
          {/* Members Stat */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <div className="rounded-full p-2 bg-green-100 mr-3">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-500">Members</p>
            </div>
            {stats.members.loading ? (
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-xl font-bold text-gray-900">{stats.members.count}</p>
            )}
          </div>
          
          {/* Gallery Stat */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <div className="rounded-full p-2 bg-amber-100 mr-3">
                <Image className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-sm font-medium text-gray-500">Images</p>
            </div>
            {stats.gallery.loading ? (
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-xl font-bold text-gray-900">{stats.gallery.count}</p>
            )}
          </div>
          
          {/* Messages Stat */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <div className="rounded-full p-2 bg-purple-100 mr-3">
                <MessageSquare className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-500">Messages</p>
            </div>
            {stats.messages.loading ? (
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-xl font-bold text-gray-900">{stats.messages.count}</p>
            )}
          </div>
        </div>
        
        {/* Dashboard Content - Mobile First Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Recent Events */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-900">Recent Events</h2>
              <Link to="/admin/events" className="text-xs text-[#0077B5] hover:text-[#00588a]">
                View All
              </Link>
            </div>
            
            {loadingRecentEvents ? (
              <div className="p-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0077B5]"></div>
              </div>
            ) : recentEvents.length === 0 ? (
              <div className="p-4 text-center">
                <Calendar className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <h3 className="text-base font-medium text-gray-900">No events found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first event
                </p>
                <div className="mt-3">
                  <Link 
                    to="/admin/events/new"
                    className="inline-flex items-center px-3 py-1.5 text-sm bg-[#0077B5] text-white rounded"
                  >
                    Add New Event
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentEvents.map((event) => (
                  <div key={event.id} className="p-4 hover:bg-gray-50">
                    <div className="flex flex-col space-y-1">
                      <h3 className="font-medium text-gray-900 line-clamp-1">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 line-clamp-1">
                        <span className="flex-1 truncate">{event.location || 'Location TBA'}</span>
                        <Link 
                          to={`/admin/events/edit/${event.id}`}
                          className="ml-2 text-xs text-[#0077B5] hover:text-[#00588a] flex items-center"
                        >
                          Edit <ChevronRight className="h-3 w-3 ml-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <Link 
                  to="/admin/events/new" 
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="rounded-full p-2 bg-blue-100 mr-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Add New Event</span>
                </Link>
                
                <Link 
                  to="/admin/carousel" 
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="rounded-full p-2 bg-amber-100 mr-3">
                    <Image className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Manage Carousel</span>
                </Link>
                
                <Link 
                  to="/admin/content/news/new" 
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="rounded-full p-2 bg-purple-100 mr-3">
                    <FileText className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Add News Item</span>
                </Link>
                
                <Link 
                  to="/admin/settings" 
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="rounded-full p-2 bg-gray-100 mr-3">
                    <Settings className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Site Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Admin Modules - Improved Mobile Layout */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {adminModules.map((module) => (
            <Link
              key={module.id}
              to={module.link}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${module.color} inline-block`}>
                  <module.icon size={20} />
                </div>
                {module.count !== undefined && (
                  <div className="ml-auto bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium text-gray-600">
                    {module.count}
                  </div>
                )}
              </div>
              <h3 className="text-base font-medium text-gray-900 mt-3 mb-1">{module.name}</h3>
              <p className="text-xs text-gray-600 line-clamp-2">{module.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;