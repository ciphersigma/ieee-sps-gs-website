// src/services/eventService.js

export const eventService = {
  formatEventForDisplay: (event) => {
    // Handle different date formats
    let eventDate;
    if (event.event_date) {
      eventDate = new Date(event.event_date);
    } else if (event.date) {
      eventDate = new Date(event.date);
    } else {
      eventDate = new Date(); // fallback to current date
    }
    
    // Check if date is valid
    if (isNaN(eventDate.getTime())) {
      eventDate = new Date(); // fallback to current date if invalid
    }
    
    const now = new Date();
    
    // Format date
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Format time
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    // Calculate time until event
    const timeDiff = eventDate - now;
    let timeUntilEvent = 'Event has passed';
    
    if (timeDiff > 0) {
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) {
        timeUntilEvent = `${days} day${days > 1 ? 's' : ''} remaining`;
      } else if (hours > 0) {
        timeUntilEvent = `${hours} hour${hours > 1 ? 's' : ''} remaining`;
      } else {
        timeUntilEvent = 'Starting soon';
      }
    }
    
    // Check registration status
    const isRegistrationOpen = event.status === 'upcoming' && timeDiff > 0;
    const isFull = event.max_participants && 
                   event.current_participants >= event.max_participants;
    
    return {
      formattedDate,
      formattedTime,
      timeUntilEvent,
      isRegistrationOpen: isRegistrationOpen && !isFull,
      isFull
    };
  }
};