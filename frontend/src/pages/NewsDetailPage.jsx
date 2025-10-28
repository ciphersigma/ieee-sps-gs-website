// src/pages/NewsDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { contentAPI } from '../services/api';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      // For now, fetch all news and find the specific one
      const response = await contentAPI.getNews();
      const data = response?.data || response || [];
      const newsData = Array.isArray(data) ? data : [];
      
      const newsItem = newsData.find(item => (item.id || item._id).toString() === id);
      
      if (newsItem) {
        setNews({
          id: newsItem.id || newsItem._id,
          title: newsItem.title,
          content: newsItem.content,
          category: newsItem.category || 'News',
          author: newsItem.author || 'IEEE SPS Gujarat',
          date: newsItem.created_at || newsItem.date,
          image: newsItem.image_url || newsItem.image || `https://via.placeholder.com/800x400/0077B5/FFFFFF?text=${encodeURIComponent(newsItem.title?.substring(0, 20) || 'News')}`
        });
      } else {
        setError('News article not found');
      }
    } catch (error) {
      console.error('Error fetching news detail:', error);
      setError('Failed to load news article');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = window.location.href;
  const shareTitle = news?.title || 'IEEE SPS Gujarat News';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">News Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested news article could not be found.'}</p>
          <Link
            to="/news"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/news"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {news.category}
              </span>
              <span className="ml-4 text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(news.date)}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {news.title}
            </h1>
            
            <div className="flex items-center text-gray-600">
              <User className="h-4 w-4 mr-2" />
              <span>By {news.author}</span>
            </div>
          </header>

          {/* Featured Image */}
          {news.image && (
            <div className="mb-8">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>

          {/* Share Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Share2 className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-600 font-medium">Share this article:</span>
              </div>
              
              <div className="flex space-x-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-blue-700 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NewsDetailPage;