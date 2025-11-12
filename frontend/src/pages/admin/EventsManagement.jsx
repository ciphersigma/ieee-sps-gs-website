// src/pages/admin/EventsManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Plus, Trash2, Edit, Loader, AlertCircle
} from 'lucide-react';
import { eventsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import AdminPageWrapper from '../../components/admin/AdminPageWrapper';

const EventsManagement = () => {
  const { user, isSuperAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Branch admins only see their branch events
      const params = isSuperAdmin() ? {} : { branch: user.branch_id };
      const response = await eventsAPI.getEvents(params);
      
      // Handle nested data structure
      const eventsData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setEvents(eventsData);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventsAPI.deleteEvent(id);
      setEvents(events.filter(event => event._id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.message || 'Failed to delete event');
    }
  };

  return (
    <AdminPageWrapper
      title="Events Management"
      subtitle={`Managing events for ${user?.branch || 'your branch'}`}
      action={
        <Link
          to="/admin/events/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Event
        </Link>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-2">Loading events...</span>
        </div>
      ) : (

        <>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold">Branch Events ({events.length})</h2>
            </div>

          {events.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4" />
              <p>No events found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.description?.substring(0, 60)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.event_date ? new Date(event.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Time TBD'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.location || 'Location TBD'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {event.type || 'Event'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          event.status === 'completed' 
                            ? 'bg-gray-100 text-gray-800'
                            : event.status === 'ongoing'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.status || 'upcoming'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/events/edit/${event._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => deleteEvent(event._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
        </>
      )}
    </AdminPageWrapper>
  );
};

export default EventsManagement;