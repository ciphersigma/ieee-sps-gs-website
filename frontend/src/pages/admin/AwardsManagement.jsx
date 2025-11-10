import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Award } from 'lucide-react';
import AdminPageWrapper from '../../components/admin/AdminPageWrapper';

const AwardsManagement = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAward, setEditingAward] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    recipient: '',
    category: 'Student Award',
    date: '',
    status: 'active'
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Student Award', 'Faculty Award', 'Research Award', 'Service Award', 'Other'];

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('ieee_admin_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/awards/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAwards(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch awards:', response.status);
        setAwards([]);
      }
    } catch (error) {
      console.error('Error fetching awards:', error);
      setAwards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('ieee_admin_token');
      console.log('Form data:', formData);
      console.log('Token exists:', !!token);
      
      const url = editingAward 
        ? `${import.meta.env.VITE_API_BASE_URL}/awards/admin/${editingAward._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/awards/admin`;

      let requestBody;
      let headers = {
        'Authorization': `Bearer ${token}`
      };

      if (imageFile) {
        // Use FormData for image upload
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          formDataToSend.append(key, formData[key]);
        });
        formDataToSend.append('image', imageFile);
        requestBody = formDataToSend;
      } else {
        // Use JSON for text-only data
        headers['Content-Type'] = 'application/json';
        requestBody = JSON.stringify(formData);
      }

      const response = await fetch(url, {
        method: editingAward ? 'PUT' : 'POST',
        headers,
        body: requestBody
      });

      if (response.ok) {
        await fetchAwards();
        resetForm();
        alert(editingAward ? 'Award updated successfully!' : 'Award created successfully!');
      } else {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const responseClone = response.clone();
          const errorData = await response.json();
          console.error('Server error:', errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Could not parse error response as JSON');
          try {
            const textResponse = await response.text();
            console.error('Raw error response:', textResponse.substring(0, 500));
          } catch (textError) {
            console.error('Could not read response as text either');
          }
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error saving award:', error);
      console.error('Error details:', error.message);
      alert(`Error saving award: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (award) => {
    setEditingAward(award);
    setFormData({
      title: award.title,
      description: award.description,
      recipient: award.recipient,
      category: award.category,
      date: award.date.split('T')[0],
      status: award.status
    });
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this award?')) return;

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('ieee_admin_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/awards/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchAwards();
        alert('Award deleted successfully!');
      } else {
        throw new Error('Failed to delete award');
      }
    } catch (error) {
      console.error('Error deleting award:', error);
      alert('Error deleting award. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      recipient: '',
      category: 'Student Award',
      date: '',
      status: 'active'
    });
    setImageFile(null);
    setEditingAward(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminPageWrapper
      title="Achievements Management"
      subtitle="Manage branch achievements and awards"
      action={
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Award
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
            {editingAward ? 'Edit Award' : 'Add New Award'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                <input
                  type="text"
                  value={formData.recipient}
                  onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : (editingAward ? 'Update Award' : 'Create Award')}
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

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Award</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(awards) && awards.map((award) => (
                <tr key={award._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {award.image ? (
                        <img className="h-10 w-10 rounded-lg object-cover mr-3" src={award.image} alt="" />
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                          <Award className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{award.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{award.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{award.recipient}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      award.category === 'Student Award' ? 'bg-blue-100 text-blue-800' :
                      award.category === 'Faculty Award' ? 'bg-green-100 text-green-800' :
                      award.category === 'Research Award' ? 'bg-purple-100 text-purple-800' :
                      award.category === 'Service Award' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {award.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(award.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      award.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {award.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(award)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(award._id)}
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

export default AwardsManagement;