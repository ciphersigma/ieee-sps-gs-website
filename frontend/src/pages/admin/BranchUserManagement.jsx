// src/pages/admin/BranchUserManagement.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  ToggleLeft, 
  ToggleRight,
  Key,
  UserCheck,
  UserX,
  Settings
} from 'lucide-react';
import { branchAPI, adminAPI } from '../../services/api';

const BranchUserManagement = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  
  const [branch, setBranch] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'branch_admin',
    permissions: ['events']
  });

  useEffect(() => {
    fetchBranchDetails();
  }, [branchId]);

  useEffect(() => {
    if (branch) {
      fetchBranchUsers();
    }
  }, [branch]);

  const fetchBranchDetails = async () => {
    try {
      const response = await branchAPI.getBranch(branchId);
      setBranch(response.data.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to fetch branch details' });
    }
  };

  const fetchBranchUsers = async () => {
    try {
      const branchCode = branch?.code || branchId;
      console.log('Fetching users for branch:', branchCode);
      const response = await adminAPI.getBranchUsers(branchCode);
      console.log('Users response:', response.data);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching branch users:', error);
      setMessage({ type: 'error', text: 'Failed to fetch branch users' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = {
        ...userFormData,
        branch_id: branch?.code || branchId,
        branch: branch?.code
      };

      // Ensure branch_id is set for roles that require it
      if (['branch_admin', 'counsellor', 'chairperson', 'member'].includes(userData.role)) {
        if (!userData.branch_id) {
          throw new Error('Branch ID is required for this role');
        }
      }

      if (editingUser) {
        // Don't send password if it's empty during edit
        if (!userData.password) {
          delete userData.password;
        }
        await adminAPI.updateUser(editingUser._id, userData);
        setMessage({ type: 'success', text: 'User updated successfully' });
      } else {
        await adminAPI.createUser(userData);
        setMessage({ type: 'success', text: 'User created successfully' });
      }

      resetUserForm();
      fetchBranchUsers();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || error.message || 'Operation failed' });
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      setMessage({ type: 'success', text: 'User status updated' });
      fetchBranchUsers();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update user status' });
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await adminAPI.deleteUser(userId);
      setMessage({ type: 'success', text: 'User deleted successfully' });
      fetchBranchUsers();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete user' });
    }
  };

  const resetPassword = async (userId) => {
    const newPassword = prompt('Enter new password (minimum 6 characters):');
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      await adminAPI.resetUserPassword(userId, newPassword);
      setMessage({ type: 'success', text: 'Password reset successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reset password' });
    }
  };

  const editUser = (user) => {
    setUserFormData({
      name: user.name,
      email: user.email,
      password: '',
      phone: user.profile?.phone || '',
      role: user.role,
      permissions: user.permissions || ['events']
    });
    setEditingUser(user);
    setShowUserForm(true);
  };

  const resetUserForm = () => {
    setUserFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'branch_admin',
      permissions: ['events']
    });
    setEditingUser(null);
    setShowUserForm(false);
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      'branch_admin': 'Branch Admin',
      'counsellor': 'Counsellor',
      'chairperson': 'Chairperson',
      'member': 'Member'
    };
    return roleMap[role] || role;
  };

  const getPermissionDisplay = (permissions) => {
    if (!permissions || permissions.length === 0) return 'No permissions';
    return permissions.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ');
  };

  if (loading && !branch) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/branches')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Branches
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">{branch?.name} - {branch?.college_name}</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowUserForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Branch Info Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Branch Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Branch Code</p>
            <p className="font-medium">{branch?.code}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-medium">{branch?.city}, {branch?.district}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className={`inline-flex px-2 py-1 rounded-full text-xs ${
              branch?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {branch?.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* User Form */}
      {showUserForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h2>
          
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  required
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password {editingUser ? '(leave blank to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  minLength={6}
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={userFormData.phone}
                  onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="branch_admin">Branch Admin</option>
                  <option value="counsellor">Counsellor</option>
                  <option value="chairperson">Chairperson</option>
                  <option value="member">Member</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Permissions</label>
                <div className="mt-1 space-y-2">
                  {['events', 'content', 'members'].map((permission) => (
                    <label key={permission} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={userFormData.permissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setUserFormData({
                              ...userFormData,
                              permissions: [...userFormData.permissions, permission]
                            });
                          } else {
                            setUserFormData({
                              ...userFormData,
                              permissions: userFormData.permissions.filter(p => p !== permission)
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetUserForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingUser ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Branch Users ({users.length})</h2>
        </div>
        
        {users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No users found for this branch. Create the first user to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                          {user.profile?.phone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {user.profile.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Shield className="h-3 w-3 mr-1" />
                        {getRoleDisplay(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getPermissionDisplay(user.permissions)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleUserStatus(user._id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.is_active ? (
                          <>
                            <UserCheck className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <UserX className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit User"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => resetPassword(user._id)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Reset Password"
                        >
                          <Key className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchUserManagement;