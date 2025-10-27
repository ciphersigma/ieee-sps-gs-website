import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Users, FileText, BarChart3, 
  Plus, Eye, Edit, Trash2, Clock, MapPin 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const BranchDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalMembers: 0,
    recentActivity: []
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranchData();
  }, []);

  const fetchBranchData = async () => {
    try {
      setLoading(true);
      
      // Fetch branch-specific events (API will auto-filter by branch for branch admins)
      const eventsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/events`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ieee_admin_token')}`
        }
      });
      
      if (eventsResponse.ok) {
        const events = await eventsResponse.json();
        setRecentEvents(events.slice(0, 5));
        
        const now = new Date();
        const upcomingCount = events.filter(event => new Date(event.event_date) > now).length;
        
        setStats(prev => ({
          ...prev,
          totalEvents: events.length,
          upcomingEvents: upcomingCount
        }));
      }
      
    } catch (error) {
      console.error('Error fetching branch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.branch_id || 'Branch'} - Branch Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your student branch activities and events
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Branch Members</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {recentEvents.filter(e => {
                    const eventDate = new Date(e.event_date);
                    const now = new Date();
                    return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/events/new"
            className="bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition-colors"
          >
            <div className="flex items-center">
              <Plus className="h-8 w-8 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Create Event</h3>
                <p className="text-blue-100">Add a new event for your branch</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/events"
            className="bg-green-600 text-white rounded-lg p-6 hover:bg-green-700 transition-colors"
          >
            <div className="flex items-center">
              <Calendar className="h-8 w-8 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Manage Events</h3>
                <p className="text-green-100">View and edit your events</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/members"
            className="bg-purple-600 text-white rounded-lg p-6 hover:bg-purple-700 transition-colors"
          >
            <div className="flex items-center">
              <Users className="h-8 w-8 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Branch Members</h3>
                <p className="text-purple-100">Manage branch membership</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Events</h2>
            <Link
              to="/admin/events"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          {recentEvents.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4" />
              <p>No events created yet</p>
              <Link
                to="/admin/events/new"
                className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create your first event
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentEvents.map((event) => (
                <div key={event._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(event.event_date)}
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location}
                          </div>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'upcoming' 
                            ? 'bg-green-100 text-green-800'
                            : event.status === 'ongoing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/events/${event._id}`}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/events/edit/${event._id}`}
                        className="p-2 text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchDashboard;