// src/pages/ContentListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { FileText, Calendar, Tag, User, Search, X } from 'lucide-react';

const ContentListPage = ({ contentType, title, description }) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContent();
  }, [contentType]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('content_type', contentType)
        .eq('status', 'published')  // Only get published content
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setContent(data || []);
    } catch (err) {
      console.error(`Error fetching ${contentType}:`, err);
      setError(`Failed to load ${contentType}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  // Filter content based on search
  const filteredContent = content.filter(item => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      item.title?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term) ||
      item.author?.toLowerCase().includes(term) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(term)))
    );
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-xl opacity-90 max-w-3xl">{description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="relative max-w-md mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Search ${title.toLowerCase()}...`}
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {/* Content Grid */}
        {!loading && filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No content found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? 'Try adjusting your search.' : `No ${title.toLowerCase()} have been published yet.`}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContent.map((item) => (
              <Link 
                key={item.id}
                to={`/${contentType}/${item.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
              >
                {/* Image */}
                {item.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{formatDate(item.created_at)}</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                  
                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Author (if present) */}
                  {item.author && (
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="mr-2 h-4 w-4" />
                      <span>{item.author}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentListPage;
