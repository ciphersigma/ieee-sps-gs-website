import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Calendar, Download, Eye } from 'lucide-react';

const NewsletterManagement = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    publication_date: '',
    issue_number: '',
    status: 'draft',
    tags: ''
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('ieee_admin_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/newsletter/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNewsletters(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch newsletters:', response.status);
        setNewsletters([]);
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      setNewsletters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('ieee_admin_token');
      
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (pdfFile) {
        formDataToSend.append('pdf', pdfFile);
      }

      if (coverImageFile) {
        formDataToSend.append('cover_image', coverImageFile);
      }

      const url = editingNewsletter 
        ? `${import.meta.env.VITE_API_BASE_URL}/newsletter/admin/${editingNewsletter._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/newsletter/admin`;

      const response = await fetch(url, {
        method: editingNewsletter ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        await fetchNewsletters();
        resetForm();
        alert(editingNewsletter ? 'Newsletter updated successfully!' : 'Newsletter created successfully!');
      } else {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const responseClone = response.clone();
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Could not parse error response as JSON');
          try {
            const textResponse = await responseClone.text();
            console.error('Raw error response:', textResponse.substring(0, 500));
          } catch (textError) {
            console.error('Could not read response as text either');
          }
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error saving newsletter:', error);
      alert(`Error saving newsletter: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (newsletter) => {
    setEditingNewsletter(newsletter);
    setFormData({
      title: newsletter.title,
      description: newsletter.description,
      publication_date: newsletter.publication_date.split('T')[0],
      issue_number: newsletter.issue_number,
      status: newsletter.status,
      tags: newsletter.tags.join(', ')
    });
    setPdfFile(null);
    setCoverImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this newsletter?')) return;

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('ieee_admin_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/newsletter/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchNewsletters();
        alert('Newsletter deleted successfully!');
      } else {
        throw new Error('Failed to delete newsletter');
      }
    } catch (error) {
      console.error('Error deleting newsletter:', error);
      alert('Error deleting newsletter. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      publication_date: '',
      issue_number: '',
      status: 'draft',
      tags: ''
    });
    setPdfFile(null);
    setCoverImageFile(null);
    setEditingNewsletter(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Newsletter Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Newsletter
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingNewsletter ? 'Edit Newsletter' : 'Add New Newsletter'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Number</label>
                <input
                  type="text"
                  value={formData.issue_number}
                  onChange={(e) => setFormData({...formData, issue_number: e.target.value})}
                  placeholder="e.g., Vol 1, Issue 3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
                <input
                  type="date"
                  value={formData.publication_date}
                  onChange={(e) => setFormData({...formData, publication_date: e.target.value})}
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
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PDF File</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!editingNewsletter}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImageFile(e.target.files[0])}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="research, events, awards"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : (editingNewsletter ? 'Update Newsletter' : 'Create Newsletter')}
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
        <div className="overflow-x-auto table-container">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Newsletter</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Issue</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Downloads</th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newsletters.map((newsletter) => (
                <tr key={newsletter._id}>
                  <td className="px-3 md:px-6 py-4">
                    <div className="flex items-center">
                      {newsletter.cover_image ? (
                        <img className="h-8 w-8 md:h-10 md:w-10 rounded-lg object-cover mr-2 md:mr-3 flex-shrink-0" src={newsletter.cover_image} alt="" />
                      ) : (
                        <div className="h-8 w-8 md:h-10 md:w-10 bg-gray-200 rounded-lg flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                          <FileText className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">{newsletter.title}</div>
                        <div className="text-xs text-gray-500 truncate md:hidden">{newsletter.issue_number}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">{newsletter.issue_number}</td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(newsletter.publication_date)}</td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      newsletter.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {newsletter.status}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">{newsletter.download_count}</td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-1 md:space-x-2">
                      <button
                        onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL}/newsletter/pdf/${newsletter._id}`, '_blank')}
                        className="text-green-600 hover:text-green-900 p-1 touch-target"
                        title="View PDF"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(newsletter)}
                        className="text-blue-600 hover:text-blue-900 p-1 touch-target"
                        title="Edit Newsletter"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(newsletter._id)}
                        className="text-red-600 hover:text-red-900 p-1 touch-target"
                        title="Delete Newsletter"
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
      </div>
    </div>
  );
};

export default NewsletterManagement;