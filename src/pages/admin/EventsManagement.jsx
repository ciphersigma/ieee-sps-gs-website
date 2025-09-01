// src/pages/admin/EventsManagement.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Plus, Search, Filter, Trash2, Edit, 
  ChevronDown, ChevronLeft, ChevronRight, Loader, 
  AlertCircle, X, ExternalLink, Clock, MapPin 
} from 'lucide-react';
import { supabase, TABLES } from '../../services/supabase';
import { format } from 'date-fns';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'upcoming', 'past'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const [eventsPerPage] = useState(10);

  const eventTypes = ['Workshop', 'Conference', 'Lecture', 'Seminar', 'Competition', 'Meeting'];

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Count query to get total number of events
        let countQuery = supabase
          .from(TABLES.EVENTS)
          .select('*', { count: 'exact', head: true });
          
        // Apply filters to count query
        if (timeFilter === 'upcoming') {
          const today = new Date().toISOString().split('T')[0];
          countQuery = countQuery.gte('event_date', today);
        } else if (timeFilter === 'past') {
          const today = new Date().toISOString().split('T')[0];
          countQuery = countQuery.lt('event_date', today);
        }
        
        if (selectedTypes.length > 0) {
          countQuery = countQuery.in('event_type', selectedTypes);
        }
        
        if (searchQuery) {
          countQuery = countQuery.or(
            `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`
          );
        }
        
        const { count, error: countError } = await countQuery;
        
        if (countError) throw countError;
        
        setTotalEvents(count || 0);
        
        // Main query to fetch paginated events
        let query = supabase
          .from(TABLES.EVENTS)
          .select('*');
          
        // Apply same filters to main query
        if (timeFilter === 'upcoming') {
          const today = new Date().toISOString().split('T')[0];
          query = query.gte('event_date', today);
        } else if (timeFilter === 'past') {
          const today = new Date().toISOString().split('T')[0];
          query = query.lt('event_date', today);
        }
        
        if (selectedTypes.length > 0) {
          query = query.in('event_type', selectedTypes);
        }
        
        if (searchQuery) {
          query = query.or(
            `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`
          );
        }
        
        // Add ordering
        query = query.order('event_date', { ascending: timeFilter !== 'past' });
        
        // Add pagination
        const from = (currentPage - 1) * eventsPerPage;
        const to = from + eventsPerPage - 1;
        
        query = query.range(from, to);
        
        // Execute query
        const { data, error } = await query;
        
        if (error) throw error;
        
        setEvents(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [searchQuery, selectedTypes, timeFilter, currentPage, eventsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(totalEvents / eventsPerPage);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  // Toggle event type selection
  const toggleEventType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
    // Reset to first page when filter changes
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setTimeFilter('all');
    setCurrentPage(1);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when search changes
    setCurrentPage(1);
  };

  // Delete event handler
  const handleDeleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from(TABLES.EVENTS)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state to remove the deleted event
      setEvents(events.filter(event => event.id !== id));
      
      // Update total count
      setTotalEvents(prevTotal => prevTotal - 1);
      
      // If we deleted the last item on the page, go to previous page
      if (events.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  // Get event status
  const getEventStatus = (eventDate) => {
    const today = new Date();
    const date = new Date(eventDate);
    
    if (date < today) {
      return { label: 'Past', className: 'bg-gray-100 text-gray-800' };
    }
    
    if (date.toDateString() === today.toDateString()) {
      return { label: 'Today', className: 'bg-green-100 text-green-800' };
    }
    
    return { label: 'Upcoming', className: 'bg-blue-100 text-blue-800' };
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Add Event Button - Mobile Friendly */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Event Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              {totalEvents} event{totalEvents !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <Link 
            to="/admin/events/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0077B5] hover:bg-[#00588a]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Event
          </Link>
        </div>
        
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-700">{error}</p>
                <button 
                  onClick={() => setError(null)} 
                  className="mt-2 text-xs text-red-700 hover:text-red-900 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Search and Filter Section */}
        <div className="mb-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0077B5]"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <button 
              type="button" 
              onClick={() => setSearchQuery('')}
              className={`absolute inset-y-0 right-0 pr-3 flex items-center ${searchQuery ? 'visible' : 'invisible'}`}
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          </form>
          
          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center px-3 py-2 border rounded-md hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Time Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setTimeFilter('all');
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  timeFilter === 'all' 
                    ? 'bg-[#0077B5] text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setTimeFilter('upcoming');
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  timeFilter === 'upcoming' 
                    ? 'bg-[#0077B5] text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => {
                  setTimeFilter('past');
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  timeFilter === 'past' 
                    ? 'bg-[#0077B5] text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                Past
              </button>
            </div>
          </div>
          
          {/* Advanced Filters Panel */}
          {filterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
              <div className="mb-4">
                <h3 className="font-medium mb-2">Event Type</h3>
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => toggleEventType(type)}
                      className={`px-3 py-1.5 rounded-full text-sm ${
                        selectedTypes.includes(type) 
                          ? 'bg-[#0077B5] text-white' 
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#0077B5] hover:text-[#00588a]"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
          
          {/* Active Filters Display */}
          {(selectedTypes.length > 0 || searchQuery || timeFilter !== 'all') && (
            <div className="mt-2 flex flex-wrap items-center text-sm text-gray-600 gap-2">
              <span className="mr-2">Active filters:</span>
              {timeFilter !== 'all' && (
                <span className="bg-gray-100 rounded-full px-2 py-1 text-xs flex items-center">
                  {timeFilter === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
                  <button 
                    onClick={() => {
                      setTimeFilter('all');
                      setCurrentPage(1);
                    }}
                    className="ml-1 p-0.5 hover:bg-gray-200 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedTypes.map(type => (
                <span key={type} className="bg-[#0077B5]/10 text-[#0077B5] rounded-full px-2 py-1 text-xs flex items-center">
                  {type}
                  <button 
                    onClick={() => toggleEventType(type)}
                    className="ml-1 p-0.5 hover:bg-[#0077B5]/20 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {searchQuery && (
                <span className="bg-gray-100 rounded-full px-2 py-1 text-xs flex items-center">
                  "{searchQuery}"
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="ml-1 p-0.5 hover:bg-gray-200 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <Loader className="h-8 w-8 text-[#0077B5] animate-spin" />
              <p className="mt-2 text-gray-500">Loading events...</p>
            </div>
          </div>
        )}
        
        {/* No Results State */}
        {!loading && events.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedTypes.length > 0 || timeFilter !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Get started by creating your first event.'}
            </p>
            <Link
              to="/admin/events/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0077B5] hover:bg-[#00588a]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Event
            </Link>
          </div>
        )}
        
        {/* Events Table/Cards */}
        {!loading && events.length > 0 && (
          <>
            {/* Desktop Table (Hidden on mobile) */}
            <div className="hidden md:block overflow-hidden rounded-lg border border-gray-200 mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.map((event) => {
                    const status = getEventStatus(event.event_date);
                    return (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {event.image_url ? (
                              <div className="flex-shrink-0 h-10 w-10 rounded bg-gray-200 mr-4">
                                <img 
                                  src={event.image_url} 
                                  alt={event.title}
                                  className="h-10 w-10 rounded object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 h-10 w-10 rounded bg-[#0077B5]/10 flex items-center justify-center mr-4">
                                <Calendar className="h-5 w-5 text-[#0077B5]" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{event.title}</div>
                              {event.event_type && (
                                <div className="text-xs text-gray-500">{event.event_type}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(event.event_date)}
                          {event.event_time && (
                            <div className="text-xs">{event.event_time}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {event.location || 'TBA'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex items-center justify-end space-x-2">
                            <a 
                              href={`/events/${event.id}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-gray-500 hover:text-gray-700"
                              title="View event"
                            >
                              <ExternalLink className="h-5 w-5" />
                            </a>
                            <Link
                              to={`/admin/events/edit/${event.id}`}
                              className="text-[#0077B5] hover:text-[#00588a]"
                              title="Edit event"
                            >
                              <Edit className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete event"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Mobile Cards (Shown on mobile only) */}
            <div className="md:hidden space-y-4 mb-6">
              {events.map((event) => {
                const status = getEventStatus(event.event_date);
                return (
                  <div key={event.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{event.title}</h3>
                          {event.event_type && (
                            <span className="text-xs text-gray-500">{event.event_type}</span>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                          <span>
                            {formatDate(event.event_date)}
                            {event.event_time && ` at ${event.event_time}`}
                          </span>
                        </div>
                        
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                          <span>{event.location || 'Location TBA'}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between border-t border-gray-100 pt-3">
                        <a 
                          href={`/events/${event.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </a>
                        <Link
                          to={`/admin/events/edit/${event.id}`}
                          className="text-[#0077B5] hover:text-[#00588a] text-sm flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-500 hover:text-red-700 text-sm flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-gray-500">
                  Showing {((currentPage - 1) * eventsPerPage) + 1}-{Math.min(currentPage * eventsPerPage, totalEvents)} of {totalEvents} events
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <div className="hidden sm:flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Create a window of pages around current page
                      let pageNum;
                      const totalPageWindows = Math.min(5, totalPages);
                      
                      if (currentPage <= 3) {
                        // Show first 5 pages
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        // Show last 5 pages
                        pageNum = totalPages - totalPageWindows + i + 1;
                      } else {
                        // Show 2 pages before and 2 after current
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            currentPage === pageNum
                              ? 'bg-[#0077B5] text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Simple mobile pagination indicator */}
                  <div className="sm:hidden flex items-center text-sm">
                    <span>Page {currentPage} of {totalPages}</span>
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsManagement;