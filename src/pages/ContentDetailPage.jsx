// src/pages/ContentDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Calendar, User, Tag, ArrowLeft, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ContentDetailPage = ({ contentType, listPagePath }) => {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, [id]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .eq('content_type', contentType)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        throw new Error('Content not found');
      }
      
      setContent(data);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('This content could not be found or is no longer available.');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              to={listPagePath} 
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {contentType.charAt(0).toUpperCase() + contentType.slice(0, -1)}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Featured Image (if present) */}
      {content.image && (
        <div className="h-72 md:h-96 w-full overflow-hidden bg-gray-900">
          <img 
            src={content.image} 
            alt={content.title} 
            className="w-full h-full object-cover opacity-90"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            to={listPagePath} 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {contentType.charAt(0).toUpperCase() + contentType.slice(0, -1)}
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{formatDate(content.created_at)}</span>
              </div>
              
              {content.author && (
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{content.author}</span>
                </div>
              )}
            </div>
            
            {/* Tags */}
            {content.tags && content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {content.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Description */}
            <div className="text-lg text-gray-700 mb-8">{content.description}</div>
            
            {/* Main Content */}
            <div className="prose max-w-none">
              <ReactMarkdown>{content.content}</ReactMarkdown>
            </div>
            
            {/* Download Link (for resources) */}
            {contentType === 'resources' && content.file_url && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <a 
                  href={content.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Resource
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPage;