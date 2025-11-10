// src/components/admin/AdminHeader.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, X, LogOut, ChevronDown, Settings, User
} from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../contexts/AuthContext';

const AdminHeader = ({ user, onLogout }) => {
  const { isSuperAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      if (onLogout) {
        await onLogout();
      }
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-50 shadow-sm">
      <div className="px-6">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Admin Badge */}
          <div className="flex items-center">
            <Logo size="sm" />
            <div className={`ml-3 px-3 py-1 text-white text-xs font-semibold rounded-full ${
              isSuperAdmin() ? 'bg-red-600' : 'bg-blue-600'
            }`}>
              {isSuperAdmin() ? 'SUPER ADMIN' : 'BRANCH ADMIN'}
            </div>
          </div>
          

          

          
          {/* User Menu - Desktop */}
          <div className="flex items-center space-x-4">
            
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">
                    {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
                  </span>
                </div>
                <span className="hidden lg:block">{user?.name || user?.email || 'Admin'}</span>
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'admin@ieee.org'}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      {isSuperAdmin() ? 'System Administrator' : 'Branch Administrator'}
                    </p>
                  </div>
                  <Link
                    to="/admin/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Your Profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            
            <button
              onClick={() => {
                setMenuOpen(!menuOpen);
                setNotificationsOpen(false);
              }}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden">
          

          
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-600">
                <span className="text-gray-300 font-medium">
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{user?.email || 'Admin'}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                to="/admin/profile"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                <User className="h-5 w-5 mr-2" />
                Your Profile
              </Link>
              <Link
                to="/admin/settings"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;