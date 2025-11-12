// src/pages/admin/ContentManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contentAPI } from '../../services/api';
import { 
  FileText, Plus, Edit, Trash2, AlertCircle
} from 'lucide-react';
import AdminPageWrapper from '../../components/admin/AdminPageWrapper';

const ContentManagement = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await contentAPI.getNews();
      // Handle nested data structure
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setContent(data);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Failed to load content');
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (id) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    
    try {
      await contentAPI.deleteNews(id);
      setContent(content.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error deleting content:', err);
      setError('Failed to delete content');
    }
  };

  return (
    <AdminPageWrapper
      title="Content Management"
      subtitle="Manage branch news and articles"
      action={
        <Link
          to="/admin/content/news/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Content
        </Link>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading content...</span>
        </div>
      ) : (

        <>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold">All Content ({content.length})</h2>
          </div>

          {content.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4" />
              <p>No content found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {content.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.content?.substring(0, 60) || item.excerpt?.substring(0, 60)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          News
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.published 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/content/news/edit/${item._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => deleteContent(item._id)}
                            className="text-red-600 hover:text-red-900"
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
        </>
      )}
    </AdminPageWrapper>
  );
};

export default ContentManagement;