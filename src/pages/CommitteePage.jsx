// src/pages/CommitteePage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Linkedin, Mail, ExternalLink, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CommitteePage = () => {
  const [committee, setCommittee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchAllCommitteeMembers();
  }, []);

  const fetchAllCommitteeMembers = async () => {
    try {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('executive_committee')
          .select('*')
          .order('order', { ascending: true });
        
        if (error) throw error;
        
        if (Array.isArray(data) && data.length > 0) {
          setCommittee(data);
        } else {
          setCommittee(fallbackCommittee);
        }
      } catch (supabaseErr) {
        console.error('Supabase error:', supabaseErr);
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

  // Complete fallback data with all 15 committee members based on your images
  const fallbackCommittee = [
    // Core Executive Team
    {
      id: 1,
      name: "Dr. Mita Paunwala",
      position: "Chair",
      affiliation: "Associate Professor, Dean R & D, GCRCET, Surat",
      image: "/assets/images/team/mita-paunwala.jpg",
      category: "Core"
    },
    {
      id: 2,
      name: "Dr. Arpan Desai",
      position: "Vice-Chair",
      affiliation: "Assistant Professor, Charotar University of Science and Technology",
      image: "/assets/images/team/arpan-desai.jpg",
      category: "Core"
    },
    {
      id: 3,
      name: "Mr. Ankit Dave",
      position: "Secretary",
      affiliation: "Program Manager, Medallia India Pvt. Ltd.",
      image: "/assets/images/team/ankit-dave.jpg",
      category: "Core"
    },
    {
      id: 4,
      name: "Dr. Ketki Pathak",
      position: "Treasurer",
      affiliation: "Assistant Professor, SCET, Surat",
      image: "/assets/images/team/ketki-pathak.jpg",
      category: "Core"
    },
    {
      id: 5,
      name: "Dr. Chirag Paunwala",
      position: "Advisor, Immediate Past Chair",
      affiliation: "Professor, HOD EC Dept, SCET, Surat",
      image: "/assets/images/team/chirag-paunwala.jpg",
      category: "Core"
    },
    
    // Additional Committee Members - Using the data from your image
    {
      id: 6,
      name: "Dr. Deepak Mathur",
      position: "Member at Large",
      affiliation: "IEEE SPSGS",
      image: "/assets/images/team/deepak-mathur.jpg",
      category: "Extended"
    },
    {
      id: 7,
      name: "Prof. Neeta Chapatwala",
      position: "Chair, WiSP",
      affiliation: "Assistant Professor, SCET, Surat",
      image: "/assets/images/team/neeta-chapatwala.jpg",
      category: "Extended"
    },
    {
      id: 8,
      name: "Prof. Neetirajsinh Chhasatia",
      position: "Student Activity Chair",
      affiliation: "Assistant Professor, Government Eng. College, Gandhinagar",
      image: "/assets/images/team/neetirajsinh-chhasatia.jpg",
      category: "Extended"
    },
    {
      id: 9,
      name: "Dr. Chintan Varnagar",
      position: "Chair, Technical Activity",
      affiliation: "Assistant Professor, Government Eng. College, Rajkot",
      image: "/assets/images/team/chintan-varnagar.jpg",
      category: "Extended"
    },
    {
      id: 10,
      name: "Prof. Shankar Parmar",
      position: "Vice-Chair, Technical Activity",
      affiliation: "Assistant Professor, Government Eng. College, Godhra",
      image: "/assets/images/team/shankar-parmar.jpg",
      category: "Extended"
    },
    {
      id: 11,
      name: "Dr. Pooja Shah",
      position: "Chair, Student Activity",
      affiliation: "Assistant Professor, PDEU, Gandhinagar",
      image: "/assets/images/team/pooja-shah.jpg",
      category: "Extended"
    },
    {
      id: 12,
      name: "Mr. Rahul Makahania",
      position: "Chair, Professional Activity",
      affiliation: "Founder, UserEx Consulting",
      image: "/assets/images/team/rahul-makahania.jpg",
      category: "Extended"
    },
    {
      id: 13,
      name: "Dr. Mayuresh Kulkarni",
      position: "Chair, Membership Development",
      affiliation: "Assistant Professor, SILVER OAK University",
      image: "/assets/images/team/mayuresh-kulkarni.jpg",
      category: "Extended"
    },
    {
      id: 14,
      name: "Mr. Giriraj Shah",
      position: "YP Chair",
      affiliation: "Technical Support Engineer, Crest Data Systems",
      image: "/assets/images/team/giriraj-shah.jpg",
      category: "Extended"
    },
    {
      id: 15,
      name: "Ms. Tejal Surati",
      position: "Digital Chair",
      affiliation: "Lab.Asst. MCA Dept., SCET, Surat",
      image: "/assets/images/team/tejal-surati.jpg",
      category: "Extended"
    }
  ];

  // Use data from API or fallback
  const displayCommittee = committee.length > 0 ? committee : fallbackCommittee;
  
  // Separate core team from other members
  const coreTeam = displayCommittee.filter(member => 
    member.category === "Core" || 
    ["Chair", "Vice-Chair", "Secretary", "Treasurer", "Advisor"].some(title => 
      member.position && member.position.split(',')[0].includes(title)
    )
  ).slice(0, 5);
  
  const extendedTeam = displayCommittee.filter(member => 
    member.category === "Extended" || 
    (member.position && !["Chair", "Vice-Chair", "Secretary", "Treasurer", "Advisor"].some(title => 
      member.position.split(',')[0].includes(title)
    ))
  );

  // Handle image error
  const handleImageError = (e, name) => {
    e.target.onerror = null;
    // Replace with placeholder
    e.target.style.display = 'none';
    const parent = e.target.parentNode;
    parent.classList.add('bg-slate-200', 'flex', 'items-center', 'justify-center');
    const initials = document.createElement('span');
    initials.className = 'text-3xl text-slate-400 font-bold';
    initials.textContent = name.split(' ').map(n => n[0]).join('');
    parent.appendChild(initials);
  };

  // Card component for consistency
  const MemberCard = ({ member }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
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
      
      {/* Green line under photo matching your design */}
      <div className="h-1 w-full bg-ieee-green"></div>
      
      {/* Member Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-ieee-green font-medium text-sm mb-2">{member.position}</p>
        
        {member.affiliation && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{member.affiliation}</p>
        )}
        
        {/* Social Links */}
        <div className="flex space-x-3 mt-2">
          {member.email && (
            <a 
              href={`mailto:${member.email}`} 
              className="text-gray-500 hover:text-ieee-green transition-colors"
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
              className="text-gray-500 hover:text-ieee-green transition-colors"
              aria-label={`LinkedIn profile of ${member.name}`}
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Hero Section with green gradient background matching your design */}
      <section className="bg-gradient-to-r from-ieee-green to-green-600 text-white py-16 px-4 mt-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            EXECUTIVE COMMITTEE - 2025
          </h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Meet the dedicated team of professionals leading the IEEE Signal Processing Society Gujarat Chapter
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-ieee-green hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ieee-green"></div>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md max-w-2xl mx-auto mb-8">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          {!loading && (
            <>
              {/* Core Team Section */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200">
                  Core Executive Team
                </h2>
                
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {coreTeam.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
              
              {/* Extended Team Section */}
              <div>
                <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200">
                  Committee Members
                </h2>
                
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {extendedTeam.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default CommitteePage;