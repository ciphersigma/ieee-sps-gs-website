// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Users, LogOut, Plus, FileText, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const adminModules = [
    {
      id: 'events',
      name: 'Events Management',
      description: 'Add, edit, or delete events and manage registrations',
      icon: Calendar,
      link: '/admin/events',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'members',
      name: 'Members Directory',
      description: 'Manage chapter members and executive committee',
      icon: Users,
      link: '/admin/members',
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'content',
      name: 'Content Management',
      description: 'Update website content, blog posts, and resources',
      icon: FileText,
      link: '/admin/content',
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
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.email}
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
        
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-600 font-medium">Total Events</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-sm text-green-600 font-medium">Members</p>
              <p className="text-2xl font-bold">124</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-md">
              <p className="text-sm text-purple-600 font-medium">Registrations</p>
              <p className="text-2xl font-bold">56</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-md">
              <p className="text-sm text-orange-600 font-medium">Site Visits</p>
              <p className="text-2xl font-bold">2,304</p>
            </div>
          </div>
        </div>
        
        {/* Admin Modules */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {adminModules.map((module) => (
            <Link
              key={module.id}
              to={module.link}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <div className={`p-3 rounded-full ${module.color} inline-block mb-4`}>
                <module.icon size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{module.name}</h3>
              <p className="text-gray-600 text-sm">{module.description}</p>
            </Link>
          ))}
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/admin/events/new" 
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span>Add New Event</span>
            </Link>
            
            <Link 
              to="/admin/members/new" 
              className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus size={16} />
              <span>Add New Member</span>
            </Link>
            
            <Link 
              to="/admin/content/new" 
              className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <Plus size={16} />
              <span>Add New Content</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;