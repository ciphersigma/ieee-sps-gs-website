'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Search } from 'lucide-react';
import EventCard from './EventCard';

interface Event {
  _id: string;
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  location: string;
  event_type: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  max_participants?: number;
  current_participants?: number;
  registration_url?: string;
  image_url?: string;
  registration_deadline?: string;
}

interface Filters {
  status: string;
  eventType: string;
  search: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    status: 'upcoming',
    eventType: '',
    search: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        _id: '1',
        title: 'Introduction to Signal Processing',
        description: 'A comprehensive workshop covering the fundamentals of digital signal processing techniques and applications.',
        event_date: '2024-02-15',
        event_time: '14:00',
        location: 'Gujarat University, Ahmedabad',
        event_type: 'workshop',
        status: 'upcoming',
        max_participants: 50,
        current_participants: 32,
        registration_url: 'https://example.com/register',
        registration_deadline: '2024-02-10'
      },
      {
        _id: '2',
        title: 'Machine Learning in Signal Processing',
        description: 'Explore the intersection of ML and signal processing with hands-on examples and real-world applications.',
        event_date: '2024-02-20',
        event_time: '10:00',
        location: 'IIT Gandhinagar',
        event_type: 'lecture',
        status: 'upcoming',
        max_participants: 100,
        current_participants: 75,
        registration_url: 'https://example.com/register2'
      },
      {
        _id: '3',
        title: 'IEEE SPS Annual Conference 2024',
        description: 'Join researchers and industry experts for the annual IEEE Signal Processing Society conference.',
        event_date: '2024-03-05',
        event_time: '09:00',
        location: 'Gandhinagar Convention Center',
        event_type: 'conference',
        status: 'upcoming',
        max_participants: 200,
        current_participants: 150,
        registration_url: 'https://example.com/register3'
      },
      {
        _id: '4',
        title: 'Digital Image Processing Workshop',
        description: 'Learn advanced techniques in digital image processing and computer vision applications.',
        event_date: '2024-01-15',
        event_time: '14:00',
        location: 'NIT Surat',
        event_type: 'workshop',
        status: 'completed',
        max_participants: 40,
        current_participants: 40
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredEvents = events.filter(event => {
    const matchesStatus = !filters.status || event.status === filters.status;
    const matchesType = !filters.eventType || event.event_type === filters.eventType;
    const matchesSearch = !filters.search || 
      event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.description?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading events: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filters.eventType}
            onChange={(e) => handleFilterChange('eventType', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
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
        {filteredEvents.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No events found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filters.search ? 'Try adjusting your search terms' : 'Check back later for new events'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventList;