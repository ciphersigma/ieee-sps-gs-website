// src/components/admin/AdminHeader.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, LogOut, ChevronDown, Settings, Bell, 
  Calendar, Building2, FileText, Image, Home, Search, User
} from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { contentAPI } from '../../services/api';

const AdminHeader = ({ user, onLogout }) => {
  const { isSuperAdmin, getRoleDisplay } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Navigation items based on user role
  const getNavigation = () => {
    if (isSuperAdmin()) {
      return [
        { name: 'Dashboard', href: '/admin', icon: Home },
        { name: 'Branches', href: '/admin/branches', icon: Building2 },
        { name: 'Events', href: '/admin/events', icon: Calendar },
        { name: 'Carousel', href: '/admin/carousel', icon: Image }
      ];
    }
    
    return [
      { name: 'Dashboard', href: '/admin', icon: Home },
      { name: 'Events', href: '/admin/events', icon: Calendar }
    ];
  };

  const adminNavigation = getNavigation();
  
  // Get notifications (simulated - you can replace with actual data)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // For this example, we'll use recent contact messages as "notifications"
        const response = await contentAPI.getContactMessages({ limit: 5 });
        const data = response.data;
        
        // Format notifications
        const formattedNotifications = data ? data.map(message => ({
          id: message.id,
          title: 'New Contact Message',
          message: `From: ${message.name} - ${message.message.substring(0, 50)}...`,
          time: new Date(message.created_at).toLocaleString(),
          read: false,
          type: 'message'
        })) : [];
        
        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
        setUnreadCount(0);
      }
    };
    
    fetchNotifications();
  }, []);
  
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
  
  const isActive = (path) => {
    return location.pathname === path || 
           (path !== '/admin' && location.pathname.startsWith(path));
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality here
      alert(`Search for: ${searchQuery}`);
      setSearchQuery('');
    }
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <header className="bg-gray-900 text-white fixed w-full z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Admin Badge - Fixed width to prevent overlap */}
          <div className="flex-shrink-0 w-48 flex items-center">
            <Logo size="sm" />
            <div className="ml-3 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
              ADMIN
            </div>
          </div>
          
          {/* Search (Desktop) - Only for Super Admin */}
          {isSuperAdmin() && (
            <div className="hidden md:block flex-grow max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-gray-800 rounded-md py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </form>
            </div>
          )}
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            {adminNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}

            
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-4 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              View Site
            </a>
          </nav>
          
          {/* User Menu - Desktop */}
          <div className="hidden md:block">
            <div className="relative">
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center text-sm font-medium text-gray-300 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center mr-2 border-2 border-gray-600">
                  <span className="text-gray-300 font-medium">
                    {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
                  </span>
                </div>
                <span className="mr-2 hidden lg:block">{user?.email || 'Admin'}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'admin@ieee.org'}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      {getRoleDisplay()}
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
                  {isSuperAdmin() && (
                    <Link
                      to="/admin/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  )}
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
            {/* Notifications - Mobile - Only for Super Admin */}
            {isSuperAdmin() && (
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setMenuOpen(false);
                }}
                className="p-1 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white mr-3 relative"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white font-bold flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            
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
          {/* Search - Mobile - Only for Super Admin */}
          {isSuperAdmin() && (
            <div className="px-2 pt-2 pb-3">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-gray-800 rounded-md py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </form>
            </div>
          )}
          
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {adminNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </Link>
            ))}
            
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              View Site
            </a>
          </div>
          
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
              {isSuperAdmin() && (
                <Link
                  to="/admin/settings"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Settings
                </Link>
              )}
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
      
      {/* Mobile Notifications Panel */}
      {notificationsOpen && (
        <div className="md:hidden bg-white absolute top-16 left-0 right-0 z-10 shadow-lg">
          <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500 px-4 py-2">No new notifications</p>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`px-4 py-2 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-gray-100 px-4 py-2">
            <Link 
              to="/admin/notifications" 
              className="text-xs text-blue-600 hover:text-blue-800"
              onClick={() => setNotificationsOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;