// src/pages/admin/ContentManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { 
  FileText, Plus, Search, Filter, ChevronDown, 
  Edit, Trash2, AlertCircle, ExternalLink, Calendar,
  X, Tag, BarChart2, BookOpen, Download, File
} from 'lucide-react';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'published'
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch content based on active tab
  useEffect(() => {
    fetchContent();
  }, [activeTab]);
  
  // Function to fetch content from Supabase
  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('content_type', activeTab)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setContent(data || []);
    } catch (err) {
      console.error(`Error fetching ${activeTab}:`, err);
      setError(`Failed to load ${activeTab}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter content based on search and filters
  const filteredContent = content.filter(item => {
    // Filter by status
    if (filters.status !== 'all' && item.status !== filters.status) {
      return false;
    }
    
    // Search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.title?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.author?.toLowerCase().includes(term) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }
    
    return true;
  });
  
  // Delete content
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('content')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Remove from local state
        setContent(prevContent => prevContent.filter(item => item.id !== id));
      } catch (err) {
        console.error('Error deleting content:', err);
        alert('Failed to delete. Please try again.');
      }
    }
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilters({
      type: 'all',
      status: 'published'
    });
    setSearchTerm('');
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Get content type icon
  const getContentIcon = (contentType) => {
    switch (contentType) {
      case 'news':
        return <FileText size={20} />;
      case 'publications':
        return <BookOpen size={20} />;
      case 'resources':
        return <Download size={20} />;
      case 'blog':
        return <File size={20} />;
      default:
        return <FileText size={20} />;
    }
  };
  
  // Content type display names
  const contentTypeNames = {
    news: 'News & Updates',
    publications: 'Publications & Research',
    resources: 'Resources & Downloads',
    blog: 'Blog Posts'
  };
  
  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600">
              Manage {contentTypeNames[activeTab].toLowerCase()} for IEEE SPS Gujarat Chapter
            </p>
          </div>
          
          <Link 
            to={`/admin/content/${activeTab}/new`} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Add New {activeTab === 'news' ? 'News Item' : 
                     activeTab === 'publications' ? 'Publication' :
                     activeTab === 'resources' ? 'Resource' : 'Blog Post'}
          </Link>
        </div>
        
        {/* Content Type Tabs */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
          <div className="sm:hidden">
            <select
              id="tabs"
              name="tabs"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="news">News & Updates</option>
              <option value="publications">Publications & Research</option>
              <option value="resources">Resources & Downloads</option>
              <option value="blog">Blog Posts</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-4 px-4 sm:px-6 py-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('news')}
                className={`${
                  activeTab === 'news'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 font-medium text-sm rounded-md flex items-center`}
              >
                <FileText className="mr-2 h-4 w-4" />
                News & Updates
              </button>
              <button
                onClick={() => setActiveTab('publications')}
                className={`${
                  activeTab === 'publications'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 font-medium text-sm rounded-md flex items-center`}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Publications & Research
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`${
                  activeTab === 'resources'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 font-medium text-sm rounded-md flex items-center`}
              >
                <Download className="mr-2 h-4 w-4" />
                Resources & Downloads
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`${
                  activeTab === 'blog'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                } px-3 py-2 font-medium text-sm rounded-md flex items-center`}
              >
                <File className="mr-2 h-4 w-4" />
                Blog Posts
              </button>
            </nav>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white shadow-sm px-4 sm:px-6 py-4">
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
                placeholder={`Search ${contentTypeNames[activeTab].toLowerCase()}...`}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
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
              
              {(filters.status !== 'published' || searchTerm) && (
                <button 
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status-filter"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading {contentTypeNames[activeTab].toLowerCase()}...</p>
          </div>
        )}
        
        {/* Content Items */}
        {!loading && filteredContent.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-b-xl shadow-sm">
            {getContentIcon(activeTab)}
            <h3 className="mt-2 text-lg font-medium text-gray-900">No {contentTypeNames[activeTab].toLowerCase()} found</h3>
            <p className="mt-1 text-gray-500">Get started by creating a new item.</p>
            <div className="mt-6">
              <Link
                to={`/admin/content/${activeTab}/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={16} className="mr-2" />
                Add New {activeTab === 'news' ? 'News Item' : 
                        activeTab === 'publications' ? 'Publication' :
                        activeTab === 'resources' ? 'Resource' : 'Blog Post'}
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-b-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    {activeTab === 'news' && (
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Featured
                      </th>
                    )}
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContent.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded flex items-center justify-center bg-blue-100 text-blue-600">
                            {getContentIcon(activeTab)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.title}
                            </div>
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap mt-1 -ml-1">
                                {item.tags.slice(0, 2).map((tag, index) => (
                                  <span key={index} className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
                                    {tag}
                                  </span>
                                ))}
                                {item.tags.length > 2 && (
                                  <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
                                    +{item.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'published' ? 'bg-green-100 text-green-800' :
                          item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      {activeTab === 'news' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.featured ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                              Featured
                            </span>
                          ) : (
                            <span>—</span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            to={`/${activeTab}/${item.id}`} 
                            target="_blank"
                            className="text-gray-500 hover:text-gray-700"
                            title="View on site"
                          >
                            <ExternalLink size={18} />
                          </Link>
                          <Link 
                            to={`/admin/content/${activeTab}/edit/${item.id}`} 
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit item"
                          >
                            <Edit size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(item.id)} 
                            className="text-red-600 hover:text-red-800"
                            title="Delete item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagement;