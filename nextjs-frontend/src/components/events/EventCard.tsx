'use client';

import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-purple-100 text-purple-800';
      case 'lecture': return 'bg-indigo-100 text-indigo-800';
      case 'conference': return 'bg-blue-100 text-blue-800';
      case 'competition': return 'bg-orange-100 text-orange-800';
      case 'webinar': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return null;
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isRegistrationOpen = () => {
    if (!event.registration_deadline) return true;
    return new Date() < new Date(event.registration_deadline);
  };

  const isFull = () => {
    if (!event.max_participants) return false;
    return (event.current_participants || 0) >= event.max_participants;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Event Image or Placeholder */}
      <div className="h-48 bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center relative">
        {event.image_url ? (
          <Image 
            src={event.image_url} 
            alt={event.title}
            fill
            className="object-cover"
          />
        ) : (
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
            <span>{formatDate(event.event_date)}</span>
            {event.event_time && (
              <span className="ml-2">at {formatTime(event.event_time)}</span>
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
        </div>

        {/* Registration Status */}
        {event.status === 'upcoming' && (
          <div className="mb-4">
            {isFull() ? (
              <span className="text-red-600 text-sm font-medium">Event Full</span>
            ) : isRegistrationOpen() ? (
              <span className="text-green-600 text-sm font-medium">Registration Open</span>
            ) : (
              <span className="text-orange-600 text-sm font-medium">Registration Closed</span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link 
            href={`/events/${event._id}`}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium text-center"
          >
            View Details
          </Link>
          
          {event.registration_url && isRegistrationOpen() && !isFull() && (
            <a 
              href={event.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium text-center"
            >
              Register
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;