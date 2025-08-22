// src/components/events/EventDetail.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Share2, ExternalLink, ArrowLeft } from 'lucide-react';

const EventDetail = ({ event, darkMode = false }) => {
  const navigate = useNavigate();
  
  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Format date
  const formatDate = (dateString, timeString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    let formatted = date.toLocaleDateString('en-US', options);
    
    if (timeString) {
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(hours);
      time.setMinutes(minutes);
      formatted += ` at ${time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
    
    return formatted;
  };
  
  // Check if an event spans multiple days
  const isMultiDayEvent = () => {
    return event.end_date && event.date !== event.end_date;
  };
  
  // Format date range for multi-day events
  const formatDateRange = () => {
    if (!isMultiDayEvent()) return formatDate(event.date, event.time);
    
    const startDate = new Date(event.date);
    const endDate = new Date(event.end_date);
    
    const startOptions = { month: 'long', day: 'numeric' };
    const endOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    
    // If same month and year, simplify the output
    if (startDate.getMonth() === endDate.getMonth() && 
        startDate.getFullYear() === endDate.getFullYear()) {
      return `${startDate.toLocaleDateString('en-US', { day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', endOptions)}`;
    }
    
    return `${startDate.toLocaleDateString('en-US', startOptions)} - ${endDate.toLocaleDateString('en-US', endOptions)}`;
  };
  
  // Get background gradient based on event type
  const getGradient = () => {
    const gradients = {
      'Workshop': 'from-blue-500 via-purple-500 to-indigo-600',
      'Lecture': 'from-green-500 via-teal-500 to-blue-600',
      'Competition': 'from-purple-500 via-pink-500 to-red-500',
      'Conference': 'from-orange-500 via-amber-500 to-yellow-600',
      'Webinar': 'from-blue-400 via-cyan-500 to-teal-600',
      'Seminar': 'from-emerald-500 via-green-500 to-teal-600',
      'Hackathon': 'from-red-500 via-pink-500 to-purple-600',
      'Exhibition': 'from-amber-500 via-orange-500 to-red-600',
      'Other': 'from-gray-500 via-slate-500 to-gray-600'
    };
    
    return gradients[event.type] || gradients['Other'];
  };
  
  // Share event
  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href
      })
      .catch(error => console.log('Error sharing:', error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden ${
        event.imageUrl ? 'h-96' : 'h-64'
      }`}>
        {/* Background Image or Gradient */}
        {event.imageUrl ? (
          <div className="absolute inset-0">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-40"></div>
          </div>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()}`}>
            {/* Decorative wave overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1200 600" preserveAspectRatio="none">
              <path d="M0,100 C300,250 600,50 1200,150 L1200,600 L0,600 Z" fill="white" opacity="0.2" />
              <path d="M0,200 C400,100 800,300 1200,200 L1200,600 L0,600 Z" fill="white" opacity="0.1" />
            </svg>
          </div>
        )}
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>
        
        {/* Event Type Badge */}
        <div className="absolute top-6 right-6">
          <span className={`px-3 py-1 rounded-full text-xs font-medium
            ${event.type === 'Workshop' ? 'bg-blue-100 text-blue-800' :
              event.type === 'Lecture' ? 'bg-green-100 text-green-800' :
              event.type === 'Competition' ? 'bg-purple-100 text-purple-800' :
              event.type === 'Conference' ? 'bg-orange-100 text-orange-800' :
              event.type === 'Webinar' ? 'bg-cyan-100 text-cyan-800' :
              event.type === 'Seminar' ? 'bg-emerald-100 text-emerald-800' :
              event.type === 'Hackathon' ? 'bg-pink-100 text-pink-800' :
              event.type === 'Exhibition' ? 'bg-amber-100 text-amber-800' :
              'bg-gray-100 text-gray-800'
            }`}
          >
            {event.type}
          </span>
        </div>
        
        {/* Event Title */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl">
            {event.title}
          </h1>
          
          {/* Date & Location Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-2">
              <Calendar size={16} className="text-white" />
              <span className="text-white text-sm font-medium">
                {isMultiDayEvent() ? formatDateRange() : formatDate(event.date, event.time)}
              </span>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-2">
              <MapPin size={16} className="text-white" />
              <span className="text-white text-sm font-medium">{event.location}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Registration Button */}
        {event.registrationLink && (
          <div className="mb-8 text-center">
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Register Now
              <ExternalLink size={16} className="ml-2" />
            </a>
          </div>
        )}
        
        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              About This Event
            </h2>
            
            <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>
              {event.description ? (
                <div dangerouslySetInnerHTML={{ __html: event.description.replace(/\n/g, '<br>') }} />
              ) : (
                <p className="text-gray-500 italic">No description available.</p>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className={`rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Event Details
              </h3>
              
              <div className="space-y-4">
                {/* Date & Time */}
                <div className="flex items-start space-x-3">
                  <Calendar className={`flex-shrink-0 h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Date & Time
                    </h4>
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {isMultiDayEvent() ? (
                        <>
                          <div>Start: {formatDate(event.date, event.time)}</div>
                          <div>End: {formatDate(event.end_date, event.end_time)}</div>
                        </>
                      ) : (
                        <div>{formatDate(event.date, event.time)}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-start space-x-3">
                  <MapPin className={`flex-shrink-0 h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Location
                    </h4>
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {event.location}
                    </div>
                  </div>
                </div>
                
                {/* Share Button */}
                <button
                  onClick={shareEvent}
                  className={`mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 border rounded-md text-sm font-medium transition-colors
                    ${darkMode 
                      ? 'border-gray-600 text-white hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Share2 size={16} />
                  <span>Share Event</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;