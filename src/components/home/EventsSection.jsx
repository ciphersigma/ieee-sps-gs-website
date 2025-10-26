// src/components/home/EventsSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowRight, Tag } from 'lucide-react';
import { supabase } from '../../services/supabase';

const EventsSection = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Get today's date in ISO format
        const today = new Date().toISOString().split('T')[0];
        
        // Fetch featured and upcoming events from Supabase
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .gte('date', today)  // Only get events from today or later
          .order('date', { ascending: true })
          .limit(3);  // Only get 3 events for the homepage
        
        if (error) {
          throw error;
        }
        
        setUpcomingEvents(data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load upcoming events.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  // Get event type badge color
  const getEventTypeColor = (type) => {
    switch (type) {
      case 'Workshop':
        return 'bg-blue-100 text-primary-600';
      case 'Lecture':
        return 'bg-purple-100 text-purple-800';
      case 'Conference':
        return 'bg-red-100 text-red-800';
      case 'Competition':
        return 'bg-green-100 text-green-800';
      case 'Webinar':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date properly
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Show placeholder if there are no events
  if (loading) {
    return (
      <section id="events" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 relative inline-block">
              Upcoming Events
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary-500 transform translate-y-2"></span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Loading events...
            </p>
          </div>
          {/* Loading placeholders */}
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Handle error state
  if (error) {
    return (
      <section id="events" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 relative inline-block">
              Upcoming Events
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary-500 transform translate-y-2"></span>
            </h2>
            <p className="text-xl text-red-600 max-w-3xl mx-auto">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Handle no events case
  if (upcomingEvents.length === 0) {
    return (
      <section id="events" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 relative inline-block">
              Upcoming Events
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary-500 transform translate-y-2"></span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No upcoming events scheduled at the moment. Check back soon!
            </p>
          </div>
          <div className="text-center">
            <Link to="/events" className="inline-flex items-center px-5 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
              <span className="mr-2">View Past Events</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 relative inline-block">
              Upcoming Events
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary-500 transform translate-y-2"></span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              Join us for workshops, lectures, and competitions to advance your knowledge in signal processing
            </p>
          </div>
          <Link 
            to="/events" 
            className="mt-6 md:mt-0 inline-flex items-center text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            <span>View All Events</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <div 
              key={event.id} 
              className={`bg-white rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg hover:translate-y-[-4px] ${
                event.featured ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              {/* Event image (optional) */}
              <div className="h-48 relative overflow-hidden">
                {event.image ? (
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">{event.type || 'Event'}</span>
                  </div>
                )}
                
                {/* Event Type Badge */}
                {event.type && (
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                  </div>
                )}
                
                {/* Featured Badge */}
                {event.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary-500 text-white rounded-full text-xs font-medium">
                      Featured
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-primary-600 mb-3">
                  <Calendar size={16} className="flex-shrink-0" />
                  <span>{formatDate(event.date)}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{event.title}</h3>
                
                <div className="space-y-2 mb-4">
                  {event.time && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{event.time}</span>
                    </div>
                  )}
                  
                  {event.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-2 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                
                <Link 
                  to={`/events/${event.id}`} 
                  className="w-full py-2 bg-primary-600 text-white rounded-md hover:bg-secondary-600 transition-colors inline-block text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/events" 
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            <span className="mr-2">View All Events</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
