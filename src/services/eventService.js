// services/eventService.js
import { supabase } from './supabase'
import { TABLES } from './supabase'

export const eventService = {
  // ======================================================
  // READ OPERATIONS
  // ======================================================

  // Get all events with optional filtering and pagination
  getAllEvents: async (options = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        status = null,
        eventType = null,
        sortBy = 'event_date',
        sortOrder = 'asc',
        search = null
      } = options;

      let query = supabase
        .from(TABLES.EVENTS)
        .select('*', { count: 'exact' });

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }

      if (eventType) {
        query = query.eq('event_type', eventType);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data,
        error: null,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
          hasMore: to < count - 1
        }
      };
    } catch (error) {
      return { data: null, error: error.message, pagination: null };
    }
  },

  // Get upcoming events
  getUpcomingEvents: async (limit = 10) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select('*')
        .gte('event_date', today)
        .in('status', ['upcoming', 'ongoing'])
        .order('event_date', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get past events
  getPastEvents: async (limit = 10) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select('*')
        .lt('event_date', today)
        .eq('status', 'completed')
        .order('event_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get featured events
  getFeaturedEvents: async (limit = 5) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select('*')
        .eq('is_featured', true)
        .in('status', ['upcoming', 'ongoing'])
        .order('event_date', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get event by ID
  getEventById: async (eventId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get events by type
  getEventsByType: async (eventType, limit = 10) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select('*')
        .eq('event_type', eventType)
        .order('event_date', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get events by date range
  getEventsByDateRange: async (startDate, endDate) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select('*')
        .gte('event_date', startDate)
        .lte('event_date', endDate)
        .order('event_date', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Search events
  searchEvents: async (searchTerm, limit = 10) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select('*')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
        .order('event_date', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // ======================================================
  // CREATE OPERATIONS
  // ======================================================

  // Create new event
  createEvent: async (eventData) => {
    try {
      // Validate required fields
      const requiredFields = ['title', 'event_date', 'location'];
      for (const field of requiredFields) {
        if (!eventData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .insert([
          {
            title: eventData.title,
            description: eventData.description || null,
            event_date: eventData.event_date,
            event_time: eventData.event_time || null,
            location: eventData.location,
            venue_details: eventData.venue_details || null,
            event_type: eventData.event_type || 'general',
            registration_url: eventData.registration_url || null,
            max_participants: eventData.max_participants || null,
            registration_deadline: eventData.registration_deadline || null,
            is_featured: eventData.is_featured || false,
            status: eventData.status || 'upcoming',
            image_url: eventData.image_url || null
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // ======================================================
  // UPDATE OPERATIONS
  // ======================================================

  // Update event
  updateEvent: async (eventId, updates) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Update event status
  updateEventStatus: async (eventId, status) => {
    try {
      const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status. Must be one of: upcoming, ongoing, completed, cancelled');
      }

      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Toggle featured status
  toggleFeaturedStatus: async (eventId) => {
    try {
      // First get current status
      const { data: currentEvent, error: fetchError } = await supabase
        .from(TABLES.EVENTS)
        .select('is_featured')
        .eq('id', eventId)
        .single();

      if (fetchError) throw fetchError;

      // Update with opposite value
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .update({ 
          is_featured: !currentEvent.is_featured,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Increment participant count
  incrementParticipantCount: async (eventId) => {
    try {
      const { data, error } = await supabase
        .rpc('increment_participants', { event_id: eventId });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Decrement participant count
  decrementParticipantCount: async (eventId) => {
    try {
      const { data, error } = await supabase
        .rpc('decrement_participants', { event_id: eventId });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // ======================================================
  // DELETE OPERATIONS
  // ======================================================

  // Delete event
  deleteEvent: async (eventId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .delete()
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Soft delete event (update status to cancelled)
  softDeleteEvent: async (eventId) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // ======================================================
  // REGISTRATION OPERATIONS
  // ======================================================

  // Register for event (if using internal registration)
  registerForEvent: async (eventId, memberData) => {
    try {
      // Check if event exists and has available spots
      const { data: event, error: eventError } = await this.getEventById(eventId);
      if (eventError) throw new Error(eventError);

      if (!event) {
        throw new Error('Event not found');
      }

      if (event.max_participants && event.current_participants >= event.max_participants) {
        throw new Error('Event is full');
      }

      if (event.registration_deadline && new Date() > new Date(event.registration_deadline)) {
        throw new Error('Registration deadline has passed');
      }

      // Create registration record (assuming you have a registrations table)
      const { data, error } = await supabase
        .from('event_registrations')
        .insert([
          {
            event_id: eventId,
            member_name: memberData.name,
            member_email: memberData.email,
            member_phone: memberData.phone || null,
            organization: memberData.organization || null,
            registration_date: new Date().toISOString(),
            status: 'confirmed'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Increment participant count
      await this.incrementParticipantCount(eventId);

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get event registrations
  getEventRegistrations: async (eventId) => {
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId)
        .order('registration_date', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // ======================================================
  // ANALYTICS & STATISTICS
  // ======================================================

  // Get event statistics
  getEventStats: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get counts by status
      const { data: totalEvents, error: totalError } = await supabase
        .from(TABLES.EVENTS)
        .select('*', { count: 'exact', head: true });

      const { data: upcomingEvents, error: upcomingError } = await supabase
        .from(TABLES.EVENTS)
        .select('*', { count: 'exact', head: true })
        .gte('event_date', today)
        .eq('status', 'upcoming');

      const { data: ongoingEvents, error: ongoingError } = await supabase
        .from(TABLES.EVENTS)
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ongoing');

      const { data: completedEvents, error: completedError } = await supabase
        .from(TABLES.EVENTS)
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      if (totalError || upcomingError || ongoingError || completedError) {
        throw new Error('Failed to fetch statistics');
      }

      return {
        data: {
          total: totalEvents?.count || 0,
          upcoming: upcomingEvents?.count || 0,
          ongoing: ongoingEvents?.count || 0,
          completed: completedEvents?.count || 0
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get events by month for calendar view
  getEventsByMonth: async (year, month) => {
    try {
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of month

      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .select('*')
        .gte('event_date', startDate)
        .lte('event_date', endDate)
        .order('event_date', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // ======================================================
  // UTILITY FUNCTIONS
  // ======================================================

  // Check if event registration is open
  isRegistrationOpen: (event) => {
    const now = new Date();
    const eventDate = new Date(event.event_date);
    const registrationDeadline = event.registration_deadline 
      ? new Date(event.registration_deadline) 
      : eventDate;

    return now < registrationDeadline && 
           event.status === 'upcoming' &&
           (!event.max_participants || event.current_participants < event.max_participants);
  },

  // Check if event is full
  isEventFull: (event) => {
    return event.max_participants && event.current_participants >= event.max_participants;
  },

  // Get time until event
  getTimeUntilEvent: (eventDate) => {
    const now = new Date();
    const event = new Date(eventDate);
    const diff = event - now;

    if (diff < 0) return 'Event has passed';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} days ${hours} hours`;
    if (hours > 0) return `${hours} hours ${minutes} minutes`;
    return `${minutes} minutes`;
  },

  // Format event for display
  formatEventForDisplay: (event) => {
    return {
      ...event,
      formattedDate: new Date(event.event_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      formattedTime: event.event_time 
        ? new Date(`2000-01-01T${event.event_time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        : null,
      timeUntilEvent: this.getTimeUntilEvent(event.event_date),
      isRegistrationOpen: this.isRegistrationOpen(event),
      isFull: this.isEventFull(event),
      spotsRemaining: event.max_participants 
        ? event.max_participants - event.current_participants 
        : null
    };
  }
};

// Export individual functions for easier importing
export const {
  getAllEvents,
  getUpcomingEvents,
  getPastEvents,
  getFeaturedEvents,
  getEventById,
  getEventsByType,
  getEventsByDateRange,
  searchEvents,
  createEvent,
  updateEvent,
  updateEventStatus,
  toggleFeaturedStatus,
  deleteEvent,
  softDeleteEvent,
  registerForEvent,
  getEventRegistrations,
  getEventStats,
  getEventsByMonth,
  isRegistrationOpen,
  isEventFull,
  getTimeUntilEvent,
  formatEventForDisplay
} = eventService;