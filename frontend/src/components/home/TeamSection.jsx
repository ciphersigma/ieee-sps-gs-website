// src/components/home/TeamSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Linkedin, Mail, ExternalLink, AlertCircle } from 'lucide-react';

const TeamSection = () => {
  const [committee, setCommittee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCommitteeMembers();
  }, []);

  const fetchCommitteeMembers = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      try {
        const data = await api.getExecutiveCommittee();
        
        if (Array.isArray(data) && data.length >= 15) {
          // Filter core team from API data
          const coreTeam = data.filter(member => 
            member.category === "Core" || 
            ["Chair", "Vice-Chair", "Secretary", "Treasurer", "Advisor"].some(title => 
              member.position && member.position.split(',')[0].includes(title)
            )
          ).slice(0, 5);
          setCommittee(coreTeam.length > 0 ? coreTeam : fallbackCommittee);
        } else {
          setCommittee(fallbackCommittee);
        }
      } catch (apiErr) {
        console.error('API error:', apiErr);
        setCommittee(fallbackCommittee);
      }
    } catch (err) {
      console.error('Error fetching committee members:', err);
      setError('Failed to load committee data.');
      setCommittee(fallbackCommittee);
    } finally {
      setLoading(false);
    }
  };

  // Fallback data - core executive team based on your image
  const fallbackCommittee = [
    {
      id: 1,
      name: "Dr. Mita Paunwala",
      position: "Chair",
      affiliation: "Associate Professor, Dean R & D, GCRCET, Surat",
      image: "https://res.cloudinary.com/dfoqoprpx/image/upload/v1761631538/download_fmwswe.jpg",
    },
    {
      id: 2,
      name: "Dr. Arpan Desai",
      position: "Vice-Chair",
      affiliation: "Assistant Professor, Charotar University of Science and Technology",
      image: "/assets/images/team/arpan-desai.jpg",
    },
    {
      id: 3,
      name: "Mr. Ankit Dave",
      position: "Secretary",
      affiliation: "Program Manager, Medallia India Pvt. Ltd.",
      image: "/assets/images/team/ankit-dave.jpg",
    },
    {
      id: 4,
      name: "Dr. Ketki Pathak",
      position: "Treasurer",
      affiliation: "Assistant Professor, SCET, Surat",
      image: "/assets/images/team/ketki-pathak.jpg",
    },
    {
      id: 5,
      name: "Dr. Chirag Paunwala",
      position: "Advisor, Immediate Past Chair",
      affiliation: "Professor, HOD EC Dept, SCET, Surat",
      image: "https://res.cloudinary.com/dfoqoprpx/image/upload/v1761632009/cp_h3rwzb.png",
    }
  ];

  // Use data from API or fallback
  const displayCommittee = committee.length > 0 ? committee : fallbackCommittee;

  // Handle image error
  const handleImageError = (e, name) => {
    e.target.onerror = null;
    // Replace with placeholder
    e.target.style.display = 'none';
    const parent = e.target.parentNode;
    parent.classList.add('bg-gray-200', 'flex', 'items-center', 'justify-center');
    const initials = document.createElement('span');
    initials.className = 'text-4xl text-gray-400 font-bold';
    initials.textContent = name.split(' ').map(n => n[0]).join('');
    parent.appendChild(initials);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 relative inline-block">
            Our Executive Committee
            <span className="absolute bottom-0 left-0 w-full h-1 bg-primary-500 transform translate-y-2"></span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated professionals leading the IEEE Signal Processing Society Gujarat Chapter
          </p>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        )}
        
        {/* Error State (shown alongside fallback data) */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md max-w-2xl mx-auto mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* Committee Members Grid - Always display something */}
        {!loading && (
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {displayCommittee.map((member) => (
              <div 
                key={member.id} 
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                {/* Member Photo */}
                <div className="h-48 overflow-hidden bg-slate-200">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => handleImageError(e, member.name)}
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                      <span className="text-3xl text-slate-400 font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Member Info */}
                <div className="p-4 border-t-4 border-primary-500">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium text-sm mb-2">{member.position}</p>
                  
                  {member.affiliation && (
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{member.affiliation}</p>
                  )}
                  
                  {/* Social Links */}
                  <div className="flex space-x-3 mt-2">
                    {member.email && (
                      <a 
                        href={`mailto:${member.email}`} 
                        className="text-gray-500 hover:text-primary-500 transition-colors"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    
                    {member.linkedin && (
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-primary-500 transition-colors"
                        aria-label={`LinkedIn profile of ${member.name}`}
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* View Full Committee Link */}
        <div className="text-center mt-12">
          <Link 
            to="/committee" 
            className="inline-flex items-center px-6 py-3 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white rounded-md transition-colors font-medium"
          >
            View Full Committee
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
