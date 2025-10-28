import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Eye, Search, Filter, Mail } from 'lucide-react';

const NewsletterPage = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/newsletter`);
      const data = await response.json();
      setNewsletters(data);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (newsletterId, pdfUrl, title) => {
    try {
      // Track download
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/newsletter/${newsletterId}/download`, {
        method: 'POST'
      });
      
      // Download file
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${title}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading newsletter:', error);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    // For now, just show success message
    // In a real implementation, you'd send this to your email service
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAvailableYears = () => {
    const years = newsletters.map(newsletter => 
      new Date(newsletter.publication_date).getFullYear()
    );
    return [...new Set(years)].sort((a, b) => b - a);
  };

  const filteredNewsletters = newsletters.filter(newsletter => {
    const matchesSearch = newsletter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         newsletter.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         newsletter.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesYear = selectedYear === 'all' || 
                       new Date(newsletter.publication_date).getFullYear().toString() === selectedYear;
    
    return matchesSearch && matchesYear;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading newsletters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 md:h-12 md:w-12 mr-3 md:mr-4 flex-shrink-0" />
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">Newsletter Archive</h1>
          </div>
          <p className="text-base md:text-xl max-w-3xl opacity-90 leading-relaxed">
            Stay updated with IEEE SPS Gujarat Chapter's latest news, events, and research highlights
          </p>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6">Get the latest updates delivered to your inbox</p>
            
            {subscribed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">Thank you for subscribing! You'll receive our latest newsletters.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-4 md:py-6 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
              <input
                type="text"
                placeholder="Search newsletters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 h-4 w-4 md:h-5 md:w-5" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Years</option>
                {getAvailableYears().map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletters Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Newsletters</h2>
            <p className="text-gray-600">Found {filteredNewsletters.length} newsletters</p>
          </div>

          {filteredNewsletters.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No newsletters found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {filteredNewsletters.map((newsletter) => (
                <div key={newsletter._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {newsletter.cover_image ? (
                    <div className="h-40 md:h-48 overflow-hidden">
                      <img
                        src={newsletter.cover_image}
                        alt={newsletter.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 md:h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <FileText className="h-12 w-12 md:h-16 md:w-16 text-blue-400" />
                    </div>
                  )}
                  
                  <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {newsletter.issue_number}
                      </span>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        {newsletter.download_count}
                      </div>
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {newsletter.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-500 mb-3">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-2 flex-shrink-0" />
                      <span className="text-xs md:text-sm">{formatDate(newsletter.publication_date)}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {newsletter.description}
                    </p>
                    
                    {newsletter.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {newsletter.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL}/newsletter/pdf/${newsletter._id}`, '_blank')}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(newsletter._id, `${import.meta.env.VITE_API_BASE_URL}/newsletter/pdf/${newsletter._id}`, newsletter.title)}
                        className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsletterPage;