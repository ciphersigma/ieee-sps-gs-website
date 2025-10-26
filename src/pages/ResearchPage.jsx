// src/pages/ResearchPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Users, Award, ExternalLink, 
  ChevronRight, Search, Filter, Calendar,
  Brain, Zap, Radio, Eye, Mic, BarChart3
} from 'lucide-react';

const ResearchPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const researchAreas = [
    {
      id: 'ml-sp',
      title: 'Machine Learning for Signal Processing',
      description: 'Advanced ML techniques for signal analysis and processing applications.',
      icon: Brain,
      color: 'from-blue-500 to-purple-600',
      projects: 12,
      publications: 25
    },
    {
      id: 'biomedical',
      title: 'Biomedical Signal Processing',
      description: 'Processing physiological signals for healthcare and medical diagnostics.',
      icon: Zap,
      color: 'from-green-500 to-blue-500',
      projects: 8,
      publications: 18
    },
    {
      id: 'communications',
      title: 'Communication Systems',
      description: 'Signal processing for 5G/6G networks and wireless communications.',
      icon: Radio,
      color: 'from-purple-500 to-pink-500',
      projects: 15,
      publications: 32
    },
    {
      id: 'image-video',
      title: 'Image & Video Processing',
      description: 'Computer vision and multimedia signal processing techniques.',
      icon: Eye,
      color: 'from-orange-500 to-red-500',
      projects: 10,
      publications: 22
    },
    {
      id: 'speech-audio',
      title: 'Speech & Audio Processing',
      description: 'Speech recognition, audio enhancement, and acoustic analysis.',
      icon: Mic,
      color: 'from-teal-500 to-green-500',
      projects: 6,
      publications: 14
    },
    {
      id: 'data-analytics',
      title: 'Signal Analytics',
      description: 'Big data analytics and statistical signal processing methods.',
      icon: BarChart3,
      color: 'from-indigo-500 to-blue-500',
      projects: 9,
      publications: 19
    }
  ];

  const featuredProjects = [
    {
      title: 'AI-Powered ECG Analysis System',
      area: 'Biomedical Signal Processing',
      institution: 'IIT Gandhinagar',
      status: 'Ongoing',
      description: 'Developing machine learning algorithms for automated ECG interpretation and arrhythmia detection.',
      funding: 'DST-SERB',
      duration: '2023-2025'
    },
    {
      title: '5G Massive MIMO Signal Processing',
      area: 'Communication Systems',
      institution: 'DA-IICT',
      status: 'Completed',
      description: 'Advanced beamforming and interference mitigation techniques for massive MIMO systems.',
      funding: 'ISRO',
      duration: '2021-2023'
    },
    {
      title: 'Deep Learning for Medical Image Enhancement',
      area: 'Image & Video Processing',
      institution: 'PDEU',
      status: 'Ongoing',
      description: 'Novel deep learning architectures for enhancing low-quality medical images.',
      funding: 'GUJCOST',
      duration: '2022-2024'
    }
  ];

  const recentPublications = [
    {
      title: 'Transformer-based ECG Classification for Cardiac Arrhythmia Detection',
      authors: 'Patel, A., Shah, B., Mehta, C.',
      journal: 'IEEE Transactions on Biomedical Engineering',
      year: '2024',
      type: 'Journal',
      citations: 15
    },
    {
      title: 'Efficient Beamforming for mmWave Massive MIMO Systems',
      authors: 'Kumar, R., Singh, P., Gupta, M.',
      journal: 'IEEE Communications Letters',
      year: '2023',
      type: 'Journal',
      citations: 28
    },
    {
      title: 'Deep Residual Networks for Speech Enhancement in Noisy Environments',
      authors: 'Sharma, V., Joshi, N., Trivedi, K.',
      journal: 'ICASSP 2024',
      year: '2024',
      type: 'Conference',
      citations: 8
    }
  ];

  const filteredAreas = researchAreas.filter(area => 
    activeFilter === 'all' || area.id === activeFilter
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0077B5] to-[#1E40AF] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Research Excellence</h1>
          <p className="text-xl max-w-3xl opacity-90">
            Advancing the frontiers of signal processing through innovative research, 
            collaborative projects, and cutting-edge publications.
          </p>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Research Areas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our research spans multiple domains of signal processing, addressing both theoretical 
              challenges and practical applications.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {researchAreas.map((area) => {
              const Icon = area.icon;
              return (
                <div key={area.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className={`w-14 h-14 mb-4 rounded-full flex items-center justify-center bg-gradient-to-r ${area.color}`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{area.title}</h3>
                  <p className="text-gray-600 mb-4">{area.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{area.projects} Projects</span>
                    <span>{area.publications} Publications</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                    project.status === 'Ongoing' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-sm text-gray-500">{project.duration}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{project.title}</h3>
                <p className="text-sm text-blue-600 mb-2">{project.area}</p>
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                      <span className="font-medium text-blue-600">{pub.journal}</span>
                      <span>{pub.year}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        pub.type === 'Journal' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {pub.type}
                      </span>
                      <span>{pub.citations} citations</span>
                    </div>
                  </div>
                  <button className="ml-4 p-2 text-gray-400 hover:text-blue-600">
                    <ExternalLink size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link 
              to="/publications" 
              className="inline-flex items-center px-6 py-3 bg-[#0077B5] text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Publications
              <ChevronRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Research Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-gradient-to-r from-[#0077B5] to-[#1E40AF] text-white rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">60+</div>
              <div className="text-sm opacity-90">Active Projects</div>
            </div>
            <div className="bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">130+</div>
              <div className="text-sm opacity-90">Publications</div>
            </div>
            <div className="bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">25+</div>
              <div className="text-sm opacity-90">Collaborations</div>
            </div>
            <div className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white rounded-xl p-6">
              <div className="text-3xl font-bold mb-2">15+</div>
              <div className="text-sm opacity-90">Awards</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-[#0077B5] to-[#1E40AF]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Research Community</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto opacity-90">
            Collaborate with leading researchers and contribute to advancing signal processing technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="bg-white text-[#0077B5] px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Start Collaboration
            </Link>
            <Link 
              to="/join" 
              className="bg-transparent text-white border border-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Become a Member
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResearchPage;