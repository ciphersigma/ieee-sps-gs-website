// scripts/initData.js
const mongoose = require('mongoose');
const { ResearchArea, ResearchProject, ResearchPublication, ResearchStats } = require('../models/Research');
require('dotenv').config();

async function initializeData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if data already exists
    const existingAreas = await ResearchArea.countDocuments();
    if (existingAreas > 0) {
      console.log('Data already exists, skipping initialization');
      return;
    }

    // Create research areas
    const areas = await ResearchArea.insertMany([
      {
        title: 'Machine Learning for Signal Processing',
        description: 'Advanced ML techniques for signal analysis and processing applications.',
        icon: 'Brain',
        color: 'from-blue-500 to-purple-600',
        projects_count: 12,
        publications_count: 25
      },
      {
        title: 'Biomedical Signal Processing',
        description: 'Processing physiological signals for healthcare and medical diagnostics.',
        icon: 'Zap',
        color: 'from-green-500 to-blue-500',
        projects_count: 8,
        publications_count: 18
      }
    ]);

    // Create research projects
    const projects = await ResearchProject.insertMany([
      {
        title: 'AI-Powered ECG Analysis System',
        description: 'Developing machine learning algorithms for automated ECG interpretation.',
        research_area: 'Biomedical Signal Processing',
        institution: 'IIT Gandhinagar',
        status: 'ongoing',
        funding: 'DST-SERB',
        duration: '2023-2025',
        featured: true
      }
    ]);

    // Create research publications
    const publications = await ResearchPublication.insertMany([
      {
        title: 'Transformer-based ECG Classification',
        authors: 'Patel, A., Shah, B., Mehta, C.',
        journal: 'IEEE Transactions on Biomedical Engineering',
        year: 2024,
        type: 'journal',
        citations: 15,
        featured: true
      }
    ]);

    // Create research stats
    await ResearchStats.create({
      total_projects: 60,
      total_publications: 130,
      total_collaborations: 25,
      total_awards: 15
    });

    console.log('✅ Default data initialized successfully');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

initializeData();