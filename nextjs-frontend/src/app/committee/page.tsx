'use client';

import React, { useState, useEffect } from 'react';
import { Linkedin, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { api } from '@/services/api';

interface CommitteeMember {
  id: number;
  name: string;
  position: string;
  affiliation: string;
  image: string;
  category: string;
  email?: string;
  linkedin?: string;
}

export default function CommitteePage() {
  const [committee, setCommittee] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommitteeMembers();
  }, []);

  const fetchCommitteeMembers = async () => {
    try {
      setLoading(true);
      const data = await api.getExecutiveCommittee();
      
      if (Array.isArray(data) && data.length >= 15) {
        setCommittee(data);
      } else {
        setCommittee(fallbackCommittee);
      }
    } catch (error) {
      console.error('Error fetching committee members:', error);
      setCommittee(fallbackCommittee);
    } finally {
      setLoading(false);
    }
  };

  const fallbackCommittee: CommitteeMember[] = [
    {
      id: 1,
      name: "Dr. Mita Paunwala",
      position: "Chair",
      affiliation: "Associate Professor, Dean R & D, GCRCET, Surat",
      image: "https://res.cloudinary.com/dfoqoprpx/image/upload/v1761631538/download_fmwswe.jpg",
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
      image: "https://res.cloudinary.com/dfoqoprpx/image/upload/v1761632009/cp_h3rwzb.png",
      category: "Core"
    },
    {
      id: 6,
      name: "Dr. Deepak Mathur",
      position: "Member at Large",
      affiliation: "IEEE SPSGS",
      image: "https://res.cloudinary.com/dfoqoprpx/image/upload/v1761632425/deepak_mathur_jbzi0m.jpg",
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
      image: "https://res.cloudinary.com/dfoqoprpx/image/upload/v1761632081/20250111_001704_k5jych.jpg",
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

  const coreTeam = committee.filter(member => 
    member.category === "Core" || 
    ["Chair", "Vice-Chair", "Secretary", "Treasurer", "Advisor"].some(title => 
      member.position && member.position.split(',')[0].includes(title)
    )
  ).slice(0, 5);
  
  const extendedTeam = committee.filter(member => 
    member.category === "Extended" || 
    (member.position && !["Chair", "Vice-Chair", "Secretary", "Treasurer", "Advisor"].some(title => 
      member.position.split(',')[0].includes(title)
    ))
  );

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, name: string) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    const parent = target.parentNode as HTMLElement;
    parent.classList.add('bg-slate-200', 'flex', 'items-center', 'justify-center');
    const initials = document.createElement('span');
    initials.className = 'text-3xl text-slate-400 font-bold';
    initials.textContent = name.split(' ').map(n => n[0]).join('');
    parent.appendChild(initials);
  };

  const MemberCard = ({ member }: { member: CommitteeMember }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
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
      
      <div className="h-1 w-full bg-primary-500"></div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-primary-500 font-medium text-sm mb-2">{member.position}</p>
        
        {member.affiliation && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">{member.affiliation}</p>
        )}
        
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
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-r from-primary-500 to-blue-600 text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
              backgroundSize: '25px 25px'
            }}></div>
            
            <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1200 200" preserveAspectRatio="none">
              <path 
                d="M0,100 C100,60 200,140 300,100 C400,60 500,140 600,100 C700,60 800,140 900,100 C1000,60 1100,140 1200,100" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.2)" 
                strokeWidth="2"
              />
            </svg>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl">
              <h1 className="text-5xl font-bold mb-4">
                Executive Committee
              </h1>
              <p className="text-xl">
                Meet the dedicated professionals leading the IEEE Signal Processing Society Gujarat Chapter.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <Link 
                href="/" 
                className="inline-flex items-center text-primary-500 hover:text-primary-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Back to Home</span>
              </Link>
            </div>
            
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            )}
            
            {!loading && (
              <>
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
    </MainLayout>
  );
}