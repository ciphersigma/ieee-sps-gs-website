// src/pages/admin/UserAccountForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Mail, 
  ArrowLeft, 
  AlertTriangle,
  Check,
  UserPlus
} from 'lucide-react';

const UserAccountForm = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: ''
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Generate a random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      const password = generatePassword();
      
      // Create user account in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: password,
        email_confirm: true,
        user_metadata: {
          full_name: formData.name,
          organization: formData.organization || null
        }
      });
      
      if (authError) throw authError;
      
      // Store the password temporarily to show to admin
      setGeneratedPassword(password);
      
      // Determine which organization to assign the user to
      let organizationId = null;
      
      if (formData.organization) {
        // First check if the organization exists
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('id')
          .eq('name', formData.organization)
          .single();
          
        if (!orgError && orgData) {
          organizationId = orgData.id;
        } else {
          // Create new organization if it doesn't exist
          const { data: newOrg, error: newOrgError } = await supabase
            .from('organizations')
            .insert([{
              name: formData.organization,
              code: formData.organization.replace(/\s+/g, '-').toLowerCase(),
              is_verified: true
            }])
            .select()
            .single();
            
          if (newOrgError) throw newOrgError;
          
          organizationId = newOrg.id;
        }
      }
      
      // Add user role (branch admin by default)
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: authData.user.id,
          role: 'org_admin',
          organization_id: organizationId,
          is_active: true
        }]);
        
      if (roleError) throw roleError;
      
      setSuccess(`User account created successfully! Make sure to save the password.`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        organization: ''
      });
    } catch (error) {
      console.error('Error creating user account:', error);
      setError(error.message || 'Failed to create user account. Please try again.');
      setGeneratedPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New User Account</h1>
        
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Users
        </button>
      </div>
      
      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <Check className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-green-700">{success}</p>
              {generatedPassword && (
                <div className="mt-2 p-2 bg-gray-100 rounded border border-gray-300">
                  <p className="font-medium">Generated Password:</p>
                  <p className="font-mono text-sm mt-1">{generatedPassword}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Please save this password. It will not be displayed again.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* User Account Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
            </div>
            
            {/* Organization */}
            <div className="md:col-span-2">
              <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                Student Branch / Organization
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., IIT Gandhinagar SPS Student Branch"
              />
              <p className="text-xs text-gray-500 mt-1">
                Organization will be automatically created if it doesn't exist
              </p>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {loading ? 'Creating...' : 'Create User Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserAccountForm;