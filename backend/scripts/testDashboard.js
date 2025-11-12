// Test script for dashboard endpoints
const mongoose = require('mongoose');
const { Event, News, UserRole } = require('../models/Website');
const User = require('../models/User');
const Branch = require('../models/Branch');

require('dotenv').config();

async function createTestData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create test events
    const testEvents = [
      {
        title: 'IEEE SPS Workshop on Signal Processing',
        description: 'Advanced signal processing techniques workshop',
        event_date: new Date('2024-02-15'),
        location: 'Gujarat University',
        status: 'upcoming',
        is_active: true
      },
      {
        title: 'Research Symposium 2024',
        description: 'Annual research presentation event',
        event_date: new Date('2024-03-20'),
        location: 'IIT Gandhinagar',
        status: 'upcoming',
        is_active: true
      }
    ];

    for (const eventData of testEvents) {
      const existingEvent = await Event.findOne({ title: eventData.title });
      if (!existingEvent) {
        await Event.create(eventData);
        console.log(`Created event: ${eventData.title}`);
      }
    }

    // Create test news
    const testNews = [
      {
        title: 'IEEE SPS Gujarat Chapter Launches New Initiative',
        content: 'We are excited to announce our new student outreach program...',
        published: true,
        author: 'Admin'
      },
      {
        title: 'Upcoming Conference on Machine Learning',
        content: 'Join us for an exciting conference on the latest ML trends...',
        published: true,
        author: 'Admin'
      }
    ];

    for (const newsData of testNews) {
      const existingNews = await News.findOne({ title: newsData.title });
      if (!existingNews) {
        await News.create(newsData);
        console.log(`Created news: ${newsData.title}`);
      }
    }

    // Create test user roles
    const testUsers = [
      {
        email: 'admin@ieee-sps-gujarat.org',
        role: 'member',
        name: 'Test Member',
        is_active: true
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await UserRole.findOne({ email: userData.email });
      if (!existingUser) {
        await UserRole.create(userData);
        console.log(`Created user role: ${userData.email}`);
      }
    }

    console.log('Test data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
}

createTestData();