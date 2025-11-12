'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, FileText, Settings, LogOut, Menu, X, Home, Award, Image, Mail, Plus, Edit, Trash2, Search } from 'lucide-react';
import apiClient from '@/services/api';

interface Event {
  _id: string;
  title: string;
  event_date: string;
  time?: string;
  location?: string;
  category?: string;
  description?: string;
  featured?: boolean;
}

export default function AdminEventsPage() {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const router = useRouter();

  const menuItems = [
    { title: 'Dashboard', icon: Home, href: '/admin/dashboard' },
    { title: 'Events', icon: Calendar, href: '/admin/events' },
    { title: 'Members', icon: Users, href: '/admin/members' },
    { title: 'News', icon: FileText, href: '/admin/news' },
    { title: 'Research', icon: Award, href: '/admin/research' },
    { title: 'Gallery', icon: Image, href: '/admin/gallery' },
    { title: 'Messages', icon: Mail, href: '/admin/messages' },
    { title: 'Settings', icon: Settings, href: '/admin/settings' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('ieee_admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    setUser({ name: 'Admin User', role: 'Administrator' });
    fetchEvents();
  }, [router]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/events');
      setEvents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ieee_admin_token');
    localStorage.removeItem('ieee_admin_user');
    router.push('/admin/login');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await apiClient.delete(`/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-lg font-bold text-primary-600">IEEE SPS Admin</h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                item.href === '/admin/events' 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.title}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        <nav className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center ml-auto space-x-4">
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
                <p className="text-gray-600">Manage all events for IEEE SPS Gujarat Chapter</p>
              </div>
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Event
              </button>
            </div>

            <div className="bg-white shadow rounded-lg mb-6">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No events found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEvents.map((event) => (
                        <tr key={event._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{event.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(event.event_date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{event.location || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {event.category || 'General'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {event.featured && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Featured
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(event)}
                              className="text-primary-600 hover:text-primary-900 mr-4"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(event._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}