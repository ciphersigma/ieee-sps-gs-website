'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Users, Award, ExternalLink, 
  ChevronRight, Search, Filter, Calendar,
  Brain, Zap, Radio, Eye, Mic, BarChart3
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { api } from '@/services/api';

interface ResearchArea {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  projects_count: number;
  publications_count: number;
}

interface ResearchProject {
  title: string;
  research_area: string;
  institution: string;
  status: string;
  description: string;
  funding: string;
  duration: string;
}

interface Publication {
  title: string;
  authors: string;
  journal: string;
  year: number;
  type: string;
  citations: number;
}

interface ResearchStats {
  total_projects: number;
  total_publications: number;
  total_collaborations: number;
  total_awards: number;
}

export default function ResearchPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<ResearchProject[]>([]);
  const [recentPublications, setRecentPublications] = useState<Publication[]>([]);
  const [stats, setStats] = useState<ResearchStats>({
    total_projects: 60,
    total_publications: 130,
    total_collaborations: 25,
    total_awards: 15
  });

  // Icon mapping for dynamic icons
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    Brain, Zap, Radio, Eye, Mic, BarChart3
  };

  // Fetch data from API
  useEffect(() => {
    fetchResearchData();
  }, []);

  const fetchResearchData = async () => {
    try {
      setLoading(true);
      
      const [areasResult, projectsResult, publicationsResult, statsResult] = await Promise.all([
        api.getResearchAreas(),
        api.getResearchProjects(),
        api.getResearchPublications(),
        api.getResearchStats()
      ]);

      setResearchAreas(areasResult || getDefaultResearchAreas());
      setFeaturedProjects((projectsResult || getDefaultProjects()).slice(0, 3));
      setRecentPublications((publicationsResult || getDefaultPublications()).slice(0, 3));
      setStats(statsResult || {
        total_projects: 60,
        total_publications: 130,
        total_collaborations: 25,
        total_awards: 15
      });
    } catch (error) {
      console.error('Error fetching research data:', error);
      // Fallback to default data if API fails
      setResearchAreas(getDefaultResearchAreas());
      setFeaturedProjects(getDefaultProjects());
      setRecentPublications(getDefaultPublications());
    } finally {
      setLoading(false);
    }
  };

  // Default data fallbacks
  const getDefaultResearchAreas = (): ResearchArea[] => [
    {
      id: 'ml-sp',
      title: 'Machine Learning for Signal Processing',
      description: 'Advanced ML techniques for signal analysis and processing applications.',
      icon: 'Brain',
      color: 'from-blue-500 to-purple-600',
      projects_count: 12,
      publications_count: 25
    },
    {
      id: 'biomedical',
      title: 'Biomedical Signal Processing',
      description: 'Processing physiological signals for healthcare and medical diagnostics.',
      icon: 'Zap',
      color: 'from-green-500 to-blue-500',
      projects_count: 8,
      publications_count: 18
    },
    {
      id: 'communications',
      title: 'Communication Systems',
      description: 'Signal processing for 5G/6G networks and wireless communications.',
      icon: 'Radio',
      color: 'from-purple-500 to-pink-500',
      projects_count: 15,
      publications_count: 32
    }
  ];

  const getDefaultProjects = (): ResearchProject[] => [
    {
      title: 'AI-Powered ECG Analysis System',
      research_area: 'Biomedical Signal Processing',
      institution: 'IIT Gandhinagar',
      status: 'ongoing',
      description: 'Developing machine learning algorithms for automated ECG interpretation and arrhythmia detection.',
      funding: 'DST-SERB',
      duration: '2023-2025'
    },
    {
      title: '5G Signal Processing Optimization',
      research_area: 'Communication Systems',
      institution: 'IIT Bombay',
      status: 'completed',
      description: 'Advanced signal processing techniques for improving 5G network performance and efficiency.',
      funding: 'TRAI',
      duration: '2022-2024'
    },
    {
      title: 'Deep Learning for Audio Enhancement',
      research_area: 'Machine Learning for Signal Processing',
      institution: 'IISC Bangalore',
      status: 'ongoing',
      description: 'Neural network approaches for real-time audio signal enhancement and noise reduction.',
      funding: 'Google Research',
      duration: '2024-2026'
    }
  ];

  const getDefaultPublications = (): Publication[] => [
    {
      title: 'Transformer-based ECG Classification for Cardiac Arrhythmia Detection',
      authors: 'Patel, A., Shah, B., Mehta, C.',
      journal: 'IEEE Transactions on Biomedical Engineering',
      year: 2024,
      type: 'journal',
      citations: 15
    },
    {
      title: 'Advanced Beamforming Techniques for 5G Massive MIMO Systems',
      authors: 'Kumar, R., Singh, P., Sharma, V.',
      journal: 'IEEE Communications Letters',
      year: 2024,
      type: 'journal',
      citations: 8
    },
    {
      title: 'Deep Neural Networks for Real-time Speech Enhancement',
      authors: 'Gupta, S., Agarwal, M., Jain, N.',
      journal: 'ICASSP 2024',
      year: 2024,
      type: 'conference',
      citations: 12
    }
  ];

  const filteredAreas = researchAreas.filter(area => 
    activeFilter === 'all' || area.id === activeFilter
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Research Excellence</h1>
            <p className="text-xl max-w-3xl opacity-90">
              Advancing the frontiers of signal processing through innovative research, 
              collaborative projects, and cutting-edge publications.
            </p>
          </div>
        </section>

        {/* Research Areas */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Research Areas</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our research spans multiple domains of signal processing, addressing both theoretical 
                challenges and practical applications.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {researchAreas.map((area) => {
                  const Icon = iconMap[area.icon] || Brain;
                  return (
                    <div key={area.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                      <div className={`w-14 h-14 mb-4 rounded-full flex items-center justify-center bg-gradient-to-r ${area.color || 'from-blue-500 to-purple-600'}`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">{area.title}</h3>
                      <p className="text-gray-600 mb-4">{area.description}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{area.projects_count || 0} Projects</span>
                        <span>{area.publications_count || 0} Publications</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Projects</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Highlighting some of our most impactful research projects across various institutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'ongoing' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                    </span>
                    <span className="text-sm text-gray-500">{project.duration}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">{project.title}</h3>
                  <p className="text-sm text-primary-600 mb-2">{project.research_area}</p>
                  <p className="text-gray-600 mb-4 text-sm">{project.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>Institution:</span>
                      <span className="font-medium">{project.institution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Funding:</span>
                      <span className="font-medium">{project.funding}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Publications */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Publications</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Latest research contributions from our community members in top-tier journals and conferences.
              </p>
            </div>

            <div className="space-y-6">
              {recentPublications.map((pub, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{pub.title}</h3>
                      <p className="text-gray-600 mb-2">{pub.authors}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="font-medium text-primary-600">{pub.journal}</span>
                        <span>{pub.year}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          pub.type === 'journal' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {pub.type === 'journal' ? 'Journal' : 'Conference'}
                        </span>
                        <span>{pub.citations} citations</span>
                      </div>
                    </div>
                    <button className="ml-4 p-2 text-gray-400 hover:text-primary-600">
                      <ExternalLink size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link 
                href="/publications" 
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                View All Publications
                <ChevronRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </section>

        {/* Research Stats */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">{stats.total_projects}+</div>
                <div className="text-sm opacity-90">Active Projects</div>
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">{stats.total_publications}+</div>
                <div className="text-sm opacity-90">Publications</div>
              </div>
              <div className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">{stats.total_collaborations}+</div>
                <div className="text-sm opacity-90">Collaborations</div>
              </div>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">{stats.total_awards}+</div>
                <div className="text-sm opacity-90">Awards</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Join Our Research Community</h2>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto opacity-90">
              Collaborate with leading researchers and contribute to advancing signal processing technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Start Collaboration
              </Link>
              <Link 
                href="/join" 
                className="bg-transparent text-white border border-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Become a Member
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}