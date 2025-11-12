// src/pages/admin/MembersManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Users, Crown, Search, Mail, Building
} from 'lucide-react';
import { membersAPI } from '../../services/api';
import AdminPageWrapper from '../../components/admin/AdminPageWrapper';

const MembersManagement = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [members, setMembers] = useState([]);
  const [executive, setExecutive] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [membersResult, executiveResult] = await Promise.all([
        membersAPI.getMembers(),
        membersAPI.getExecutive()
      ]);

      // Handle nested data structure
      const membersData = Array.isArray(membersResult.data) ? membersResult.data : (membersResult.data?.data || []);
      const executiveData = Array.isArray(executiveResult.data) ? executiveResult.data : (executiveResult.data?.data || []);
      
      setMembers(membersData);
      setExecutive(executiveData);
    } catch (error) {
      console.error('Error fetching members data:', error);
      setError('Failed to load members data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    
    try {
      if (type === 'member') {
        await membersAPI.deleteMember(id);
      } else {
        await membersAPI.deleteExecutive(id);
      }
      fetchAllData();
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member');
    }
  };

  const tabs = [
    { id: 'members', label: 'Members', icon: Users, count: members.length },
    { id: 'executive', label: 'Executive Committee', icon: Crown, count: executive.length }
  ];

  return (
    <AdminPageWrapper
      title="Members Management"
      subtitle="Manage branch members and executive committee"
      action={
        <div className="flex space-x-2">
          <Link
            to="/admin/members/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Member
          </Link>
          <Link
            to="/admin/members/executive/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
          >
            <Crown size={16} className="mr-2" />
            Add Executive
          </Link>
        </div>
      }
    >
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} className="mr-2" />
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full max-w-md"
          />
        </div>
      </div>

      {/* Content */}
      {activeTab === 'members' && (
        <MembersTab 
          members={members.filter(member => 
            member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.institution?.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          onDelete={(id) => handleDelete(id, 'member')}
        />
      )}

      {activeTab === 'executive' && (
        <ExecutiveTab 
          executive={executive.filter(member => 
            member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.institution?.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          onDelete={(id) => handleDelete(id, 'executive')}
        />
      )}
        </>
      )}
    </AdminPageWrapper>
  );
};

// Members Tab Component
const MembersTab = ({ members, onDelete }) => (
  <div className="grid gap-4">
    {members.map((member) => (
      <div key={member._id || member.id} className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              {member.position && (
                <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {member.position}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              {member.email && (
                <div className="flex items-center">
                  <Mail size={14} className="mr-2" />
                  {member.email}
                </div>
              )}
              {member.institution && (
                <div className="flex items-center">
                  <Building size={14} className="mr-2" />
                  {member.institution}
                </div>
              )}
              {member.department && (
                <div className="text-sm">
                  <span className="font-medium">Department:</span> {member.department}
                </div>
              )}
            </div>
            {member.bio && (
              <p className="text-gray-600 mt-2 text-sm">{member.bio}</p>
            )}
          </div>
          <div className="flex space-x-2 ml-4">
            <Link
              to={`/admin/members/edit/${member._id || member.id}`}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            >
              <Edit size={16} />
            </Link>
            <button
              onClick={() => onDelete(member._id || member.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    ))}
    {members.length === 0 && (
      <div className="text-center py-8 text-gray-500">
        No members found. <Link to="/admin/members/new" className="text-blue-600">Add one now</Link>
      </div>
    )}
  </div>
);

// Executive Tab Component
const ExecutiveTab = ({ executive, onDelete }) => (
  <div className="grid gap-4">
    {executive.map((member) => (
      <div key={member._id || member.id} className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {member.position}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                Order: {member.order}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              {member.email && (
                <div className="flex items-center">
                  <Mail size={14} className="mr-2" />
                  {member.email}
                </div>
              )}
              {member.institution && (
                <div className="flex items-center">
                  <Building size={14} className="mr-2" />
                  {member.institution}
                </div>
              )}
            </div>
            {member.bio && (
              <p className="text-gray-600 mt-2 text-sm">{member.bio}</p>
            )}
          </div>
          <div className="flex space-x-2 ml-4">
            <Link
              to={`/admin/members/executive/edit/${member._id || member.id}`}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            >
              <Edit size={16} />
            </Link>
            <button
              onClick={() => onDelete(member._id || member.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    ))}
    {executive.length === 0 && (
      <div className="text-center py-8 text-gray-500">
        No executive members found. <Link to="/admin/members/executive/new" className="text-blue-600">Add one now</Link>
      </div>
    )}
  </div>
);

export default MembersManagement;