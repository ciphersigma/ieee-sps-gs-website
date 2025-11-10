import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield, Lock, Unlock, Search, Eye, EyeOff } from 'lucide-react';
import AdminPageWrapper from '../../components/admin/AdminPageWrapper';
import { adminAPI } from '../../services/api';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'super_admin',
    branch: '',
    permissions: {
      events: true,
      members: true,
      content: true,
      settings: false
    },
    status: 'active'
  });

  const roles = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'branch_admin', label: 'Branch Admin' }
  ];

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      // Try different response structures
      let adminData = [];
      if (Array.isArray(response.data)) {
        adminData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        adminData = response.data.data;
      } else if (response.data?.users && Array.isArray(response.data.users)) {
        adminData = response.data.users;
      } else if (Array.isArray(response)) {
        adminData = response;
      }
      
      console.log('Parsed admin data:', adminData);
      setAdmins(adminData);
    } catch (error) {
      console.error('Error fetching admins:', error);
      console.error('Error details:', error.response);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      console.log('Submitting payload:', payload);
      console.log('Selected role:', payload.role);
      
      if (editingAdmin && !payload.password) {
        delete payload.password;
      }
      // Convert permissions object to array of permission names
      if (payload.role === 'branch_admin' && payload.permissions) {
        payload.permissions = Object.keys(payload.permissions).filter(key => payload.permissions[key]);
      } else {
        delete payload.permissions;
      }
      
      // Ensure role is set correctly
      if (!payload.role) {
        alert('Please select a role');
        return;
      }
      
      console.log('Final payload being sent:', payload);
      
      if (editingAdmin) {
        await adminAPI.updateUser(editingAdmin._id, payload);
      } else {
        await adminAPI.createUser(payload);
      }
      await fetchAdmins();
      resetForm();
      alert(`${editingAdmin ? 'Admin updated' : 'Admin created'} successfully! Role: ${payload.role}`);
    } catch (error) {
      console.error('Error saving admin:', error);
      console.error('Error response:', error.response);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || JSON.stringify(error.response?.data) || 'Error saving admin. Please try again.';
      alert(errorMsg);
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    // Convert permissions array to object
    const permissionsObj = {
      events: false,
      members: false,
      content: false,
      settings: false
    };
    if (Array.isArray(admin.permissions)) {
      admin.permissions.forEach(perm => {
        permissionsObj[perm] = true;
      });
    }
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      role: admin.role,
      branch: admin.branch || '',
      permissions: permissionsObj,
      status: admin.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    try {
      await adminAPI.deleteUser(id);
      await fetchAdmins();
      alert('Admin deleted successfully!');
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Error deleting admin. Please try again.');
    }
  };

  const toggleStatus = async (id) => {
    try {
      await adminAPI.toggleUserStatus(id);
      await fetchAdmins();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Error updating status. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'super_admin',
      branch: '',
      permissions: {
        events: true,
        members: true,
        content: true,
        settings: false
      },
      status: 'active'
    });
    setEditingAdmin(null);
    setShowForm(false);
  };

  const filteredAdmins = Array.isArray(admins) ? admins.filter(admin =>
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.branch?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <AdminPageWrapper
      title="Admin Management"
      subtitle="Manage administrators and their permissions"
      action={
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Admin
        </button>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password {editingAdmin && '(leave blank to keep current)'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10"
                        required={!editingAdmin}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => {
                        console.log('Role changed to:', e.target.value);
                        setFormData({...formData, role: e.target.value});
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Current: {formData.role}</p>
                  </div>
                  {formData.role === 'branch_admin' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                      <input
                        type="text"
                        value={formData.branch}
                        onChange={(e) => setFormData({...formData, branch: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="e.g., LDCE, SVIT"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {formData.role === 'branch_admin' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.keys(formData.permissions).map(permission => (
                        <label key={permission} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.permissions[permission]}
                            onChange={(e) => setFormData({
                              ...formData,
                              permissions: {
                                ...formData.permissions,
                                [permission]: e.target.checked
                              }
                            })}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm capitalize">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {editingAdmin ? 'Update Admin' : 'Create Admin'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search admins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No admins found
                      </td>
                    </tr>
                  ) : filteredAdmins.map((admin) => (
                    <tr key={admin._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          admin.role === 'super_admin' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {admin.role === 'super_admin' ? 'Super Admin' : 'Branch Admin'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {admin.branch || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {admin.role === 'branch_admin' && admin.permissions ? (
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(admin.permissions) ? admin.permissions : Object.entries(admin.permissions || {}).filter(([_, v]) => v).map(([key]) => key)).map((key) => (
                              <span key={key} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                {typeof key === 'string' ? key : key}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">All</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleStatus(admin._id)}
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            admin.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {admin.status === 'active' ? <Unlock className="h-3 w-3 inline mr-1" /> : <Lock className="h-3 w-3 inline mr-1" />}
                          {admin.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(admin._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminPageWrapper>
  );
};

export default AdminManagement;
