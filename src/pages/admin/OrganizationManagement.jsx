// src/components/admin/OrganizationManagement.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { 
  Building, 
  Plus, 
  Edit, 
  Trash, 
  Check, 
  X, 
  AlertTriangle 
} from 'lucide-react';

const OrganizationManagement = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  const [currentOrg, setCurrentOrg] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    is_verified: true
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .order('name');
          
        if (error) throw error;
        setOrganizations(data || []);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        setError('Failed to load organizations');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrganizations();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      if (formMode === 'create') {
        // Create new organization
        const { data, error } = await supabase
          .from('organizations')
          .insert([formData])
          .select();
          
        if (error) throw error;
        
        setOrganizations([...organizations, data[0]]);
        setSuccess('Organization created successfully');
      } else {
        // Update existing organization
        const { data, error } = await supabase
          .from('organizations')
          .update(formData)
          .eq('id', currentOrg.id)
          .select();
          
        if (error) throw error;
        
        setOrganizations(organizations.map(org => 
          org.id === currentOrg.id ? data[0] : org
        ));
        setSuccess('Organization updated successfully');
      }
      
      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving organization:', error);
      setError(error.message || 'Failed to save organization');
    }
  };

  // Edit organization
  const editOrganization = (org) => {
    setFormMode('edit');
    setCurrentOrg(org);
    setFormData({
      name: org.name,
      code: org.code,
      description: org.description || '',
      is_verified: org.is_verified
    });
  };

  // Delete organization
  const deleteOrganization = async (id) => {
    if (!window.confirm('Are you sure you want to delete this organization? This will also remove all associated user roles.')) {
      return;
    }
    
    try {
      setError(null);
      setSuccess(null);
      
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setOrganizations(organizations.filter(org => org.id !== id));
      setSuccess('Organization deleted successfully');
    } catch (error) {
      console.error('Error deleting organization:', error);
      setError('Failed to delete organization. It might have associated user roles.');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormMode('create');
    setCurrentOrg(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      is_verified: true
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Building className="mr-2" />
        Organizations Management
      </h1>
      
      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <div className="flex">
            <Check className="h-5 w-5 text-green-400" />
            <p className="ml-3 text-green-700">{success}</p>
          </div>
        </div>
      )}
      
      {/* Organization Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {formMode === 'create' ? 'Add New Organization' : 'Edit Organization'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Code (Unique)
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={formMode === 'edit'} // Can't change code once created
              />
              {formMode === 'edit' && (
                <p className="text-xs text-gray-500 mt-1">Code cannot be changed after creation</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>
            
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_verified"
                  name="is_verified"
                  checked={formData.is_verified}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_verified" className="ml-2 block text-sm text-gray-700">
                  Verified Organization
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex space-x-3">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {formMode === 'create' ? 'Create Organization' : 'Update Organization'}
            </button>
            
            {formMode === 'edit' && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Organizations List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">Organizations</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading organizations...</p>
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No organizations found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
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
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{org.name}</div>
                      {org.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{org.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {org.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        org.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {org.is_verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => editOrganization(org)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteOrganization(org.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
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

export default OrganizationManagement;