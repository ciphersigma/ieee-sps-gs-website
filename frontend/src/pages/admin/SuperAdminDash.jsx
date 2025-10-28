// src/pages/admin/SuperAdminDash.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, Users, FileText, Settings, Building, Shield,
  Image, BarChart3, Database, UserCog, Award
} from 'lucide-react';
import { api } from '../../services/api';

const SuperAdminDash = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBranches: 0,
    totalMembers: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, members, branchesResponse] = await Promise.all([
          api.getAllEvents(),
          api.getMembers(),
          fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/branches`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('ieee_admin_token')}`
            }
          })
        ]);
        
        const branches = branchesResponse.ok ? await branchesResponse.json() : { data: [] };
        
        setStats({
          totalEvents: events?.length || 0,
          totalBranches: branches.data?.length || 0,
          totalMembers: members?.length || 0,
          loading: false
        });
      } catch (error) {
        setStats({
          totalEvents: 0,
          totalBranches: 0,
          totalMembers: 0,
          loading: false
        });
      }
    };
    
    fetchStats();
  }, []);

  const coreModules = [
    {
      name: 'Student Branches',
      description: 'Manage branches and users',
      icon: Building,
      link: '/admin/branches',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      name: 'Events Management',
      description: 'Oversee all events',
      icon: Calendar,
      link: '/admin/events',
      color: 'bg-green-100 text-green-600'
    },
    {
      name: 'Carousel Manager',
      description: 'Homepage carousel images',
      icon: Image,
      link: '/admin/carousel',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const additionalModules = [
    {
      name: 'Content Management',
      description: 'News and articles',
      icon: FileText,
      link: '/admin/content/news',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      name: 'Awards Management',
      description: 'Manage awards & recognition',
      icon: Award,
      link: '/admin/awards',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      name: 'Newsletter Management',
      description: 'Manage newsletter archive',
      icon: FileText,
      link: '/admin/newsletter',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      name: 'Members Directory',
      description: 'Chapter members',
      icon: Users,
      link: '/admin/members',
      color: 'bg-cyan-100 text-cyan-600'
    },
    {
      name: 'Research Hub',
      description: 'Research areas',
      icon: BarChart3,
      link: '/admin/research',
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      name: 'System Settings',
      description: 'Global settings',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-gray-100 text-gray-600'
    },
    {
      name: 'Database Tools',
      description: 'Migration & backup',
      icon: Database,
      link: '/admin/migration',
      color: 'bg-red-100 text-red-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Shield className="mr-3 text-red-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || 'Administrator'}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          Super Administrator
        </span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Student Branches</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBranches}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Management */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Core Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.name}
                to={module.link}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
              >
                <div className="flex items-center mb-4">
                  <div className={`rounded-lg p-3 ${module.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{module.name}</h3>
                <p className="text-gray-600 text-sm">{module.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Additional Tools */}
      <div>
        <h2 className="text-xl font-bold mb-4">Additional Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {additionalModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.name}
                to={module.link}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <div className={`rounded-lg p-2 ${module.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-base font-semibold mb-1">{module.name}</h3>
                <p className="text-gray-600 text-xs">{module.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDash;