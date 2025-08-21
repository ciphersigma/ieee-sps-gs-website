// src/components/home/EventsSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
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

  // Show placeholder if there are no events
  if (loading) {
    return (
      <section id="events" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No upcoming events scheduled at the moment. Check back soon!
            </p>
          </div>
          <div className="text-center">
            <Link to="/events" className="inline-flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-800">
              <span>View Past Events</span>
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
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us for workshops, lectures, and competitions to advance your knowledge in signal processing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg">
              {/* Event image (optional) */}
              {event.image && (
                <div className="h-48 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                </div>
              )}
              
              {/* If no image, show colored banner */}
              {!event.image && (
                <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">{event.type}</span>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-blue-600 mb-2">
                  <Calendar size={16} />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <MapPin size={16} />
                  <span>{event.location}</span>
                </div>
                
                <Link 
                  to={`/events/${event.id}`} 
                  className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/events" className="inline-flex items-center space-x-2 text-blue-600 font-medium hover:text-blue-800">
            <span>View All Events</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;