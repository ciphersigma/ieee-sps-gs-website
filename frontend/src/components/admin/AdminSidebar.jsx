import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, Users, FileText, Settings, Shield, Home
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar = ({ user }) => {
  const location = useLocation();
  const { isSuperAdmin } = useAuth();

  const superAdminModules = [
    { name: 'Dashboard', icon: Home, link: '/admin' },
    { name: 'Admins', icon: Shield, link: '/admin/admins' },
    { name: 'Student Branches', icon: Users, link: '/admin/branches' },
    { name: 'Events', icon: Calendar, link: '/admin/events' },
    { name: 'Carousel', icon: FileText, link: '/admin/carousel' },
    { name: 'Content', icon: FileText, link: '/admin/content/news' },
    { name: 'Awards', icon: Settings, link: '/admin/awards' },
    { name: 'Newsletter', icon: FileText, link: '/admin/newsletter' },
    { name: 'Members', icon: Users, link: '/admin/members' },
    { name: 'Research', icon: FileText, link: '/admin/research' },
    { name: 'Settings', icon: Settings, link: '/admin/settings' },
    { name: 'Database', icon: Settings, link: '/admin/migration' }
  ];

  const branchAdminModules = [
    { name: 'Dashboard', icon: Home, link: '/admin' },
    { name: 'Branch Events', icon: Calendar, link: '/admin/events' },
    { name: 'Branch Members', icon: Users, link: '/admin/members' },
    { name: 'Branch Content', icon: FileText, link: '/admin/content/news' },
    { name: 'Branch Settings', icon: Settings, link: '/admin/settings' }
  ];

  const modules = isSuperAdmin() ? superAdminModules : branchAdminModules;

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center mb-4">
          <div className={`p-2 rounded-lg mr-3 ${isSuperAdmin() ? 'bg-red-600' : 'bg-blue-600'}`}>
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isSuperAdmin() ? 'Super Admin' : 'Branch Admin'}</h2>
            <p className="text-gray-600 text-sm">{isSuperAdmin() ? 'System Control' : (user?.organization || 'Branch')}</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-gray-900 text-sm font-medium">{user?.name || 'Administrator'}</p>
          <p className="text-gray-600 text-xs">{isSuperAdmin() ? 'System Administrator' : 'Branch Administrator'}</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-1">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = module.link === '/admin' 
              ? location.pathname === '/admin'
              : location.pathname.startsWith(module.link);
            return (
              <Link
                key={module.name}
                to={module.link}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 transition-colors ${
                  isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                }`} />
                <span className="truncate">{module.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;