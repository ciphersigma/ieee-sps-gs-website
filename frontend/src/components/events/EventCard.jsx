// components/events/EventCard.jsx
import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { eventService } from '../../services/eventService';

const EventCard = ({ event }) => {
  const formattedEvent = eventService.formatEventForDisplay(event);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'workshop': return 'bg-purple-100 text-purple-800';
      case 'lecture': return 'bg-indigo-100 text-indigo-800';
      case 'conference': return 'bg-blue-100 text-blue-800';
      case 'competition': return 'bg-orange-100 text-orange-800';
      case 'webinar': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Event Image or Placeholder */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        {event.image_url ? (
          <img 
            src={event.image_url} 
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        {!event.image_url && (
          <Calendar className="w-16 h-16 text-white opacity-80" />
        )}
      </div>

      <div className="p-6">
        {/* Status and Type Badges */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.event_type)}`}>
            {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
          </span>
        </div>

        {/* Event Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Event Description */}
        {event.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formattedEvent.formattedDate}</span>
            {formattedEvent.formattedTime && (
              <span className="ml-2">at {formattedEvent.formattedTime}</span>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location}</span>
          </div>

          {event.max_participants && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4 mr-2" />
              <span>
                {event.current_participants || 0}/{event.max_participants} registered
              </span>
            </div>
          )}

          {formattedEvent.timeUntilEvent !== 'Event has passed' && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-2" />
              <span>{formattedEvent.timeUntilEvent}</span>
            </div>
          )}
        </div>

        {/* Registration Status */}
        {event.status === 'upcoming' && (
          <div className="mb-4">
            {formattedEvent.isFull ? (
              <span className="text-red-600 text-sm font-medium">Event Full</span>
            ) : formattedEvent.isRegistrationOpen ? (
              <span className="text-green-600 text-sm font-medium">Registration Open</span>
            ) : (
              <span className="text-orange-600 text-sm font-medium">Registration Closed</span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              console.log('Event ID:', event._id);
              if (event._id) {
                window.location.href = `/events/${event._id}`;
              } else {
                console.error('No event ID available');
              }
            }}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Details
          </button>
          
          {event.registration_url && formattedEvent.isRegistrationOpen && (
            <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;