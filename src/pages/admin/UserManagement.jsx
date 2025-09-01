// src/pages/admin/UserManagement.jsx
// SUPER ADMIN ONLY COMPONENT - Restricted to users with 'super_admin' role
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  ChevronDown, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

const UserManagement = () => {
  const { user, userRoles } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: 'all',
    organization: 'all',
    status: 'active'
  });
  
  // Modal states
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Form states
  const [newUserData, setNewUserData] = useState({
    email: '',
    role: 'org_admin',
    organization_id: '',
    is_active: true
  });
  
  // Fetch users and organizations on component mount
  useEffect(() => {
    // Check if user is super admin
    const isSuperAdmin = userRoles?.some(role => 
      role.role === 'super_admin' && role.is_active
    );
    
    if (isSuperAdmin) {
      fetchUsers();
      fetchOrganizations();
    }
  }, [userRoles]);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.user_metadata?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Role filter
    const matchesRole = 
      filters.role === 'all' || 
      user.role === filters.role;
    
    // Organization filter
    const matchesOrg = 
      filters.organization === 'all' || 
      user.organization_id === filters.organization;
    
    // Status filter
    const matchesStatus = 
      filters.status === 'all' || 
      (filters.status === 'active' && user.is_active) || 
      (filters.status === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesRole && matchesOrg && matchesStatus;
  });

  // Fetch all users with their roles and organizations
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // First, get all user_roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role,
          is_active,
          organization_id,
          organizations(name)
        `);
      
      if (rolesError) throw rolesError;
      
      // Get the actual user data from auth.users
      // Note: In a real implementation, you might need to use server functions
      // to access auth.users data securely. This is simplified for demo purposes.
      const { data: authUsers, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        console.error('Error fetching auth users:', usersError);
        // Fallback: If we can't access auth.users directly, we'll just use the user_roles data
        const userIdsSet = new Set(userRoles.map(role => role.user_id));
        const mockAuthUsers = Array.from(userIdsSet).map(id => ({ id, email: 'User ID: ' + id }));
        
        // Combine the data
        const combinedUsers = userRoles.map(role => {
          const authUser = mockAuthUsers.find(u => u.id === role.user_id);
          return {
            id: role.id,
            user_id: role.user_id,
            email: authUser?.email || 'Unknown email',
            role: role.role,
            is_active: role.is_active,
            organization_id: role.organization_id,
            organization_name: role.organizations?.name || 'No organization',
            user_metadata: authUser?.user_metadata || {},
            created_at: new Date().toISOString()
          };
        });
        
        setUsers(combinedUsers);
        setLoading(false);
        return;
      }
      
      // Combine the data
      const combinedUsers = userRoles.map(role => {
        const authUser = authUsers.users.find(u => u.id === role.user_id);
        return {
          id: role.id,
          user_id: role.user_id,
          email: authUser?.email || 'Unknown email',
          role: role.role,
          is_active: role.is_active,
          organization_id: role.organization_id,
          organization_name: role.organizations?.name || 'No organization',
          user_metadata: authUser?.user_metadata || {},
          created_at: authUser?.created_at
        };
      });
      
      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all organizations
  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name, code')
        .order('name');
      
      if (error) throw error;
      setOrganizations(data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  // Add new user with specified role
  const addUser = async (e) => {
    e.preventDefault();
    try {
      // For demo/prototype purposes, we'll use a simple approach
      // In a production environment, you would use server functions for this
      
      // 1. Check if user exists in auth.users by email
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(newUserData.email);
      
      if (authError) {
        // If user doesn't exist, we would need to invite them
        alert('User not found. Please ensure the user has signed up first.');
        return;
      }
      
      // 2. Add the user role
      const { data, error } = await supabase
        .from('user_roles')
        .insert([
          {
            user_id: authUser.id,
            role: newUserData.role,
            organization_id: newUserData.organization_id || null,
            is_active: newUserData.is_active
          }
        ])
        .select();
      
      if (error) throw error;
      
      // 3. Update the users list
      fetchUsers();
      
      // 4. Close the modal and reset form
      setShowAddUserModal(false);
      setNewUserData({
        email: '',
        role: 'org_admin',
        organization_id: '',
        is_active: true
      });
      
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Please check console for details.');
    }
  };

  // Update user role
  const updateUserRole = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({
          role: currentUser.role,
          organization_id: currentUser.organization_id,
          is_active: currentUser.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      // Update the users list
      fetchUsers();
      
      // Close the modal
      setShowEditUserModal(false);
      setCurrentUser(null);
      
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please check console for details.');
    }
  };

  // Delete user role
  const deleteUserRole = async () => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', currentUser.id);
      
      if (error) throw error;
      
      // Update the users list
      fetchUsers();
      
      // Close the modal
      setShowDeleteConfirmModal(false);
      setCurrentUser(null);
      
    } catch (error) {
      console.error('Error deleting user role:', error);
      alert('Failed to delete user role. Please check console for details.');
    }
  };

  // Get role badge style
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      case 'org_admin':
        return 'bg-blue-100 text-blue-800';
      case 'event_manager':
        return 'bg-green-100 text-green-800';
      case 'scanner':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format role for display
  const formatRole = (role) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'org_admin':
        return 'Organization Admin';
      case 'event_manager':
        return 'Event Manager';
      case 'scanner':
        return 'Scanner';
      default:
        return role;
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      role: 'all',
      organization: 'all',
      status: 'active'
    });
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">
            Manage user accounts and permissions for IEEE SPS Gujarat Chapter
          </p>
        </div>
        
        <button 
          onClick={() => setShowAddUserModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={16} />
          <span>Add New User</span>
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search users..."
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {filters.role !== 'all' || filters.organization !== 'all' || filters.status !== 'active' ? (
              <button 
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>
        
        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({...filters, role: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="org_admin">Organization Admin</option>
                <option value="event_manager">Event Manager</option>
                <option value="scanner">Scanner</option>
              </select>
            </div>
            
            {/* Organization Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
              <select
                value={filters.organization}
                onChange={(e) => setFilters({...filters, organization: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Organizations</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="mt-4 text-gray-600">No users found matching your filters.</p>
            <button 
              onClick={clearFilters}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-700 font-medium">
                            {user.user_metadata?.full_name ? 
                              `${user.user_metadata.full_name.charAt(0)}` : 
                              user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.user_metadata?.full_name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                        {formatRole(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.organization_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setCurrentUser(user);
                          setShowEditUserModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentUser(user);
                          setShowDeleteConfirmModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <UserPlus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Add New User
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={addUser}>
                        {/* Email Input */}
                        <div className="mb-4">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            required
                            value={newUserData.email}
                            onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="user@example.com"
                          />
                        </div>
                        
                        {/* Role Selection */}
                        <div className="mb-4">
                          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                          </label>
                          <select
                            id="role"
                            required
                            value={newUserData.role}
                            onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="super_admin">Super Admin</option>
                            <option value="org_admin">Organization Admin</option>
                            <option value="event_manager">Event Manager</option>
                            <option value="scanner">Scanner</option>
                          </select>
                        </div>
                        
                        {/* Organization Selection (if not super_admin) */}
                        {newUserData.role !== 'super_admin' && (
                          <div className="mb-4">
                            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                              Organization
                            </label>
                            <select
                              id="organization"
                              required={newUserData.role !== 'super_admin'}
                              value={newUserData.organization_id}
                              onChange={(e) => setNewUserData({...newUserData, organization_id: e.target.value})}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select Organization</option>
                              {organizations.map(org => (
                                <option key={org.id} value={org.id}>{org.name}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        
                        {/* Status */}
                        <div className="mb-4 flex items-center">
                          <input
                            type="checkbox"
                            id="is_active"
                            checked={newUserData.is_active}
                            onChange={(e) => setNewUserData({...newUserData, is_active: e.target.checked})}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                            Active
                          </label>
                        </div>
                        
                        <div className="mt-6 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Add User
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddUserModal(false)}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit User Modal */}
      {showEditUserModal && currentUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Edit className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Edit User Role
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {currentUser.email}
                      </p>
                    </div>
                    <div className="mt-4">
                      <form onSubmit={updateUserRole}>
                        {/* Role Selection */}
                        <div className="mb-4">
                          <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                          </label>
                          <select
                            id="edit-role"
                            required
                            value={currentUser.role}
                            onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="super_admin">Super Admin</option>
                            <option value="org_admin">Organization Admin</option>
                            <option value="event_manager">Event Manager</option>
                            <option value="scanner">Scanner</option>
                          </select>
                        </div>
                        
                        {/* Organization Selection (if not super_admin) */}
                        {currentUser.role !== 'super_admin' && (
                          <div className="mb-4">
                            <label htmlFor="edit-organization" className="block text-sm font-medium text-gray-700 mb-1">
                              Organization
                            </label>
                            <select
                              id="edit-organization"
                              required={currentUser.role !== 'super_admin'}
                              value={currentUser.organization_id || ''}
                              onChange={(e) => setCurrentUser({...currentUser, organization_id: e.target.value})}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select Organization</option>
                              {organizations.map(org => (
                                <option key={org.id} value={org.id}>{org.name}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        
                        {/* Status */}
                        <div className="mb-4 flex items-center">
                          <input
                            type="checkbox"
                            id="edit-is_active"
                            checked={currentUser.is_active}
                            onChange={(e) => setCurrentUser({...currentUser, is_active: e.target.checked})}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="edit-is_active" className="ml-2 block text-sm text-gray-700">
                            Active
                          </label>
                        </div>
                        
                        <div className="mt-6 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowEditUserModal(false);
                              setCurrentUser(null);
                            }}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && currentUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete User Role
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to remove the role of <span className="font-medium">{formatRole(currentUser.role)}</span> from user <span className="font-medium">{currentUser.email}</span>?
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={deleteUserRole}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirmModal(false);
                    setCurrentUser(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;