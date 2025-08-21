// hooks/useEvents.js
import { useState, useEffect, useCallback } from 'react';
import { eventService } from '../services/eventService';

// Hook for fetching all events with filtering and pagination
export const useEvents = (options = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await eventService.getAllEvents(options);
      if (result.error) {
        setError(result.error);
      } else {
        setEvents(result.data || []);
        setPagination(result.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(options)]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const refetch = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    pagination,
    refetch
  };
};

// Hook for fetching upcoming events
export const useUpcomingEvents = (limit = 10) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await eventService.getUpcomingEvents(limit);
        if (result.error) {
          setError(result.error);
        } else {
          setEvents(result.data || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, [limit]);

  return { events, loading, error };
};

// Hook for fetching featured events
export const useFeaturedEvents = (limit = 5) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await eventService.getFeaturedEvents(limit);
        if (result.error) {
          setError(result.error);
        } else {
          setEvents(result.data || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, [limit]);

  return { events, loading, error };
};

// Hook for fetching a single event
export const useEvent = (eventId) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await eventService.getEventById(eventId);
        if (result.error) {
          setError(result.error);
        } else {
          setEvent(result.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return { event, loading, error };
};

// Hook for event statistics
export const useEventStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await eventService.getEventStats();
        if (result.error) {
          setError(result.error);
        } else {
          setStats(result.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

// Hook for event search
export const useEventSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchEvents = useCallback(async (searchTerm, limit = 10) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await eventService.searchEvents(searchTerm, limit);
      if (result.error) {
        setError(result.error);
      } else {
        setSearchResults(result.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    loading,
    error,
    searchEvents,
    clearSearch
  };
};

// Hook for event management (admin operations)
export const useEventManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createEvent = useCallback(async (eventData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await eventService.createEvent(eventData);
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      return { success: true, data: result.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (eventId, updates) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await eventService.updateEvent(eventId, updates);
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      return { success: true, data: result.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEvent = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await eventService.deleteEvent(eventId);
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEventStatus = useCallback(async (eventId, status) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await eventService.updateEventStatus(eventId, status);
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      return { success: true, data: result.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFeaturedStatus = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await eventService.toggleFeaturedStatus(eventId);
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      return { success: true, data: result.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    updateEventStatus,
    toggleFeaturedStatus
  };
};

// Hook for event registration
export const useEventRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerForEvent = useCallback(async (eventId, memberData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await eventService.registerForEvent(eventId, memberData);
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      return { success: true, data: result.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventRegistrations = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await eventService.getEventRegistrations(eventId);
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      return { success: true, data: result.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    registerForEvent,
    getEventRegistrations
  };
};

// Hook for calendar view
export const useEventCalendar = (year, month) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthEvents = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await eventService.getEventsByMonth(year, month);
        if (result.error) {
          setError(result.error);
        } else {
          setEvents(result.data || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (year && month) {
      fetchMonthEvents();
    }
  }, [year, month]);

  return { events, loading, error };
};

// Hook for real-time event updates (using Supabase subscriptions)
export const useRealTimeEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial fetch
    const fetchInitialEvents = async () => {
      try {
        const result = await eventService.getAllEvents({ limit: 100 });
        if (result.error) {
          setError(result.error);
        } else {
          setEvents(result.data || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialEvents();

    // Subscribe to real-time changes
    const subscription = eventService.supabase
      .channel('events_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'events' 
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEvents(prev => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setEvents(prev => 
              prev.map(event => 
                event.id === payload.new.id ? payload.new : event
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setEvents(prev => 
              prev.filter(event => event.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { events, loading, error };
};