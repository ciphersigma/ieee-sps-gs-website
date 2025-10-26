// src/pages/StudentRepresentativesPage.jsx
import React from 'react';
import { Linkedin, Mail, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentRepresentativesPage = () => {
  // Base URL for Supabase storage
  const supabaseStorageUrl = "https://elkgeovpcjuahdrueczp.supabase.co/storage/v1/object/public/media/team/";
  
  // Student Chapter Representatives data with image paths
  const representatives = [
    {
      id: 1,
      name: "Khushboo Jha",
      position: "Chair",
      affiliation: "SCET, Surat",
      email: "khushboo.jha@ieeesps.org",
      image: `${supabaseStorageUrl}Khushboo%20Jha.jpg`, // Format: FirstName%20LastName.jpg
      linkedin: "https://linkedin.com/in/khushboojha",
    },
    {
      id: 2,
      name: "Tirth Patel",
      position: "Student Representative",
      affiliation: "Ganpat University, Mehsana",
      email: "tirth.patel@ieeesps.org",
      image: `${supabaseStorageUrl}Tirth%20Patel.jpg`,
      linkedin: "https://linkedin.com/in/tirthpatel",
    },
    {
      id: 3,
      name: "Anika Mehta",
      position: "Student Representative",
      affiliation: "SCET, Surat",
      email: "anika.mehta@ieeesps.org",
      image: `${supabaseStorageUrl}Anika%20Mehta_.jpg`, // Using your provided URL
      linkedin: "https://linkedin.com/in/anikamehta",
    },
    {
      id: 4,
      name: "Hill Soni",
      position: "Student Representative",
      affiliation: "Ganpat University, Mehsana",
      email: "hill.soni@ieeesps.org",
      image: `${supabaseStorageUrl}Hill%20Soni.jpg`,
      linkedin: "https://linkedin.com/in/hillsoni",
    },
    {
      id: 5,
      name: "Prashant Chettiyar",
      position: "Student Representative",
      affiliation: "Silver Oak University, Ahmedabad",
      email: "prashant.chettiyar@ieeesps.org",
      image: `${supabaseStorageUrl}Prashant%20Chettiyar.jpg`,
      linkedin: "https://linkedin.com/in/prashantchettiyar",
    },
    {
      id: 6,
      name: "Dhruvi Mandloi",
      position: "Student Representative",
      affiliation: "Silver Oak University, Ahmedabad",
      email: "dhruvi.mandloi@ieeesps.org",
      image: `${supabaseStorageUrl}Dhruvi%20Mandloi.jpg`,
      linkedin: "https://linkedin.com/in/dhruvimandloi",
    },
    {
      id: 7,
      name: "Dev Ray",
      position: "Student Representative",
      affiliation: "SVNIT Surat",
      email: "dev.ray@ieeesps.org",
      image: `${supabaseStorageUrl}Dev%20Ray.jpg`,
      linkedin: "https://linkedin.com/in/devray",
    },
    {
      id: 8,
      name: "Chrisha Dabhi",
      position: "Student Representative",
      affiliation: "Kadi Sarva Vishwavidyalya",
      email: "chrisha.dabhi@ieeesps.org",
      image: `${supabaseStorageUrl}Chrisha%20Dabhi.jpg`,
      linkedin: "https://linkedin.com/in/chrishadabhi",
    },
    {
      id: 9,
      name: "Gunjan Sharma",
      position: "Student Representative",
      affiliation: "Ganpat University, Mehsana",
      email: "gunjan.sharma@ieeesps.org",
      image: `${supabaseStorageUrl}Gunjan%20Sharma.jpg`,
      linkedin: "https://linkedin.com/in/gunjansharma",
    },
    {
      id: 10,
      name: "Tanisha Agarwal",
      position: "Student Representative",
      affiliation: "Ahmedabad University",
      email: "tanisha.agarwal@ieeesps.org",
      image: `${supabaseStorageUrl}Tanisha%20Agarwal.jpg`,
      linkedin: "https://linkedin.com/in/tanishaagarwal",
    },
    {
      id: 11,
      name: "Sujal Sutariya",
      position: "Student Representative",
      affiliation: "GEC Gandhinagar",
      email: "sujal.sutariya@ieeesps.org",
      image: `${supabaseStorageUrl}Sujal%20Sutariya.jpg`,
      linkedin: "https://linkedin.com/in/sujalsutariya",
    },
    {
      id: 12,
      name: "Payal Makwana",
      position: "Student Representative",
      affiliation: "VGEC Ahmedabad",
      email: "payal.makwana@ieeesps.org",
      image: `${supabaseStorageUrl}Payal%20Makwana.jpg`,
      linkedin: "https://linkedin.com/in/payalmakwana",
    }
  ];

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

  // Card component for consistency - matching CommitteePage
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
      <div className="h-1 w-full bg-primary-500"></div>
      
      {/* Member Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-primary-500 font-medium text-sm mb-2">{member.position}</p>
        
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
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Exactly matching your Committee page */}
      <section className="bg-gradient-to-r from-primary-500 to-blue-600 text-white py-16 relative overflow-hidden">
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
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-4">
              Section Chapter Representatives
            </h1>
            <p className="text-xl">
              Meet the dedicated student leaders representing IEEE Signal Processing Society 
              across various educational institutions in Gujarat.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Back Button - Styled exactly as in your Committee page */}
          <div className="mb-10">
            <Link 
              to="/" 
              className="inline-flex items-center text-primary-500 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          {/* Team Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200">
              Chapter Representatives Team 2025
            </h2>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {representatives.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentRepresentativesPage;
