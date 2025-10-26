// services/eventService.js
import { supabase } from './supabase'
import { TABLES } from './supabase'
import { uploadEventPoster, deleteEventPoster } from './storageService'

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
  createEvent: async (eventData, posterFile = null) => {
    try {
      // Validate required fields
      const requiredFields = ['title', 'event_date', 'location'];
      for (const field of requiredFields) {
        if (!eventData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Upload poster image if provided
      let posterUrl = eventData.image_url;
      if (posterFile) {
        const { url, error: uploadError } = await uploadEventPoster(posterFile);
        if (uploadError) throw uploadError;
        posterUrl = url;
      }

      // Create event with poster URL
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
            image_url: posterUrl,
            poster_url: eventData.poster_url || null, // Support separate poster if needed
            current_participants: 0
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
  updateEvent: async (eventId, updates, posterFile = null) => {
    try {
      // Get current event data if we're updating the poster
      let currentEvent = null;
      if (posterFile) {
        const { data, error: fetchError } = await this.getEventById(eventId);
        if (fetchError) throw fetchError;
        currentEvent = data;
      }

      // Upload new poster if provided
      if (posterFile) {
        // Delete old poster if it exists
        if (currentEvent?.image_url) {
          await deleteEventPoster(currentEvent.image_url);
        }

        // Upload new poster
        const { url, error: uploadError } = await uploadEventPoster(posterFile);
        if (uploadError) throw uploadError;
        
        // Add poster URL to updates
        updates.image_url = url;
      }

      // Update the event
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

  // Update event poster
  updateEventPoster: async (eventId, posterFile) => {
    try {
      if (!posterFile) {
        throw new Error('No poster file provided');
      }

      // Get current event data
      const { data: currentEvent, error: fetchError } = await this.getEventById(eventId);
      if (fetchError) throw fetchError;

      // Delete old poster if it exists
      if (currentEvent?.image_url) {
        await deleteEventPoster(currentEvent.image_url);
      }

      // Upload new poster
      const { url, error: uploadError } = await uploadEventPoster(posterFile);
      if (uploadError) throw uploadError;

      // Update event with new poster URL
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .update({ 
          image_url: url,
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

  // Remove event poster
  removeEventPoster: async (eventId) => {
    try {
      // Get current event data
      const { data: currentEvent, error: fetchError } = await this.getEventById(eventId);
      if (fetchError) throw fetchError;

      // Delete poster from storage if it exists
      if (currentEvent?.image_url) {
        await deleteEventPoster(currentEvent.image_url);
      }

      // Update event to remove poster URL
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .update({ 
          image_url: null,
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

  // Update participant count manually (admin function)
  updateParticipantCount: async (eventId, count) => {
    try {
      if (count < 0) {
        throw new Error('Participant count cannot be negative');
      }

      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .update({ 
          current_participants: count,
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
  // DELETE OPERATIONS
  // ======================================================

  // Delete event
  deleteEvent: async (eventId) => {
    try {
      // Get event details first to access the poster URL
      const { data: event, error: fetchError } = await this.getEventById(eventId);
      if (fetchError) throw fetchError;

      // Delete the event poster from storage if it exists
      if (event?.image_url) {
        await deleteEventPoster(event.image_url);
      }

      // Delete the event from the database
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
      // Validate required member data
      if (!memberData?.name || !memberData?.email) {
        throw new Error('Name and email are required for registration');
      }

      // Check if event exists and has available spots
      const { data: event, error: eventError } = await this.getEventById(eventId);
      if (eventError) throw new Error(`Failed to fetch event: ${eventError}`);

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
  // ADMIN FUNCTIONS
  // ======================================================

  // Get all events for admin (includes all statuses and detailed info)
  getEventsForAdmin: async (options = {}) => {
    try {
      const {
        page = 1,
        limit = 20,
        status = null,
        eventType = null,
        sortBy = 'created_at',
        sortOrder = 'desc',
        search = null,
        dateFrom = null,
        dateTo = null
      } = options;

      let query = supabase
        .from(TABLES.EVENTS)
        .select(`
          *,
          event_registrations(count)
        `, { count: 'exact' });

      // Apply filters
      if (status) query = query.eq('status', status);
      if (eventType) query = query.eq('event_type', eventType);
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`);
      }
      if (dateFrom) query = query.gte('event_date', dateFrom);
      if (dateTo) query = query.lte('event_date', dateTo);

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

  // Bulk update event status
  bulkUpdateEventStatus: async (eventIds, status) => {
    try {
      const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
      }

      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .in('id', eventIds)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Bulk delete events
  bulkDeleteEvents: async (eventIds) => {
    try {
      // Get events to delete their posters
      const { data: events, error: fetchError } = await supabase
        .from(TABLES.EVENTS)
        .select('image_url')
        .in('id', eventIds);

      if (fetchError) throw fetchError;

      // Delete posters from storage
      for (const event of events) {
        if (event.image_url) {
          await deleteEventPoster(event.image_url);
        }
      }

      // Delete events from database
      const { data, error } = await supabase
        .from(TABLES.EVENTS)
        .delete()
        .in('id', eventIds)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get admin dashboard stats
  getAdminDashboardStats: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const thisMonth = new Date().toISOString().slice(0, 7);

      // Get various counts
      const [totalEvents, upcomingEvents, thisMonthEvents, featuredEvents, registrations] = await Promise.all([
        supabase.from(TABLES.EVENTS).select('*', { count: 'exact', head: true }),
        supabase.from(TABLES.EVENTS).select('*', { count: 'exact', head: true })
          .gte('event_date', today).eq('status', 'upcoming'),
        supabase.from(TABLES.EVENTS).select('*', { count: 'exact', head: true })
          .gte('event_date', thisMonth + '-01').lt('event_date', thisMonth + '-32'),
        supabase.from(TABLES.EVENTS).select('*', { count: 'exact', head: true })
          .eq('is_featured', true),
        supabase.from('event_registrations').select('*', { count: 'exact', head: true })
      ]);

      // Get recent events
      const { data: recentEvents } = await supabase
        .from(TABLES.EVENTS)
        .select('id, title, event_date, status, current_participants')
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        data: {
          totalEvents: totalEvents.count || 0,
          upcomingEvents: upcomingEvents.count || 0,
          thisMonthEvents: thisMonthEvents.count || 0,
          featuredEvents: featuredEvents.count || 0,
          totalRegistrations: registrations.count || 0,
          recentEvents: recentEvents || []
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Get event analytics
  getEventAnalytics: async (eventId) => {
    try {
      const { data: event, error: eventError } = await this.getEventById(eventId);
      if (eventError) throw eventError;

      const { data: registrations, error: regError } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventId);

      if (regError) throw regError;

      // Calculate analytics
      const analytics = {
        totalRegistrations: registrations.length,
        registrationRate: event.max_participants 
          ? (registrations.length / event.max_participants * 100).toFixed(1)
          : null,
        dailyRegistrations: {},
        organizationBreakdown: {},
        registrationTrend: []
      };

      // Group registrations by date
      registrations.forEach(reg => {
        const date = reg.registration_date.split('T')[0];
        analytics.dailyRegistrations[date] = (analytics.dailyRegistrations[date] || 0) + 1;
        
        if (reg.organization) {
          analytics.organizationBreakdown[reg.organization] = 
            (analytics.organizationBreakdown[reg.organization] || 0) + 1;
        }
      });

      return { data: { event, analytics }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Export events data
  exportEventsData: async (filters = {}) => {
    try {
      let query = supabase
        .from(TABLES.EVENTS)
        .select(`
          *,
          event_registrations(*)
        `);

      // Apply filters
      if (filters.status) query = query.eq('status', filters.status);
      if (filters.eventType) query = query.eq('event_type', filters.eventType);
      if (filters.dateFrom) query = query.gte('event_date', filters.dateFrom);
      if (filters.dateTo) query = query.lte('event_date', filters.dateTo);

      const { data, error } = await query.order('event_date', { ascending: false });
      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  // Duplicate event
  duplicateEvent: async (eventId, updates = {}) => {
    try {
      const { data: originalEvent, error: fetchError } = await this.getEventById(eventId);
      if (fetchError) throw fetchError;

      // Remove fields that shouldn't be duplicated
      const { id, created_at, updated_at, current_participants, ...eventData } = originalEvent;
      
      // Apply updates and set new defaults
      const newEventData = {
        ...eventData,
        ...updates,
        title: updates.title || `${eventData.title} (Copy)`,
        status: 'upcoming',
        current_participants: 0,
        is_featured: false
      };

      return await this.createEvent(newEventData);
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
      timeUntilEvent: eventService.getTimeUntilEvent(event.event_date),
      isRegistrationOpen: eventService.isRegistrationOpen(event),
      isFull: eventService.isEventFull(event),
      spotsRemaining: event.max_participants 
        ? event.max_participants - event.current_participants 
        : null,
      hasPoster: !!event.image_url
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
  updateEventPoster,
  removeEventPoster,
  toggleFeaturedStatus,
  deleteEvent,
  softDeleteEvent,
  registerForEvent,
  getEventRegistrations,
  getEventStats,
  getEventsByMonth,
  // Admin functions
  getEventsForAdmin,
  bulkUpdateEventStatus,
  bulkDeleteEvents,
  getAdminDashboardStats,
  getEventAnalytics,
  exportEventsData,
  duplicateEvent,
  updateParticipantCount,
  incrementParticipantCount,
  decrementParticipantCount,
  // Utility functions
  isRegistrationOpen,
  isEventFull,
  getTimeUntilEvent,
  formatEventForDisplay
} = eventService;