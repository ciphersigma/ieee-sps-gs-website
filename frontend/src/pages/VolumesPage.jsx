import React, { useState, useEffect } from 'react';
import { BookOpen, Download, Calendar, Eye, Search, Filter, FileText } from 'lucide-react';

const VolumesPage = () => {
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');

  useEffect(() => {
    fetchVolumes();
  }, []);

  const fetchVolumes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/volumes`);
      const data = await response.json();
      setVolumes(data);
    } catch (error) {
      console.error('Error fetching volumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (volumeId, title) => {
    try {
      // Track download
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/volumes/${volumeId}/download`, {
        method: 'POST'
      });
      
      // For now, just show alert - in real implementation, you'd generate a combined PDF
      alert(`Download functionality for "${title}" will be implemented soon.`);
    } catch (error) {
      console.error('Error downloading volume:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAvailableYears = () => {
    const years = volumes.map(volume => 
      new Date(volume.publication_date).getFullYear()
    );
    return [...new Set(years)].sort((a, b) => b - a);
  };

  const filteredVolumes = volumes.filter(volume => {
    const matchesSearch = volume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volume.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         volume.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesYear = selectedYear === 'all' || 
                       new Date(volume.publication_date).getFullYear().toString() === selectedYear;
    
    return matchesSearch && matchesYear;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading volumes...</p>
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
            <BookOpen className="h-8 w-8 md:h-12 md:w-12 mr-3 md:mr-4 flex-shrink-0" />
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">Publication Volumes</h1>
          </div>
          <p className="text-base md:text-xl max-w-3xl opacity-90 leading-relaxed">
            Explore our collection of research publications and academic volumes
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-4 md:py-6 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
              <input
                type="text"
                placeholder="Search volumes..."
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

      {/* Volumes Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Volumes</h2>
            <p className="text-gray-600">Found {filteredVolumes.length} volumes</p>
          </div>

          {filteredVolumes.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No volumes found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {filteredVolumes.map((volume) => (
                <div key={volume._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {volume.cover_image ? (
                    <div className="h-40 md:h-48 overflow-hidden">
                      <img
                        src={volume.cover_image}
                        alt={volume.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 md:h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 md:h-16 md:w-16 text-blue-400" />
                    </div>
                  )}
                  
                  <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {volume.volume_number}
                      </span>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Download className="h-3 w-3 mr-1" />
                        {volume.download_count}
                      </div>
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {volume.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-500 mb-3">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-2 flex-shrink-0" />
                      <span className="text-xs md:text-sm">{formatDate(volume.publication_date)}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {volume.description}
                    </p>
                    
                    {volume.articles && volume.articles.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">{volume.articles.length} articles</p>
                        <div className="space-y-1">
                          {volume.articles.slice(0, 2).map((article, index) => (
                            <div key={index} className="flex items-center text-xs text-gray-600">
                              <FileText className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{article.title}</span>
                            </div>
                          ))}
                          {volume.articles.length > 2 && (
                            <p className="text-xs text-gray-500">+{volume.articles.length - 2} more articles</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {volume.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {volume.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(`/volumes/${volume._id}`, '_blank')}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(volume._id, volume.title)}
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

export default VolumesPage;