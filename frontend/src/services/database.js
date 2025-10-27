// src/services/database.js - MongoDB Only
import { researchAPI, eventsAPI, membersAPI, contentAPI, adminAPI } from './api';

class DatabaseService {
  constructor() {
    console.log('Database service initialized: MongoDB');
  }

  // Events
  async getEvents(options = {}) {
    try {
      const params = {};
      if (options.status) params.status = options.status;
      if (options.upcoming) params.upcoming = 'true';
      
      const response = await eventsAPI.getEvents(params);
      const data = response.data.map(item => ({ ...item, id: item._id }));
      
      return { 
        data: options.limit ? data.slice(0, options.limit) : data, 
        error: null,
        count: data.length
      };
    } catch (error) {
      return { data: [], error: error.message, count: 0 };
    }
  }

  async createEvent(eventData) {
    try {
      const response = await eventsAPI.createEvent(eventData);
      return { data: { ...response.data, id: response.data._id }, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || error.message };
    }
  }

  async updateEvent(id, eventData) {
    try {
      const response = await eventsAPI.updateEvent(id, eventData);
      return { data: { ...response.data, id: response.data._id }, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || error.message };
    }
  }

  async deleteEvent(id) {
    try {
      await eventsAPI.deleteEvent(id);
      return { data: { deletedCount: 1 }, error: null };
    } catch (error) {
      return { data: null, error: error.response?.data?.error || error.message };
    }
  }

  // Research Areas
  async getResearchAreas() {
    try {
      const response = await researchAPI.getAreas();
      return { data: response.data.map(item => ({ ...item, id: item._id })), error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }

  async createResearchArea(areaData) {
    try {
      const response = await researchAPI.createArea(areaData);
      return { data: { ...response.data, id: response.data._id }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async updateResearchArea(id, areaData) {
    try {
      const response = await researchAPI.updateArea(id, areaData);
      return { data: { ...response.data, id: response.data._id }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async deleteResearchArea(id) {
    try {
      await researchAPI.deleteArea(id);
      return { data: { deletedCount: 1 }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // Research Projects
  async getResearchProjects(featured = false) {
    try {
      const response = await researchAPI.getProjects(featured);
      return { data: response.data.map(item => ({ ...item, id: item._id })), error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }

  async createResearchProject(projectData) {
    try {
      const response = await researchAPI.createProject(projectData);
      return { data: { ...response.data, id: response.data._id }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async updateResearchProject(id, projectData) {
    try {
      const response = await researchAPI.updateProject(id, projectData);
      return { data: { ...response.data, id: response.data._id }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async deleteResearchProject(id) {
    try {
      await researchAPI.deleteProject(id);
      return { data: { deletedCount: 1 }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // Research Publications
  async getResearchPublications(featured = false) {
    try {
      const response = await researchAPI.getPublications(featured);
      return { data: response.data.map(item => ({ ...item, id: item._id })), error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }

  async createResearchPublication(publicationData) {
    try {
      const response = await researchAPI.createPublication(publicationData);
      return { data: { ...response.data, id: response.data._id }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async updateResearchPublication(id, publicationData) {
    try {
      const response = await researchAPI.updatePublication(id, publicationData);
      return { data: { ...response.data, id: response.data._id }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async deleteResearchPublication(id) {
    try {
      await researchAPI.deletePublication(id);
      return { data: { deletedCount: 1 }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // Research Stats
  async getResearchStats() {
    try {
      const response = await researchAPI.getStats();
      return { data: { ...response.data, id: response.data._id }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  async updateResearchStats(statsData) {
    try {
      const response = await researchAPI.updateStats(statsData);
      return { data: { ...response.data, id: response.data._id }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // Members
  async getMembers() {
    try {
      const response = await membersAPI.getMembers();
      return { data: response.data.map(item => ({ ...item, id: item._id })), error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }

  async getExecutiveCommittee() {
    try {
      const response = await membersAPI.getExecutive();
      return { data: response.data.map(item => ({ ...item, id: item._id })), error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }

  // News
  async getNews(published = false) {
    try {
      const params = published ? { published: 'true' } : {};
      const response = await contentAPI.getNews(params);
      return { data: response.data.map(item => ({ ...item, id: item._id })), error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }

  // Gallery
  async getGallery() {
    try {
      const response = await contentAPI.getGallery();
      return { data: response.data.map(item => ({ ...item, id: item._id })), error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }

  // Carousel
  async getCarousel() {
    try {
      const response = await adminAPI.getCarousel();
      return { data: response.data.map(item => ({ ...item, id: item._id })), error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  }

  // Contact Messages
  async createContactMessage(messageData) {
    try {
      const response = await contentAPI.createContactMessage(messageData);
      return { data: { ...response.data, id: response.data._id }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }

  // Generic count method
  async count(collection) {
    try {
      if (collection === 'events') {
        const response = await eventsAPI.getEventsCount();
        return { data: response.data.count, error: null };
      }
      const result = await this.getEvents();
      return { data: result.count, error: null };
    } catch (error) {
      return { data: 0, error: error.message };
    }
  }
}

export const db = new DatabaseService();
export default db;