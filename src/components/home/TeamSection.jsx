// src/components/home/TeamSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
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
      
      // Fetch executive committee members from Supabase
      const { data, error } = await supabase
        .from('executive_committee')
        .select('*')
        .order('order', { ascending: true }) // Assuming you have an 'order' field for sorting
        .limit(8); // Limit to 8 members for the homepage
      
      if (error) throw error;
      
      setCommittee(data || []);
    } catch (err) {
      console.error('Error fetching committee members:', err);
      setError('Failed to load executive committee data.');
    } finally {
      setLoading(false);
    }
  };

  // Fallback data if Supabase fetch fails or table doesn't exist yet
  const fallbackCommittee = [
    {
      id: 1,
      name: "Dr. Mita Paunwala",
      position: "Chair",
      affiliation: "SCET",
      image: "/assets/images/team/chair.jpg",
      email: "mitapaunwala@ieee.org",
      linkedin: "https://www.linkedin.com/in/prashant-chettiyar/",
      bio: "Associate Professor with expertise in signal processing and communications"
    },
    {
      id: 2,
      name: "Dr. Aditya Shah",
      position: "Vice Chair",
      affiliation: "DAIICT",
      image: "/assets/images/team/vice-chair.jpg",
      email: "aditya.shah@ieee.org",
      linkedin: "https://www.linkedin.com/in/adityashah/",
      bio: "Research scientist specializing in image processing and computer vision"
    },
    {
      id: 3,
      name: "Prof. Smita Patel",
      position: "Secretary",
      affiliation: "NIRMA University",
      image: "/assets/images/team/secretary.jpg",
      email: "smita.patel@ieee.org",
      linkedin: "https://www.linkedin.com/in/smitapatel/",
      bio: "Assistant Professor with research focus on biomedical signal processing"
    },
    {
      id: 4,
      name: "Dr. Rajesh Kumar",
      position: "Treasurer",
      affiliation: "IIT Gandhinagar",
      image: "/assets/images/team/treasurer.jpg",
      email: "rajesh.kumar@ieee.org",
      linkedin: "https://www.linkedin.com/in/rajeshkumar/",
      bio: "Associate Professor specializing in audio signal processing"
    }
  ];

  // Determine which data to display
  const displayCommittee = committee.length > 0 ? committee : (error ? fallbackCommittee : []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 relative inline-block">
            Our Executive Committee
            <span className="absolute bottom-0 left-0 w-full h-1 bg-ieee-green transform translate-y-2"></span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated professionals leading the IEEE Signal Processing Society Gujarat Chapter
          </p>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ieee-green"></div>
          </div>
        )}
        
        {/* Error State (only shown if no fallback data) */}
        {error && displayCommittee.length === 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md max-w-2xl mx-auto">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* Committee Members Grid */}
        {displayCommittee.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayCommittee.map((member) => (
              <div 
                key={member.id} 
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                {/* Member Photo */}
                <div className="h-60 overflow-hidden">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl text-gray-400 font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Member Info */}
                <div className="p-6 border-t-4 border-ieee-green">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-ieee-blue font-medium mb-1">{member.position}</p>
                  
                  {member.affiliation && (
                    <p className="text-sm text-gray-600 mb-3">{member.affiliation}</p>
                  )}
                  
                  {member.bio && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">{member.bio}</p>
                  )}
                  
                  {/* Social Links */}
                  <div className="flex space-x-3 mt-auto">
                    {member.email && (
                      <a 
                        href={`mailto:${member.email}`} 
                        className="text-gray-500 hover:text-ieee-green transition-colors"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail className="h-5 w-5" />
                      </a>
                    )}
                    
                    {member.linkedin && (
                      <a 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-ieee-green transition-colors"
                        aria-label={`LinkedIn profile of ${member.name}`}
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    
                    {member.website && (
                      <a 
                        href={member.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-ieee-green transition-colors"
                        aria-label={`Website of ${member.name}`}
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* View Full Team Link */}
        <div className="text-center mt-12">
          <Link 
            to="/team" 
            className="inline-flex items-center px-6 py-3 border-2 border-ieee-green text-ieee-green hover:bg-ieee-green hover:text-white rounded-md transition-colors font-medium"
          >
            View Full Committee
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;