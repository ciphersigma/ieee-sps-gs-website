// src/pages/EventDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Users, ArrowLeft, 
  ExternalLink, Share2, Bookmark, Download
} from 'lucide-react';
import { contentAPI } from '../services/api';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      
      const response = await contentAPI.getNews({ id });
      const data = response.data;
      
      if (!data || data.length === 0) {
        setError('Content not found');
        return;
      }
      
      setEvent(data[0]);
    } catch (err) {
      console.error('Error fetching event:', err);
      setError(err.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  // Get event status
  const getEventStatus = () => {
    if (!event) return '';
    const today = new Date().toISOString().split('T')[0];
    return event.date >= today ? 'Upcoming' : 'Past Event';
  };

  // Get event type badge color
  const getEventTypeColor = (type) => {
    switch (type) {
      case 'Workshop':
        return 'bg-blue-100 text-blue-800';
      case 'Lecture':
        return 'bg-purple-100 text-purple-800';
      case 'Conference':
        return 'bg-red-100 text-red-800';
      case 'Competition':
        return 'bg-green-100 text-green-800';
      case 'Webinar':
        return 'bg-cyan-100 text-cyan-800';
      case 'Seminar':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out this event: ${event.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 rounded-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-red-800 mb-2">Event Not Found</h2>
            <p className="text-red-600 mb-4">{error || 'The event you are looking for does not exist.'}</p>
          </div>
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center text-gray-600 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </button>
        </div>
      </div>

      {/* Hero Section with Event Image */}
      <section className="relative">
        <div className="h-96 relative overflow-hidden">
          {event.image ? (
            <>
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary-600 to-primary-500"></div>
          )}
          
          {/* Event Type Badge */}
          <div className="absolute top-8 left-8">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
              {event.type}
            </span>
          </div>

          {/* Event Status Badge */}
          <div className="absolute top-8 right-8">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              getEventStatus() === 'Upcoming' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {getEventStatus()}
            </span>
          </div>

          {/* Event Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {event.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
                
                {event.description ? (
                  <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                    {event.description}
                  </div>
                ) : (
                  <p className="text-gray-600">No description available for this event.</p>
                )}
              </div>

              {/* Additional Details */}
              {(event.speakers || event.topics || event.prerequisites) && (
                <div className="bg-white rounded-xl shadow-md p-8">
                  {event.speakers && (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Speakers</h3>
                      <p className="text-gray-700">{event.speakers}</p>
                    </div>
                  )}

                  {event.topics && (
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Topics Covered</h3>
                      <p className="text-gray-700">{event.topics}</p>
                    </div>
                  )}

                  {event.prerequisites && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Prerequisites</h3>
                      <p className="text-gray-700">{event.prerequisites}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Event Info Card */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Event Details</h3>
                
                <div className="space-y-4">
                  {/* Date */}
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Date</p>
                      <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                    </div>
                  </div>

                  {/* Time */}
                  {event.time && (
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Time</p>
                        <p className="text-sm text-gray-600">{formatTime(event.time)}</p>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Location</p>
                        <p className="text-sm text-gray-600">{event.location}</p>
                      </div>
                    </div>
                  )}

                  {/* Capacity */}
                  {event.max_participants && (
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Capacity</p>
                        <p className="text-sm text-gray-600">
                          {event.current_participants || 0} / {event.max_participants} participants
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  {event.registration_url && getEventStatus() === 'Upcoming' && (
                    <a
                      href={event.registration_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full px-4 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium"
                    >
                      Register Now
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  )}

                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Event
                  </button>
                </div>

                {/* Contact Info */}
                {event.contact_email && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900 mb-2">Questions?</p>
                    <a 
                      href={`mailto:${event.contact_email}`}
                      className="text-sm text-primary-600 hover:text-primary-500 transition-colors"
                    >
                      {event.contact_email}
                    </a>
                  </div>
                )}
              </div>

              {/* Featured Badge */}
              {event.featured && (
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl shadow-md p-6 text-center">
                  <h3 className="text-lg font-bold mb-2">Featured Event</h3>
                  <p className="text-sm opacity-90">
                    This is a highlighted event from IEEE SPS Gujarat Chapter
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Events Section */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">More Events</h2>
            <p className="text-gray-600">Discover other upcoming events</p>
          </div>
          
          <div className="text-center">
            <Link
              to="/events"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-secondary-600 transition-colors"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetailPage;
