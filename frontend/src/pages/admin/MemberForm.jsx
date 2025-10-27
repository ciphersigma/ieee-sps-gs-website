// src/pages/admin/MemberForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { membersAPI } from '../../services/api';

const MemberForm = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const isExecutive = type === 'executive';
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    institution: '',
    bio: '',
    image_url: '',
    linkedin_url: '',
    google_scholar_url: '',
    order: 0,
    is_active: true
  });

  useEffect(() => {
    if (isEdit) {
      fetchMemberData();
    }
  }, [isEdit, id, type]);

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      let response;
      
      if (isExecutive) {
        const { data } = await membersAPI.getExecutive();
        response = { data: data.find(item => (item._id || item.id) === id) };
      } else {
        const { data } = await membersAPI.getMembers();
        response = { data: data.find(item => (item._id || item.id) === id) };
      }

      if (response.data) {
        setFormData(response.data);
      } else {
        setError('Member not found');
      }
    } catch (error) {
      console.error('Error fetching member:', error);
      setError('Failed to load member data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);

      const dataToSave = { ...formData };
      
      // Convert order to number for executive members
      if (isExecutive && dataToSave.order) {
        dataToSave.order = parseInt(dataToSave.order);
      }

      let result;
      if (isEdit) {
        if (isExecutive) {
          result = await membersAPI.updateExecutive(id, dataToSave);
        } else {
          result = await membersAPI.updateMember(id, dataToSave);
        }
      } else {
        if (isExecutive) {
          result = await membersAPI.createExecutive(dataToSave);
        } else {
          result = await membersAPI.createMember(dataToSave);
        }
      }

      navigate('/admin/members');
    } catch (error) {
      console.error('Error saving member:', error);
      setError(error.response?.data?.error || 'Failed to save member');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/admin/members')}
          className="mr-4 p-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit' : 'Add'} {isExecutive ? 'Executive' : 'Member'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position {isExecutive && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name="position"
                value={formData.position || ''}
                onChange={handleChange}
                required={isExecutive}
                placeholder={isExecutive ? "e.g., Chair, Vice Chair" : "e.g., Professor, Student"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Institution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institution
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution || ''}
                onChange={handleChange}
                placeholder="e.g., IIT Gandhinagar"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Department (for regular members) */}
            {!isExecutive && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  placeholder="e.g., Electrical Engineering"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Order (for executive members) */}
            {isExecutive && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order || 0}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief biography or description"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            {/* LinkedIn URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            {/* Google Scholar URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Scholar URL
              </label>
              <input
                type="url"
                name="google_scholar_url"
                value={formData.google_scholar_url || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://scholar.google.com/citations?user=..."
              />
            </div>

            {/* Active Status */}
            <div className="md:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Active member (visible on website)
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/members')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center"
            >
              <X size={16} className="mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <Save size={16} className="mr-2" />
              {saving ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;