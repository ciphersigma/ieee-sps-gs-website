// src/components/admin/MemberRoleManagement.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Shield, 
  AlertTriangle, 
  Info, 
  Check, 
  X 
} from 'lucide-react';

const MemberRoleManagement = ({ memberId, memberEmail }) => {
  const { isSuperAdmin } = useAuth();
  const [roles, setRoles] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // New role form
  const [newRole, setNewRole] = useState({
    role: 'org_admin',
    organization_id: '',
    is_active: true
  });
  
  // Fetch member's existing roles
  useEffect(() => {
    const fetchRoles = async () => {
      if (!memberId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_roles')
          .select(`
            id,
            role,
            organization_id,
            is_active,
            organizations(id, name, code)
          `)
          .eq('user_id', memberId);
          
        if (error) throw error;
        setRoles(data || []);
      } catch (error) {
        console.error('Error fetching roles:', error);
        setError('Failed to load roles. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    const fetchOrganizations = async () => {
      try {
        const { data, error } = await supabase
          .from('organizations')
          .select('id, name, code')
          .order('name');
          
        if (error) throw error;
        setOrganizations(data || []);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };
    
    fetchRoles();
    fetchOrganizations();
  }, [memberId]);
  
  // Add a new role
  const addRole = async (e) => {
    e.preventDefault();
    
    if (!memberId) {
      setError('Member ID is required.');
      return;
    }
    
    if (newRole.role === 'org_admin' && !newRole.organization_id) {
      setError('Organization is required for Branch Admin role.');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const { data, error } = await supabase
        .from('user_roles')
        .insert([
          {
            user_id: memberId,
            role: newRole.role,
            organization_id: newRole.role === 'super_admin' ? null : newRole.organization_id,
            is_active: newRole.is_active
          }
        ])
        .select();
        
      if (error) throw error;
      
      // Add the new role to the list with organization info
      if (data && data.length > 0) {
        const newRoleData = data[0];
        const org = organizations.find(o => o.id === newRoleData.organization_id);
        
        setRoles([...roles, {
          ...newRoleData,
          organizations: org ? { name: org.name, code: org.code } : null
        }]);
      }
      
      setSuccess('Role added successfully.');
      
      // Reset form
      setNewRole({
        role: 'org_admin',
        organization_id: '',
        is_active: true
      });
    } catch (error) {
      console.error('Error adding role:', error);
      setError('Failed to add role. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Toggle role active status
  const toggleRoleStatus = async (roleId, currentStatus) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const { data, error } = await supabase
        .from('user_roles')
        .update({ is_active: !currentStatus })
        .eq('id', roleId)
        .select();
        
      if (error) throw error;
      
      // Update the role in the list
      if (data && data.length > 0) {
        setRoles(roles.map(role => 
          role.id === roleId ? { ...role, is_active: !currentStatus } : role
        ));
      }
      
      setSuccess('Role status updated successfully.');
    } catch (error) {
      console.error('Error updating role status:', error);
      setError('Failed to update role status. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Delete role
  const deleteRole = async (roleId) => {
    if (!window.confirm('Are you sure you want to delete this role?')) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);
        
      if (error) throw error;
      
      // Remove the role from the list
      setRoles(roles.filter(role => role.id !== roleId));
      
      setSuccess('Role deleted successfully.');
    } catch (error) {
      console.error('Error deleting role:', error);
      setError('Failed to delete role. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Get role display name
  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'org_admin':
        return 'Branch Admin';
      case 'event_manager':
        return 'Event Manager';
      case 'scanner':
        return 'Event Scanner';
      default:
        return role;
    }
  };
  
  // If not super admin, don't show the component
  if (!isSuperAdmin()) {
    return null;
  }
  
  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Shield className="mr-2 text-blue-600" />
        User Roles Management
      </h3>
      
      {!memberId ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Save the member first to manage roles.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* User Info */}
          <div className="mb-4">
            <p className="text-gray-600">
              Managing roles for: <span className="font-semibold">{memberEmail}</span>
            </p>
          </div>
          
          {/* Current Roles */}
          <div className="mb-6">
            <h4 className="text-lg font-medium mb-2">Current Roles</h4>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading roles...</p>
              </div>
            ) : roles.length === 0 ? (
              <p className="text-gray-500 italic">No roles assigned yet.</p>
            ) : (
              <div className="bg-gray-50 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
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
                    {roles.map(role => (
                      <tr key={role.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            role.role === 'super_admin' 
                              ? 'bg-red-100 text-red-800' 
                              : role.role === 'org_admin'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {getRoleDisplayName(role.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {role.organizations?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            role.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {role.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => toggleRoleStatus(role.id, role.is_active)}
                            className={`text-indigo-600 hover:text-indigo-900 mr-3 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={saving}
                          >
                            {role.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => deleteRole(role.id)}
                            className={`text-red-600 hover:text-red-900 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={saving}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Add New Role Form */}
          <div>
            <h4 className="text-lg font-medium mb-2">Add New Role</h4>
            <form onSubmit={addRole} className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Role Type */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role Type
                  </label>
                  <select
                    id="role"
                    value={newRole.role}
                    onChange={(e) => setNewRole({...newRole, role: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={saving}
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="org_admin">Branch Admin</option>
                    <option value="event_manager">Event Manager</option>
                    <option value="scanner">Event Scanner</option>
                  </select>
                </div>
                
                {/* Organization (only for org_admin) */}
                {newRole.role !== 'super_admin' && (
                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                      Organization
                    </label>
                    <select
                      id="organization"
                      value={newRole.organization_id}
                      onChange={(e) => setNewRole({...newRole, organization_id: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={saving}
                      required={newRole.role !== 'super_admin'}
                    >
                      <option value="">Select Organization</option>
                      {organizations.map(org => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Status */}
                <div className="flex items-center mt-7">
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={newRole.is_active}
                    onChange={(e) => setNewRole({...newRole, is_active: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={saving}
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  type="submit"
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                    saving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={saving}
                >
                  {saving ? 'Adding...' : 'Add Role'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default MemberRoleManagement;