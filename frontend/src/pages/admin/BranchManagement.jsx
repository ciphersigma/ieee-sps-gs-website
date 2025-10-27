// src/pages/admin/BranchManagement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Users, MapPin, Building2, Phone, Mail, User, ToggleLeft, ToggleRight, UserPlus, Key, Settings } from 'lucide-react';
import { branchAPI, adminAPI } from '../../services/api';

const BranchManagement = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    college_name: '',
    city: '',
    district: '',
    is_active: true,
    chairperson: { name: '', email: '', phone: '' },
    counsellor: { name: '', email: '', phone: '' },
    established_date: '',
    member_count: 0
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await branchAPI.getBranches();
      setBranches(response.data.data || []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch branches' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingBranch) {
        await branchAPI.updateBranch(editingBranch._id, formData);
        setMessage({ type: 'success', text: 'Branch updated successfully' });
      } else {
        await branchAPI.createBranch(formData);
        setMessage({ type: 'success', text: 'Branch created successfully' });
      }
      
      resetForm();
      fetchBranches();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  const toggleBranchStatus = async (branchId) => {
    try {
      await branchAPI.toggleBranchStatus(branchId);
      setMessage({ type: 'success', text: 'Branch status updated' });
      fetchBranches();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update branch status' });
    }
  };

  const deleteBranch = async (branchId) => {
    if (!window.confirm('Are you sure you want to delete this branch?')) return;
    
    try {
      await branchAPI.deleteBranch(branchId);
      setMessage({ type: 'success', text: 'Branch deleted successfully' });
      fetchBranches();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete branch' });
    }
  };

  const createUserForRole = (branch, role) => {
    setSelectedBranch(branch);
    setSelectedRole(role);
    setShowUserModal(true);
  };

  const handleCreateUser = async (userData) => {
    try {
      const userPayload = {
        ...userData,
        role: selectedRole === 'chairperson' ? 'branch_admin' : 'counsellor',
        branch_id: selectedBranch.code,
        permissions: selectedRole === 'chairperson' ? ['events', 'content'] : ['events']
      };
      
      const response = await adminAPI.createUser(userPayload);
      
      // Update branch with user assignment
      await branchAPI.assignRole(selectedBranch._id, {
        role: selectedRole,
        user_id: response.data.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || ''
      });
      
      setMessage({ type: 'success', text: `${selectedRole} account created and assigned successfully` });
      setShowUserModal(false);
      fetchBranches();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to create user' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      college_name: '',
      city: '',
      district: '',
      is_active: true,
      chairperson: { name: '', email: '', phone: '' },
      counsellor: { name: '', email: '', phone: '' },
      established_date: '',
      member_count: 0
    });
    setEditingBranch(null);
    setShowForm(false);
  };

  const editBranch = (branch) => {
    setFormData({
      name: branch.name,
      code: branch.code,
      college_name: branch.college_name,
      city: branch.city,
      district: branch.district,
      is_active: branch.is_active,
      chairperson: branch.chairperson || { name: '', email: '', phone: '' },
      counsellor: branch.counsellor || { name: '', email: '', phone: '' },
      established_date: branch.established_date ? branch.established_date.split('T')[0] : '',
      member_count: branch.member_count || 0
    });
    setEditingBranch(branch);
    setShowForm(true);
  };

  if (loading && branches.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Student Branch Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Branch
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Branch Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            {editingBranch ? 'Edit Branch' : 'Add New Branch'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Branch Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Branch Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">College Name</label>
                <input
                  type="text"
                  value={formData.college_name}
                  onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Established Date</label>
                <input
                  type="date"
                  value={formData.established_date}
                  onChange={(e) => setFormData({ ...formData, established_date: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Chairperson Details */}
            <div className="border-t pt-4">
              <h3 className="text-md font-medium text-gray-900 mb-3">Chairperson Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.chairperson.name}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    chairperson: { ...formData.chairperson, name: e.target.value }
                  })}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.chairperson.email}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    chairperson: { ...formData.chairperson, email: e.target.value }
                  })}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.chairperson.phone}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    chairperson: { ...formData.chairperson, phone: e.target.value }
                  })}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Counsellor Details */}
            <div className="border-t pt-4">
              <h3 className="text-md font-medium text-gray-900 mb-3">Counsellor Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.counsellor.name}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    counsellor: { ...formData.counsellor, name: e.target.value }
                  })}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.counsellor.email}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    counsellor: { ...formData.counsellor, email: e.target.value }
                  })}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.counsellor.phone}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    counsellor: { ...formData.counsellor, phone: e.target.value }
                  })}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingBranch ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Branches List */}
      <div className="grid gap-6">
        {branches.map((branch) => (
          <div key={branch._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                <p className="text-sm text-gray-600">{branch.college_name}</p>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {branch.city}, {branch.district}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate(`/admin/branches/${branch._id}/users`)}
                  className="flex items-center px-3 py-1 rounded-md text-sm bg-purple-100 text-purple-800 hover:bg-purple-200"
                  title="Manage Users"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Manage Users
                </button>
                
                <button
                  onClick={() => toggleBranchStatus(branch._id)}
                  className={`flex items-center px-3 py-1 rounded-full text-sm ${
                    branch.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {branch.is_active ? (
                    <ToggleRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ToggleLeft className="h-4 w-4 mr-1" />
                  )}
                  {branch.is_active ? 'Active' : 'Inactive'}
                </button>
                
                <button
                  onClick={() => editBranch(branch)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => deleteBranch(branch._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Chairperson */}
              <div className="border rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Chairperson
                </h4>
                {branch.chairperson?.name ? (
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{branch.chairperson.name}</p>
                    {branch.chairperson.email && (
                      <p className="flex items-center text-gray-600">
                        <Mail className="h-3 w-3 mr-1" />
                        {branch.chairperson.email}
                      </p>
                    )}
                    {branch.chairperson.phone && (
                      <p className="flex items-center text-gray-600">
                        <Phone className="h-3 w-3 mr-1" />
                        {branch.chairperson.phone}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    <p className="mb-2">Not assigned</p>
                    <button
                      onClick={() => createUserForRole(branch, 'chairperson')}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-xs"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Create Account
                    </button>
                  </div>
                )}
              </div>

              {/* Counsellor */}
              <div className="border rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Counsellor
                </h4>
                {branch.counsellor?.name ? (
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{branch.counsellor.name}</p>
                    {branch.counsellor.email && (
                      <p className="flex items-center text-gray-600">
                        <Mail className="h-3 w-3 mr-1" />
                        {branch.counsellor.email}
                      </p>
                    )}
                    {branch.counsellor.phone && (
                      <p className="flex items-center text-gray-600">
                        <Phone className="h-3 w-3 mr-1" />
                        {branch.counsellor.phone}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    <p className="mb-2">Not assigned</p>
                    <button
                      onClick={() => createUserForRole(branch, 'counsellor')}
                      className="flex items-center text-blue-600 hover:text-blue-800 text-xs"
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Creation Modal */}
      {showUserModal && (
        <UserCreationModal
          branch={selectedBranch}
          role={selectedRole}
          onSave={handleCreateUser}
          onClose={() => setShowUserModal(false)}
        />
      )}
    </div>
  );
};

// User Creation Modal Component
const UserCreationModal = ({ branch, role, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          Create {role === 'chairperson' ? 'Chairperson' : 'Counsellor'} Account
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Branch: {branch?.name}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Key className="h-4 w-4 mr-2" />
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchManagement;