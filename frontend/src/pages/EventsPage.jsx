// src/pages/EventsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Filter, Search, 
  Tag, ChevronDown, X, ArrowRight 
} from 'lucide-react';
import { api } from '../services/api';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    types: [],
    year: 'all',
    upcoming: true,
    past: true
  });

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events when search term or filters change
  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, activeFilters]);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await api.getAllEvents();
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on search term and filters
  const filterEvents = () => {
    if (!events.length) {
      setFilteredEvents([]);
      return;
    }

    let filtered = [...events];
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(term) || 
        event.location.toLowerCase().includes(term) ||
        (event.description && event.description.toLowerCase().includes(term))
      );
    }
    
    // Filter by event type
    if (activeFilters.types.length > 0) {
      filtered = filtered.filter(event => 
        activeFilters.types.includes(event.category || event.type)
      );
    }
    
    // Filter by year
    if (activeFilters.year !== 'all') {
      filtered = filtered.filter(event => {
        const eventYear = new Date(event.event_date || event.date).getFullYear().toString();
        return eventYear === activeFilters.year;
      });
    }
    
    // Filter by upcoming/past
    const today = new Date().toISOString().split('T')[0];
    if (activeFilters.upcoming && !activeFilters.past) {
      filtered = filtered.filter(event => (event.event_date || event.date) >= today);
    } else if (!activeFilters.upcoming && activeFilters.past) {
      filtered = filtered.filter(event => (event.event_date || event.date) < today);
    }
    
    // Sort by date - newest first
    filtered.sort((a, b) => {
      const dateA = new Date(a.event_date || a.date);
      const dateB = new Date(b.event_date || b.date);
      return dateB - dateA;
    });
    
    setFilteredEvents(filtered);
  };

  // Toggle a specific filter
  const toggleFilter = (filterType, value) => {
    if (filterType === 'types') {
      setActiveFilters(prev => {
        const updatedTypes = prev.types.includes(value)
          ? prev.types.filter(type => type !== value)
          : [...prev.types, value];
        
        return {
          ...prev,
          types: updatedTypes
        };
      });
    } else {
      setActiveFilters(prev => ({
        ...prev,
        [value]: !prev[value]
      }));
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({
      types: [],
      year: 'all',
      upcoming: true,
      past: true
    });
    setSearchTerm('');
  };

  // Get unique event types and years for filter options
  const eventTypes = [...new Set(events.map(event => event.category || event.type))].filter(Boolean);
  const eventYears = [...new Set([
    ...events.map(event => {
      const year = new Date(event.event_date || event.date).getFullYear();
      return isNaN(year) ? null : year.toString();
    }).filter(Boolean),
    '2024', '2023', '2022', '2021', '2020'
  ])].sort((a, b) => b - a);

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get event type badge color
  const getEventTypeColor = (type) => {
    switch (type) {
      case 'workshop':
      case 'Workshop':
        return 'bg-blue-100 text-primary-600';
      case 'seminar':
      case 'Lecture':
        return 'bg-purple-100 text-purple-800';
      case 'conference':
      case 'Conference':
        return 'bg-red-100 text-red-800';
      case 'meeting':
      case 'Competition':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Placeholder events for fallback
  const placeholderEvents = [
    {
      id: 1,
      title: "International Workshop on Digital Signal Processing",
      event_date: "2025-09-15",
      time: "10:00 AM - 4:00 PM",
      location: "IIT Gandhinagar",
      category: "workshop",
      is_featured: true
    },
    {
      id: 2,
      title: "IEEE SPS Distinguished Lecture Series",
      event_date: "2025-09-22",
      time: "2:00 PM - 4:00 PM",
      location: "NIT Surat",
      category: "seminar"
    },
    {
      id: 3,
      title: "Student Paper Competition 2025",
      event_date: "2025-10-05",
      time: "9:00 AM - 6:00 PM",
      location: "DA-IICT Gandhinagar",
      category: "other"
    }
  ];

  // Determine which events to display
  const displayEvents = filteredEvents.length > 0 ? filteredEvents : 
                        (error ? placeholderEvents : []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '25px 25px'
          }}></div>
          
          {/* Signal waves */}
          <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path 
              d="M0,100 C100,60 200,140 300,100 C400,60 500,140 600,100 C700,60 800,140 900,100 C1000,60 1100,140 1200,100" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.2)" 
              strokeWidth="2"
            />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Events & Activities</h1>
          <p className="text-xl max-w-3xl opacity-90">
            Discover workshops, lectures, conferences, and competitions organized by the 
            IEEE Signal Processing Society Gujarat Chapter.
          </p>
        </div>
      </section>
      
      {/* Filters and Search Section */}
      <section className="bg-white shadow-md py-4 sticky top-20 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
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
            
            {/* Filter Button & Active Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Active filter pills */}
              {activeFilters.types.map(type => (
                <span 
                  key={type}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-500"
                >
                  {type}
                  <button 
                    onClick={() => toggleFilter('types', type)}
                    className="ml-1 text-primary-500 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              
              {activeFilters.year !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {activeFilters.year}
                  <button 
                    onClick={() => setActiveFilters(prev => ({ ...prev, year: 'all' }))}
                    className="ml-1 text-blue-800 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {activeFilters.upcoming && !activeFilters.past && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-600/10 text-primary-600">
                  Upcoming Only
                  <button 
                    onClick={() => toggleFilter('time', 'upcoming')}
                    className="ml-1 text-primary-600 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {!activeFilters.upcoming && activeFilters.past && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                  Past Only
                  <button 
                    onClick={() => toggleFilter('time', 'past')}
                    className="ml-1 text-gray-700 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {/* Filter dropdown button */}
              <div className="relative">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Filter dropdown */}
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-40 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">Event Type</h3>
                      <div className="mt-2 space-y-2">
                        {eventTypes.map(type => (
                          <label key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={activeFilters.types.includes(type)}
                              onChange={() => toggleFilter('types', type)}
                              className="h-4 w-4 text-primary-500 focus:ring-primary-500 rounded"
                            />
                            <span className="ml-2 text-gray-700">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">Year</h3>
                      <div className="mt-2">
                        <select
                          value={activeFilters.year}
                          onChange={(e) => setActiveFilters(prev => ({ ...prev, year: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="all">All Years</option>
                          {eventYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">Time</h3>
                      <div className="mt-2 space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={activeFilters.upcoming}
                            onChange={() => toggleFilter('time', 'upcoming')}
                            className="h-4 w-4 text-primary-500 focus:ring-primary-500 rounded"
                          />
                          <span className="ml-2 text-gray-700">Upcoming</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={activeFilters.past}
                            onChange={() => toggleFilter('time', 'past')}
                            className="h-4 w-4 text-primary-500 focus:ring-primary-500 rounded"
                          />
                          <span className="ml-2 text-gray-700">Past</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="px-4 py-2 flex justify-between">
                      <button
                        onClick={clearFilters}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Clear all filters
                      </button>
                      <button
                        onClick={() => setFilterOpen(false)}
                        className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Events List Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          )}
          
          {/* Error State */}
          {error && !loading && displayEvents.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-red-50 inline-block mx-auto p-4 rounded-lg text-red-700 mb-4">
                <X className="h-10 w-10 mx-auto mb-2" />
                <p>{error}</p>
              </div>
              <button
                onClick={() => fetchEvents()}
                className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* No Results State */}
          {!loading && !error && filteredEvents.length === 0 && events.length > 0 && (
            <div className="text-center py-20">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No events found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
          
          {/* Empty State */}
          {!loading && !error && events.length === 0 && (
            <div className="text-center py-20">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No events yet</h3>
              <p className="text-gray-500">Check back soon for upcoming events</p>
            </div>
          )}
          
          {/* Events Grid */}
          {!loading && displayEvents.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                {activeFilters.upcoming && !activeFilters.past ? 'Upcoming Events' : 
                 !activeFilters.upcoming && activeFilters.past ? 'Past Events' : 'All Events'}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({displayEvents.length} {displayEvents.length === 1 ? 'event' : 'events'})
                </span>
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayEvents.map((event) => (
                  <div 
                    key={event._id || event.id} 
                    className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${
                      (event.featured || event.is_featured) ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    {/* Event Image or Color Banner */}
                    <div className="h-48 relative overflow-hidden">
                      {event.image_url ? (
                        <img 
                          src={event.image_url} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center">
                          <span className="text-white text-lg font-medium">{event.category || event.type || 'Event'}</span>
                        </div>
                      )}
                      
                      {/* Featured and Type Tags */}
                      <div className="absolute top-4 right-4">
                        {(event.category || event.type) && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.category || event.type)}`}>
                            {event.category || event.type}
                          </span>
                        )}
                      </div>
                      
                      {(event.featured || event.is_featured) && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-primary-500 text-white rounded-full text-xs font-medium">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      {/* Date */}
                      <div className="flex items-center space-x-2 text-sm text-primary-600 mb-3">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span>{formatDate(event.event_date || event.date)}</span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {event.title}
                      </h3>
                      
                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        {event.time && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        
                        {event.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Button */}
                      <Link 
                        to={`/events/${event._id || event.id}`} 
                        className="inline-flex items-center justify-center w-full py-2 bg-primary-600 text-white rounded-md hover:bg-secondary-600 transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
