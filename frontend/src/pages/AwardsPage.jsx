import React, { useState, useEffect } from 'react';
import { Award, Calendar, User } from 'lucide-react';

const AwardsPage = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Student Award', 'Faculty Award', 'Research Award', 'Service Award', 'Other'];

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/awards`);
      const data = await response.json();
      setAwards(data);
    } catch (error) {
      console.error('Error fetching awards:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAwards = awards.filter(award => 
    selectedCategory === 'all' || award.category === selectedCategory
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading awards...</p>
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
            <Award className="h-8 w-8 md:h-12 md:w-12 mr-3 md:mr-4 flex-shrink-0" />
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">Awards & Recognition</h1>
          </div>
          <p className="text-base md:text-xl max-w-3xl opacity-90 leading-relaxed">
            Celebrating excellence and achievements in signal processing research and education
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredAwards.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No awards found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {filteredAwards.map((award) => (
                <div key={award._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {award.image ? (
                    <div className="h-40 md:h-48 overflow-hidden">
                      <img
                        src={award.image}
                        alt={award.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 md:h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <Award className="h-12 w-12 md:h-16 md:w-16 text-blue-400" />
                    </div>
                  )}
                  <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        award.category === 'Student Award' ? 'bg-blue-100 text-blue-800' :
                        award.category === 'Faculty Award' ? 'bg-green-100 text-green-800' :
                        award.category === 'Research Award' ? 'bg-purple-100 text-purple-800' :
                        award.category === 'Service Award' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {award.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{award.title}</h3>
                    
                    <div className="flex items-center text-gray-600 mb-2">
                      <User className="h-3 w-3 md:h-4 md:w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{award.recipient}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500 mb-3">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-2 flex-shrink-0" />
                      <span className="text-xs md:text-sm">{formatDate(award.date)}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{award.description}</p>
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

export default AwardsPage;