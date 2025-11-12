'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight, Search, Filter } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { api } from '@/services/api';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
  featured: boolean;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Awards', 'Events', 'Research', 'Students', 'Announcements'];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await api.getNews();
      const data = response?.data || response || [];
      const newsData = Array.isArray(data) ? data : [];
      
      const transformedNews = newsData.map((item: any) => ({
        id: item.id || item._id,
        title: item.title,
        excerpt: item.description || item.excerpt || item.content?.substring(0, 150) + '...',
        content: item.content,
        category: item.category || 'News',
        author: item.author || 'IEEE SPS Gujarat',
        date: item.created_at || item.date,
        image: item.image_url || item.image || `https://via.placeholder.com/400x250/0077B5/FFFFFF?text=${encodeURIComponent(item.title?.substring(0, 20) || 'News')}`,
        featured: item.featured || false
      }));
      
      setNews(transformedNews.length > 0 ? transformedNews : getDefaultNews());
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews(getDefaultNews());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultNews = (): NewsItem[] => [
    {
      id: '1',
      title: 'IEEE SPS Gujarat Chapter Annual Conference 2024',
      excerpt: 'Join us for our annual conference featuring cutting-edge research presentations and networking opportunities.',
      content: 'Full content here...',
      category: 'Events',
      author: 'IEEE SPS Gujarat',
      date: '2024-01-15',
      image: 'https://via.placeholder.com/400x250/0077B5/FFFFFF?text=Conference+2024',
      featured: true
    },
    {
      id: '2',
      title: 'Student Research Awards Announced',
      excerpt: 'Congratulations to our outstanding students who received research excellence awards.',
      content: 'Full content here...',
      category: 'Awards',
      author: 'IEEE SPS Gujarat',
      date: '2024-01-10',
      image: 'https://via.placeholder.com/400x250/0077B5/FFFFFF?text=Awards+2024',
      featured: false
    },
    {
      id: '3',
      title: 'New Research Collaboration with IIT Gandhinagar',
      excerpt: 'Exciting new partnership to advance signal processing research in biomedical applications.',
      content: 'Full content here...',
      category: 'Research',
      author: 'IEEE SPS Gujarat',
      date: '2024-01-05',
      image: 'https://via.placeholder.com/400x250/0077B5/FFFFFF?text=Research+Collaboration',
      featured: false
    }
  ];

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredNews = news.find(item => item.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Updates</h1>
            <p className="text-xl max-w-3xl opacity-90">
              Stay updated with the latest news, events, and achievements from IEEE SPS Gujarat Chapter
            </p>
          </div>
        </section>

        <section className="bg-white shadow-sm py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 h-5 w-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {featuredNews && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured News</h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={featuredNews.image}
                      alt={featuredNews.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center mb-4">
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {featuredNews.category}
                      </span>
                      <span className="ml-3 text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(featuredNews.date)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredNews.title}</h3>
                    <p className="text-gray-600 mb-6">{featuredNews.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        {featuredNews.author}
                      </div>
                      <Link 
                        href={`/news/${featuredNews.id}`}
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Read More
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest News</h2>
            
            {filteredNews.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No news found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map((item) => (
                  <article key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {item.category}
                        </span>
                        <span className="ml-3 text-sm text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(item.date)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {item.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          {item.author}
                        </div>
                        <Link 
                          href={`/news/${item.id}`}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                        >
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="bg-gradient-to-r from-primary-600 to-blue-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive the latest news and updates directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
              />
              <button className="px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}