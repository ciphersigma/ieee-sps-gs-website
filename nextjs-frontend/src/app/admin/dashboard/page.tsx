'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, FileText, Settings, LogOut, BarChart3, Menu, X, Home, Award, Image, Mail } from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('ieee_admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    setUser({ name: 'Admin User', role: 'Administrator' });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('ieee_admin_token');
    localStorage.removeItem('ieee_admin_user');
    router.push('/admin/login');
  };

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

  const stats = [
    { title: 'Total Events', value: '24', icon: Calendar, color: 'bg-blue-500' },
    { title: 'Members', value: '156', icon: Users, color: 'bg-green-500' },
    { title: 'News Articles', value: '18', icon: FileText, color: 'bg-purple-500' },
    { title: 'Page Views', value: '2.4k', icon: BarChart3, color: 'bg-orange-500' }
  ];

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
              className="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
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
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-600">Overview of your IEEE SPS Gujarat Chapter</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 ${stat.color} rounded-md flex items-center justify-center`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                          <dd className="text-lg font-medium text-gray-900">{stat.value}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {menuItems.slice(1, 5).map((action, index) => (
                      <button
                        key={index}
                        onClick={() => router.push(action.href)}
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <action.icon className="w-8 h-8 text-primary-600 mb-2" />
                        <span className="text-sm font-medium text-gray-900">{action.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      <span className="text-gray-600">New event "Workshop on AI" created</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      <span className="text-gray-600">Member profile updated</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      <span className="text-gray-600">News article published</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}