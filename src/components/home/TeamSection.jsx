// src/components/home/TeamSection.jsx
import React from 'react';
import { Linkedin, Mail, Globe } from 'lucide-react';

const TeamSection = () => {
  const committeeMembers = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      role: "Chapter Chair",
      image: "/images/team/member1.jpg", // Add placeholder images
      bio: "Associate Professor at DA-IICT with expertise in digital signal processing and communications",
      linkedin: "https://linkedin.com/in/username1",
      email: "chair@ieee-sps-gujarat.org"
    },
    {
      id: 2,
      name: "Dr. Rajesh Patel",
      role: "Vice Chair",
      image: "/images/team/member2.jpg",
      bio: "Professor at NIT Surat specializing in array signal processing and radar systems",
      linkedin: "https://linkedin.com/in/username2",
      email: "vicechair@ieee-sps-gujarat.org"
    },
    {
      id: 3,
      name: "Dr. Ananya Desai",
      role: "Secretary",
      image: "/images/team/member3.jpg",
      bio: "Assistant Professor at IIT Gandhinagar with research focus on machine learning for signal processing",
      linkedin: "https://linkedin.com/in/username3",
      email: "secretary@ieee-sps-gujarat.org"
    },
    {
      id: 4,
      name: "Prof. Vivek Mehta",
      role: "Treasurer",
      image: "/images/team/member4.jpg",
      bio: "Faculty member at SVNIT with expertise in biomedical signal processing",
      linkedin: "https://linkedin.com/in/username4",
      email: "treasurer@ieee-sps-gujarat.org"
    }
  ];

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Executive Committee</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated professionals leading IEEE SPS Gujarat Chapter
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {committeeMembers.map((member) => (
            <div key={member.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg">
              <div className="h-64 overflow-hidden bg-gradient-to-b from-blue-100 to-white">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50">
                    <span className="text-6xl text-blue-300">{member.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                
                <div className="flex space-x-3">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" 
                       className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                      <Linkedin size={18} />
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`}
                       className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                      <Mail size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="#" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block">
            View All Members
          </a>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;