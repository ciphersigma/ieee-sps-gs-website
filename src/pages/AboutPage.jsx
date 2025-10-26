// src/pages/AboutPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Users, Award, BookOpen, 
  Zap, ExternalLink, ChevronRight, Mail, Phone, 
  Globe, BookOpenCheck, Share2, BarChart4
} from 'lucide-react';

const AboutPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Set initial tab based on URL
    if (location.pathname.includes('/about/history')) return 'history';
    return 'mission'; // Default tab
  });

  // Timeline data
  const timeline = [
    {
      year: '2015',
      title: 'SPS Gujarat Chapter Established',
      description: 'The IEEE Signal Processing Society Gujarat Chapter was officially established to promote technical activities in the region.'
    },
    {
      year: '2017',
      title: 'First State-Level Conference',
      description: 'Organized the first state-level conference on Advances in Signal Processing with participation from leading institutes.'
    },
    {
      year: '2019',
      title: 'Distinguished Lecture Series',
      description: 'Launched the Distinguished Lecture Series featuring international experts in the signal processing domain.'
    },
    {
      year: '2021',
      title: 'Industry-Academia Partnership',
      description: 'Established formal partnerships with industry leaders to bridge the gap between academic research and industrial applications.'
    },
    {
      year: '2023',
      title: 'Research Excellence Awards',
      description: 'Instituted the annual Research Excellence Awards to recognize outstanding contributions in signal processing research.'
    }
  ];

  // Focus areas data
  const focusAreas = [
    {
      title: 'Machine Learning for Signal Processing',
      description: 'Exploring the intersection of machine learning techniques with traditional signal processing for enhanced performance and capabilities.',
      icon: BarChart4
    },
    {
      title: 'Biomedical Signal Processing',
      description: 'Developing algorithms and systems for processing physiological signals for healthcare applications and medical diagnostics.',
      icon: Zap
    },
    {
      title: 'Communication Systems',
      description: 'Researching signal processing techniques for modern communication systems including 5G/6G and IoT networks.',
      icon: Share2
    },
    {
      title: 'Image and Video Processing',
      description: 'Advancing techniques for analyzing, enhancing, and extracting information from visual media and computer vision applications.',
      icon: BookOpenCheck
    },
    {
      title: 'Speech and Audio Processing',
      description: 'Developing technologies for speech recognition, audio enhancement, and acoustic signal analysis.',
      icon: Globe
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0077B5] to-[#1E40AF] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '25px 25px'
          }}></div>
          
          {/* Signal waves */}
          <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path 
              d="M0,100 C100,60 200,140 300,100 C400,60 500,140 600,100 C700,60 800,140 900,100 C1000,60 1100,140 1200,100" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.2)" 
              strokeWidth="2"
            />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About IEEE SPS Gujarat</h1>
          <p className="text-xl max-w-3xl opacity-90">
            Dedicated to promoting the theory and application of signal processing in Gujarat through education,
            research, and community engagement.
          </p>
        </div>
      </section>
      
      {/* Tab Navigation */}
      <section className="bg-white shadow-md sticky top-20 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => setActiveTab('mission')}
              className={`px-4 py-2 font-medium text-sm mr-4 whitespace-nowrap transition-colors ${
                activeTab === 'mission' 
                  ? 'text-[#0077B5] border-b-2 border-[#0077B5]' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mission & Vision
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 font-medium text-sm mr-4 whitespace-nowrap transition-colors ${
                activeTab === 'history' 
                  ? 'text-[#0077B5] border-b-2 border-[#0077B5]' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Our History
            </button>
            <button
              onClick={() => setActiveTab('focus')}
              className={`px-4 py-2 font-medium text-sm mr-4 whitespace-nowrap transition-colors ${
                activeTab === 'focus' 
                  ? 'text-[#0077B5] border-b-2 border-[#0077B5]' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Focus Areas
            </button>
          </div>
        </div>
      </section>
      
      {/* Tab Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission & Vision Tab */}
          {activeTab === 'mission' && (
            <div className="space-y-12 animate-fadeIn">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Mission Card */}
                <div className="bg-white rounded-xl shadow-md p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#0077B5]/10 text-[#0077B5] mr-4">
                      <Zap className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Our Mission
                    </h2>
                  </div>
                  <p className="mb-6 text-gray-700">
                    To advance the theory and application of signal processing and promote research, 
                    education, and technological innovation in the field throughout Gujarat.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Foster collaboration between academia and industry",
                      "Provide platforms for knowledge exchange among professionals",
                      "Support student initiatives in signal processing research",
                      "Facilitate networking opportunities for researchers and practitioners"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <ChevronRight className="mt-1 mr-2 flex-shrink-0 text-[#0077B5]" size={16} />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Vision Card */}
                <div className="bg-white rounded-xl shadow-md p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#0077B5]/10 text-[#0077B5] mr-4">
                      <Globe className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Our Vision
                    </h2>
                  </div>
                  <p className="mb-6 text-gray-700">
                    To establish Gujarat as a center of excellence in signal processing innovation 
                    and to build a vibrant community of researchers, educators, and practitioners.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Become the premier signal processing community in Western India",
                      "Create an ecosystem that nurtures innovation and research excellence",
                      "Bridge the gap between theoretical research and practical applications",
                      "Empower the next generation of signal processing professionals"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <ChevronRight className="mt-1 mr-2 flex-shrink-0 text-[#0077B5]" size={16} />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* About IEEE SPS */}
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  About IEEE Signal Processing Society
                </h2>
                <p className="mb-6 text-gray-700">
                  The IEEE Signal Processing Society is the world's premier association for signal processing engineers and industry professionals. 
                  With over 17,000 members worldwide, the Society supports scientific and educational activities in the field of signal processing.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <BookOpen className="mr-3 text-[#0077B5]" size={20} />
                      <h3 className="text-lg font-semibold text-gray-900">Publications</h3>
                    </div>
                    <p className="text-gray-700">
                      IEEE SPS publishes leading journals and magazines in signal processing, providing a platform for sharing cutting-edge research.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <Calendar className="mr-3 text-[#0077B5]" size={20} />
                      <h3 className="text-lg font-semibold text-gray-900">Conferences</h3>
                    </div>
                    <p className="text-gray-700">
                      The Society sponsors and organizes numerous conferences globally, fostering knowledge exchange and networking.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <Users className="mr-3 text-[#0077B5]" size={20} />
                      <h3 className="text-lg font-semibold text-gray-900">Community</h3>
                    </div>
                    <p className="text-gray-700">
                      IEEE SPS builds a global community of professionals through local chapters, student branches, and technical committees.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <a 
                    href="https://signalprocessingsociety.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 rounded-lg font-medium bg-[#0077B5] text-white hover:bg-blue-700 transition-colors"
                  >
                    <span>Visit IEEE SPS Global</span>
                    <ExternalLink size={16} className="ml-2" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-12 animate-fadeIn">
              <div className="bg-white rounded-xl shadow-md p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Our Journey
                </h2>
                <p className="text-gray-700">
                  The IEEE Signal Processing Society Gujarat Chapter was established in 2015 with a vision to create 
                  a vibrant community of signal processing professionals in the region. Since its inception, the chapter 
                  has grown significantly and has been instrumental in promoting signal processing education, research, 
                  and industry collaboration throughout Gujarat.
                </p>
              </div>

              {/* Timeline */}
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 md:left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-[#0077B5] via-[#1E40AF] to-[#0077B5]"></div>
                
                {/* Timeline entries */}
                <div className="space-y-12">
                  {timeline.map((item, index) => (
                    <div key={index} className={`relative ${index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:ml-auto'}`}>
                      <div className={`${
                        index % 2 === 0 
                          ? 'md:pr-12' 
                          : 'md:pl-12'
                      }`}>
                        <div className="bg-white rounded-xl shadow-md p-6">
                          {/* Timeline dot */}
                          <div className={`absolute top-6 ${
                            index % 2 === 0 
                              ? 'right-0 md:right-auto md:left-1/2 md:-ml-3' 
                              : 'left-0 md:left-auto md:left-1/2 md:-ml-3'
                          } w-6 h-6 rounded-full border-4 border-white z-10`}
                          style={{ background: index % 2 === 0 ? '#0077B5' : '#1E40AF' }}
                          ></div>
                          
                          <div className="flex flex-col md:flex-row md:items-center mb-4">
                            <div className={`text-2xl font-bold mr-3 ${
                              index % 2 === 0 
                                ? 'text-[#0077B5]' 
                                : 'text-[#1E40AF]'
                            }`}>
                              {item.year}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-gray-700">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-xl shadow-md p-8 mt-16">
                <div className="flex items-center mb-6">
                  <Award className="mr-4 text-yellow-500" size={28} />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Key Achievements
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Best Chapter Award 2022",
                      description: "Recognized as the best IEEE SPS Chapter in Region 10 for outstanding activities and member engagement."
                    },
                    {
                      title: "Technical Event Excellence",
                      description: "Organized over 50 successful technical events including workshops, seminars, and conferences since inception."
                    },
                    {
                      title: "Membership Growth",
                      description: "Achieved 300% growth in membership over the past five years through active outreach and quality initiatives."
                    },
                    {
                      title: "Research Collaborations",
                      description: "Established research partnerships with 12 leading academic institutions and 8 industry partners across Gujarat."
                    }
                  ].map((achievement, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-700">
                        {achievement.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Focus Areas Tab */}
          {activeTab === 'focus' && (
            <div className="space-y-12 animate-fadeIn">
              <div className="bg-white rounded-xl shadow-md p-8 mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Technical Focus Areas
                </h2>
                <p className="text-gray-700">
                  The IEEE SPS Gujarat Chapter focuses on several key areas in signal processing research and application, 
                  aligning with both global trends and local needs.
                </p>
              </div>

              {/* Focus Areas Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {focusAreas.map((area, index) => {
                  const Icon = area.icon;
                  return (
                    <div 
                      key={index}
                      className="bg-white rounded-xl shadow-md p-6 transition-transform duration-300 hover:-translate-y-2"
                    >
                      <div className="w-14 h-14 mb-6 rounded-full flex items-center justify-center"
                        style={{ 
                          background: `linear-gradient(135deg, ${
                            index % 5 === 0 ? '#3B82F6, #8B5CF6' :
                            index % 5 === 1 ? '#10B981, #3B82F6' :
                            index % 5 === 2 ? '#F59E0B, #EF4444' :
                            index % 5 === 3 ? '#6366F1, #EC4899' :
                            '#8B5CF6, #EC4899'
                          })` 
                        }}
                      >
                        <Icon className="text-white" size={24} />
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">
                        {area.title}
                      </h3>
                      
                      <p className="text-gray-700">
                        {area.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Research & Initiatives */}
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                {/* Research Activities */}
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h3 className="text-xl font-bold mb-6 text-gray-900">
                    Research Activities
                  </h3>
                  
                  <ul className="space-y-4">
                    {[
                      "Collaborative research projects between academic institutions",
                      "Industry-sponsored research on practical signal processing applications",
                      "Student research initiatives and mentorship programs",
                      "Signal processing challenges and competitions",
                      "Publication support for researchers in prestigious journals"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <ChevronRight className="mt-1 mr-2 flex-shrink-0 text-[#0077B5]" size={16} />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Educational Initiatives */}
                <div className="bg-white rounded-xl shadow-md p-8">
                  <h3 className="text-xl font-bold mb-6 text-gray-900">
                    Educational Initiatives
                  </h3>
                  
                  <ul className="space-y-4">
                    {[
                      "Technical workshops and hands-on training sessions",
                      "Distinguished lecture series featuring global experts",
                      "Curriculum development support for academic institutions",
                      "Online learning resources and webinars",
                      "Industry-oriented skill development programs"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <ChevronRight className="mt-1 mr-2 flex-shrink-0 text-[#0077B5]" size={16} />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Join Us CTA - Exact match to reference image */}
      <section className="bg-gradient-to-r from-[#0077B5] via-[#1E40AF] to-[#3B82F6] py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Join IEEE SPS Gujarat
            </h2>
            
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
              Become a part of our vibrant community and contribute to the advancement of 
              signal processing in Gujarat. Enjoy exclusive benefits, networking opportunities, 
              and access to valuable resources.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/join" 
                className="bg-white text-[#0077B5] px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Become a Member
              </Link>
              
              <Link 
                to="/join#benefits" 
                className="bg-transparent text-white border border-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Learn About Benefits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Add required CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
