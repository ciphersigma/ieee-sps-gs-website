// src/utils/migration.js
import { researchAPI } from '../services/api';

const defaultResearchAreas = [
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
  },
  {
    title: 'Digital Image Processing',
    description: 'Computer vision and digital image analysis for various applications.',
    icon: 'Camera',
    color: 'from-purple-500 to-pink-500',
    projects_count: 6,
    publications_count: 12
  },
  {
    title: 'Wireless Communications',
    description: 'Signal processing techniques for wireless communication systems.',
    icon: 'Radio',
    color: 'from-orange-500 to-red-500',
    projects_count: 10,
    publications_count: 20
  }
];

const defaultProjects = [
  {
    title: 'AI-Powered ECG Analysis System',
    description: 'Developing machine learning algorithms for automated ECG interpretation and arrhythmia detection.',
    research_area: 'Biomedical Signal Processing',
    institution: 'IIT Gandhinagar',
    status: 'ongoing',
    funding: 'DST-SERB',
    duration: '2023-2025',
    featured: true
  },
  {
    title: 'Deep Learning for Medical Image Segmentation',
    description: 'Advanced neural networks for precise medical image segmentation and diagnosis.',
    research_area: 'Digital Image Processing',
    institution: 'DAIICT',
    status: 'ongoing',
    funding: 'GUJCOST',
    duration: '2024-2026',
    featured: true
  },
  {
    title: '5G Signal Processing Optimization',
    description: 'Optimizing signal processing algorithms for 5G wireless communication systems.',
    research_area: 'Wireless Communications',
    institution: 'NIT Surat',
    status: 'completed',
    funding: 'Industry Sponsored',
    duration: '2022-2024',
    featured: false
  }
];

const defaultPublications = [
  {
    title: 'Transformer-based ECG Classification for Arrhythmia Detection',
    authors: 'Patel, A., Shah, B., Mehta, C.',
    journal: 'IEEE Transactions on Biomedical Engineering',
    year: 2024,
    type: 'journal',
    citations: 15,
    featured: true
  },
  {
    title: 'Deep Learning Approaches for Medical Image Analysis',
    authors: 'Kumar, R., Sharma, S., Gupta, M.',
    journal: 'IEEE Transactions on Medical Imaging',
    year: 2024,
    type: 'journal',
    citations: 8,
    featured: true
  },
  {
    title: 'Signal Processing Techniques for 5G Networks',
    authors: 'Singh, P., Joshi, V., Agarwal, N.',
    conference: 'IEEE International Conference on Communications',
    year: 2023,
    type: 'conference',
    citations: 12,
    featured: false
  }
];

const defaultStats = {
  total_projects: 60,
  total_publications: 130,
  total_collaborations: 25,
  total_awards: 15
};

export const migration = {
  async initializeDefaultResearchData() {
    try {
      console.log('Starting research data initialization...');
      
      // Initialize research areas
      const areaPromises = defaultResearchAreas.map(area => 
        researchAPI.createArea(area).catch(err => ({ error: err.message, area: area.title }))
      );
      const areaResults = await Promise.all(areaPromises);
      
      // Initialize projects
      const projectPromises = defaultProjects.map(project => 
        researchAPI.createProject(project).catch(err => ({ error: err.message, project: project.title }))
      );
      const projectResults = await Promise.all(projectPromises);
      
      // Initialize publications
      const publicationPromises = defaultPublications.map(publication => 
        researchAPI.createPublication(publication).catch(err => ({ error: err.message, publication: publication.title }))
      );
      const publicationResults = await Promise.all(publicationPromises);
      
      // Initialize stats
      const statsResult = await researchAPI.updateStats(defaultStats).catch(err => ({ error: err.message }));
      
      const errors = [
        ...areaResults.filter(r => r.error),
        ...projectResults.filter(r => r.error),
        ...publicationResults.filter(r => r.error),
        ...(statsResult.error ? [statsResult] : [])
      ];
      
      if (errors.length > 0) {
        console.warn('Some items failed to initialize:', errors);
        return {
          success: true,
          message: `Initialization completed with ${errors.length} warnings. Check console for details.`,
          errors
        };
      }
      
      return {
        success: true,
        message: 'All research data initialized successfully!',
        data: {
          areas: areaResults.length,
          projects: projectResults.length,
          publications: publicationResults.length,
          stats: statsResult ? 1 : 0
        }
      };
      
    } catch (error) {
      console.error('Migration failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async clearAllResearchData() {
    try {
      console.log('Clearing all research data...');
      
      // This would need to be implemented based on your API endpoints
      // For now, return a placeholder
      return {
        success: false,
        error: 'Clear data functionality not implemented yet'
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async exportData() {
    try {
      console.log('Exporting data...');
      
      const [areas, projects, publications, stats] = await Promise.all([
        researchAPI.getAreas(),
        researchAPI.getProjects(),
        researchAPI.getPublications(),
        researchAPI.getStats()
      ]);
      
      const exportData = {
        timestamp: new Date().toISOString(),
        data: {
          researchAreas: areas.data,
          projects: projects.data,
          publications: publications.data,
          stats: stats.data
        }
      };
      
      return {
        success: true,
        data: exportData
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default migration;