// src/components/layout/AdminSidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Image,
  Settings, 
  LogOut
} from 'lucide-react';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect happens in the protected route
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Simplified menu without super admin items for now
  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin'
    },
    {
      name: 'Events',
      icon: Calendar,
      path: '/admin/events'
    },
    {
      name: 'Content',
      icon: FileText,
      path: '/admin/content/blog'
    },
    {
      name: 'Carousel',
      icon: Image,
      path: '/admin/carousel'
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/admin/settings'
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">IEEE SPS Admin</h2>
          <p className="text-sm text-gray-600">Gujarat Chapter</p>
        </div>
        
        {/* Navigation */}
        <nav className="px-4 py-6">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <NavLink 
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center px-4 py-3 text-gray-700 rounded-md transition-colors ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'hover:bg-gray-100'
                      }`
                    }
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
            
            {/* Logout */}
            <li className="pt-4 mt-4 border-t border-gray-200">
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;