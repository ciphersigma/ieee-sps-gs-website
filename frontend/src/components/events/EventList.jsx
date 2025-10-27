// components/events/EventList.jsx
import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Search, Filter } from 'lucide-react';
import { useEvents, useEventSearch } from '../../hooks/useEvents';
import { eventService } from '../../services/eventService';

const EventList = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    status: 'upcoming',
    eventType: '',
    search: ''
  });

  const { events, loading, error, pagination, refetch } = useEvents(filters);
  const { searchResults, searchEvents, clearSearch, loading: searchLoading } = useEventSearch();

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      searchEvents(searchTerm);
      setFilters(prev => ({ ...prev, search: searchTerm }));
    } else {
      clearSearch();
      setFilters(prev => ({ ...prev, search: '' }));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const displayEvents = filters.search ? searchResults : events;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading events: {error}</p>
        <button 
          onClick={refetch}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          IEEE SPS Events
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Join our workshops, lectures, and networking events
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.eventType}
            onChange={(e) => handleFilterChange('eventType', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="workshop">Workshop</option>
            <option value="lecture">Lecture</option>
            <option value="conference">Conference</option>
            <option value="competition">Competition</option>
            <option value="webinar">Webinar</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {displayEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Empty State */}
      {displayEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No events found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filters.search ? 'Try adjusting your search terms' : 'Check back later for new events'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handleFilterChange('page', page)}
              className={`px-4 py-2 rounded-lg ${
                page === pagination.page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};