// src/pages/admin/UsersList.jsx - Modified version
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { 
  User, 
  UserPlus, 
  Search, 
  Filter, 
  ChevronDown, 
  Shield,
  Trash2, 
  AlertTriangle
} from 'lucide-react';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Fetch users with roles
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users with a simplified approach
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user roles with organization data
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
      
      // Group roles by user ID
      const userMap = {};
      userRoles.forEach(role => {
        if (!userMap[role.user_id]) {
          userMap[role.user_id] = {
            id: role.user_id,
            roles: []
          };
        }
        
        userMap[role.user_id].roles.push({
          id: role.id,
          role: role.role,
          is_active: role.is_active,
          organization: role.organizations?.name || null
        });
      });
      
      // Convert to array
      const usersArray = Object.values(userMap);
      
      // Get email for each user from the auth.users table
      // NOTE: This is just a placeholder since we can't access auth.users
      // In a real implementation, you would store user email in your own table
      
      setUsers(usersArray);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user => {
    // Without email info, we can only filter by ID
    return true; // Show all users for now
  });

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Accounts</h1>
          <p className="text-gray-600">
            Manage user accounts and access permissions
          </p>
        </div>
        
        <Link 
          to="/admin/users/new" 
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={16} />
          <span>Add New User</span>
        </Link>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="mt-4 text-gray-600">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roles
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              U
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role, idx) => (
                          <span key={idx} className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            role.role === 'super_admin' ? 'bg-red-100 text-red-800' :
                            role.role === 'org_admin' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {role.role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.roles.find(r => r.organization)?.organization || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
        <div className="flex">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Due to Supabase security restrictions, this simplified user management view shows 
              only user IDs. For a complete solution, you would need to implement a server-side 
              function or store user emails in your own database table.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;