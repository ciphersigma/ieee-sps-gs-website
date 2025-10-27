// scripts/initAllData.js
const mongoose = require('mongoose');
const { ResearchArea, ResearchProject, ResearchPublication, ResearchStats } = require('../models/Research');
const { Member, ExecutiveCommittee, News, Gallery, Achievement, SiteStats, CarouselImage, UserRole } = require('../models/Website');
require('dotenv').config();

async function initializeAllData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Initialize Executive Committee
    const existingCommittee = await ExecutiveCommittee.countDocuments();
    if (existingCommittee === 0) {
      await ExecutiveCommittee.insertMany([
        {
          name: 'Dr. John Smith',
          position: 'Chair',
          email: 'chair@ieee-sps-gujarat.org',
          institution: 'IIT Gandhinagar',
          order: 1,
          bio: 'Leading researcher in signal processing with 15+ years of experience.'
        },
        {
          name: 'Dr. Jane Doe',
          position: 'Vice Chair',
          email: 'vicechair@ieee-sps-gujarat.org',
          institution: 'DA-IICT',
          order: 2,
          bio: 'Expert in machine learning and biomedical signal processing.'
        }
      ]);
      console.log('✅ Executive committee initialized');
    }

    // Initialize News
    const existingNews = await News.countDocuments();
    if (existingNews === 0) {
      await News.insertMany([
        {
          title: 'IEEE SPS Gujarat Chapter Launched',
          content: 'We are excited to announce the launch of IEEE Signal Processing Society Gujarat Chapter...',
          excerpt: 'Official launch of IEEE SPS Gujarat Chapter',
          published: true,
          featured: true,
          author: 'Admin',
          tags: ['announcement', 'launch']
        },
        {
          title: 'Upcoming Workshop on Machine Learning',
          content: 'Join us for an intensive workshop on machine learning applications in signal processing...',
          excerpt: 'Workshop announcement for ML in signal processing',
          published: true,
          author: 'Events Team',
          tags: ['workshop', 'machine-learning']
        }
      ]);
      console.log('✅ News articles initialized');
    }

    // Initialize Carousel
    const existingCarousel = await CarouselImage.countDocuments();
    if (existingCarousel === 0) {
      await CarouselImage.insertMany([
        {
          title: 'Welcome to IEEE SPS Gujarat',
          description: 'Advancing signal processing research and education',
          image_url: '/images/carousel/slide1.jpg',
          order: 1,
          is_active: true
        },
        {
          title: 'Research Excellence',
          description: 'Cutting-edge research in signal processing',
          image_url: '/images/carousel/slide2.jpg',
          order: 2,
          is_active: true
        }
      ]);
      console.log('✅ Carousel images initialized');
    }

    // Initialize Site Stats
    const existingStats = await SiteStats.countDocuments();
    if (existingStats === 0) {
      await SiteStats.create({
        total_members: 150,
        total_events: 25,
        total_publications: 130,
        total_projects: 60,
        page_views: 5000
      });
      console.log('✅ Site statistics initialized');
    }

    // Initialize User Roles
    const existingUsers = await UserRole.countDocuments();
    if (existingUsers === 0) {
      await UserRole.insertMany([
        {
          email: 'admin@ieee-sps-gujarat.org',
          role: 'super_admin',
          name: 'Super Admin',
          permissions: ['all']
        },
        {
          email: 'editor@ieee-sps-gujarat.org',
          role: 'editor',
          name: 'Content Editor',
          permissions: ['content', 'news', 'gallery']
        }
      ]);
      console.log('✅ User roles initialized');
    }

    // Initialize Achievements
    const existingAchievements = await Achievement.countDocuments();
    if (existingAchievements === 0) {
      await Achievement.insertMany([
        {
          title: 'Best Paper Award',
          description: 'Received best paper award at IEEE ICASSP 2024',
          category: 'award',
          date: new Date('2024-04-15'),
          recipient: 'Dr. John Smith',
          organization: 'IEEE ICASSP',
          featured: true
        },
        {
          title: 'Research Grant Awarded',
          description: 'Secured DST-SERB research grant for signal processing project',
          category: 'project',
          date: new Date('2024-03-01'),
          recipient: 'IEEE SPS Gujarat Chapter',
          organization: 'DST-SERB'
        }
      ]);
      console.log('✅ Achievements initialized');
    }

    console.log('🎉 All data initialized successfully!');

  } catch (error) {
    console.error('❌ Error initializing data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

initializeAllData();