// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  Image,
  UserCog,
  Building,
  PieChart,
  AlertTriangle,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, userRoles, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  // Check if user has super admin role
  const userIsSuperAdmin = isSuperAdmin();

  // Stats for dashboard (these would normally come from an API)
  const quickStats = [
    { label: "Total Events", value: "12", icon: Calendar },
    { label: "Active Admins", value: userIsSuperAdmin ? "8" : "-", icon: UserCog },
    { label: "Organizations", value: userIsSuperAdmin ? "5" : "-", icon: Building },
    { label: "Content Items", value: "24", icon: FileText }
  ];

  // Define all admin modules
  const adminModules = [
    // Regular admin modules
    {
      id: 'events',
      name: 'Events Management',
      description: 'Create and manage events, track registrations',
      icon: Calendar,
      link: '/admin/events',
      color: 'bg-blue-100 text-blue-600',
      superAdminOnly: false
    },
    {
      id: 'content',
      name: 'Content Management',
      description: 'Manage website content, blog posts, and resources',
      icon: FileText,
      link: '/admin/content/blog',
      color: 'bg-purple-100 text-purple-600',
      superAdminOnly: false
    },
    {
      id: 'carousel',
      name: 'Carousel Manager',
      description: 'Update images and content on the homepage carousel',
      icon: Image,
      link: '/admin/carousel',
      color: 'bg-pink-100 text-pink-600',
      superAdminOnly: false
    },
    {
      id: 'settings',
      name: 'Site Settings',
      description: 'Configure general website settings and SEO',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-gray-100 text-gray-600',
      superAdminOnly: false
    },
    
    // Super admin modules
    {
      id: 'users',
      name: 'User Management',
      description: 'Create and manage admin user accounts and permissions',
      icon: UserCog,
      link: '/admin/users',
      color: 'bg-red-100 text-red-600',
      superAdminOnly: true
    },
    {
      id: 'organizations',
      name: 'Organizations',
      description: 'Manage student branches and organizations',
      icon: Building,
      link: '/admin/organizations',
      color: 'bg-green-100 text-green-600',
      superAdminOnly: true
    }
  ];

  // Filter modules based on user role
  const filteredModules = adminModules.filter(module => 
    !module.superAdminOnly || (module.superAdminOnly && userIsSuperAdmin)
  );

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.email || 'Admin'}
          {userIsSuperAdmin && <span className="ml-2 text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">Super Admin</span>}
        </p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="rounded-full p-3 mr-4 bg-blue-50">
                <Icon className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Recent Activity (placeholder) */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Recent Activity</h2>
          <Clock className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="rounded-full bg-blue-100 p-2 mr-3">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">New event created</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="rounded-full bg-green-100 p-2 mr-3">
              <FileText className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Content updated</p>
              <p className="text-xs text-gray-500">Yesterday</p>
            </div>
          </div>
          {userIsSuperAdmin && (
            <div className="flex items-start">
              <div className="rounded-full bg-red-100 p-2 mr-3">
                <UserCog className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium">New admin user added</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Admin Modules */}
      <h2 className="text-xl font-bold mb-4">Admin Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const Icon = module.icon;
          return (
            <Link
              key={module.id}
              to={module.link}
              className={`bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-[1.02] hover:shadow-lg ${
                module.superAdminOnly ? 'border-l-4 border-red-500' : ''
              }`}
            >
              <div className="flex items-center mb-4">
                <div className={`rounded-full p-3 mr-3 ${module.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">
                  {module.name}
                  {module.superAdminOnly && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full">
                      Super
                    </span>
                  )}
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">{module.description}</p>
              <div className="text-blue-600 text-sm font-medium">
                Open {module.name} →
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* Notes for super admin */}
      {userIsSuperAdmin && (
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Super Admin Note</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You have access to super admin features, including user management and organization control.
                Please use these privileges responsibly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;