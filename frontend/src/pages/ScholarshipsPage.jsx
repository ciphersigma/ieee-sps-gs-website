// src/pages/ScholarshipsPage.jsx
import React, { useState } from 'react';
import { GraduationCap, DollarSign, Calendar, ExternalLink, Search, Filter, Award } from 'lucide-react';

const ScholarshipsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const scholarships = [
    {
      id: 1,
      title: "IEEE SPS Travel Grant",
      amount: "Varies",
      category: "Travel Grant",
      description: "The IEEE Signal Processing Society (SPS) is pleased to provide travel grants on a highly competitive basis to student authors and non-student authors in developing countries. The grants will be awarded to a limited number of applicants who have a genuine need for support, and the paper quality will be taken into consideration. SPS membership is required at the time when the application is made.",
      link: "#",
      eligibility: "Student authors and non-student authors in developing countries"
    },
    {
      id: 2,
      title: "IEEE Standards Education Grants",
      amount: "US$500 (Students) / US$300 (Faculty)",
      category: "Education Grant",
      description: "The IEEE Standards Education Program offers grants for university student design projects that include an industry-standards component. Examples of industry standards include: IEEE 802.11 Standard for Wireless LANS, IEEE 11073 Standards for Health Informatics, National Electric Safety Code, etc.",
      link: "#",
      eligibility: "University students and faculty"
    },
    {
      id: 3,
      title: "IEEE Charles LeGeyt Fortescue Fellowship",
      amount: "US$24,000",
      category: "Fellowship",
      description: "This scholarship carries a stipend of approximately US$24,000 and is awarded to a first-year graduate student obtaining his or her master's degree in Electrical Engineering at an engineering school of recognized standing located in the United States.",
      link: "#",
      eligibility: "First-year graduate students in EE (US schools)"
    },
    {
      id: 4,
      title: "IEEE Computational Intelligence Society Conference Travel Grants",
      amount: "Varies",
      category: "Travel Grant",
      description: "This program offers a number of travel grants to assist IEEE Student members presenting papers at IEEE NNS (Neural Networks Society) sponsored conferences.",
      link: "#",
      eligibility: "IEEE Student members presenting papers"
    },
    {
      id: 5,
      title: "IEEE Computational Intelligence Society Summer Research Grant",
      amount: "US$1,000 - US$4,000",
      category: "Research Grant",
      description: "The program offers scholarships for deserving graduate students who need financial support for their research during a summer period.",
      link: "#",
      eligibility: "Graduate students"
    },
    {
      id: 6,
      title: "IEEE Computer Society Merwin Scholarship",
      amount: "US$2,000 (Up to 20 awards)",
      category: "Scholarship",
      description: "This scholarship recognizes and rewards active leaders in the IEEE Computer Society Student Branch Chapters. Up to 20 scholarships are available and awarded on an annual basis.",
      link: "#",
      eligibility: "Active leaders in IEEE Computer Society Student Branches"
    },
    {
      id: 7,
      title: "IEEE Dielectrics and Electrical Insulation Society Graduate Student Fellowship",
      amount: "US$7,500 (2 awards) / US$5,000 (3 awards)",
      category: "Fellowship",
      description: "This fellowship was designed to support graduate research in the area of insulation or dielectrics. Two US$7,500 or three US$5,000 scholarships are awarded annually.",
      link: "#",
      eligibility: "Graduate students in insulation/dielectrics research"
    },
    {
      id: 8,
      title: "IEEE Electron Devices Society Graduate Student Fellowship",
      amount: "Varies",
      category: "Fellowship",
      description: "This program promotes, recognizes, and supports graduate-level study and research within EDS, with at least one fellowship awarded to students in each of the main geographic regions: Americas, Europe/Mid-East/Africa, Asia/Pacific.",
      link: "#",
      eligibility: "Graduate students in electron devices"
    },
    {
      id: 9,
      title: "IEEE James C. Klouda Memorial Scholarship Award",
      amount: "Varies",
      category: "Scholarship",
      description: "The IEEE James C. Klouda Memorial Scholarship awards a scholarship to a qualified undergraduate student who seeks an electrical engineering degree with emphasis in the field of electromagnetic compatibility or a related discipline, from an accredited US university or college.",
      link: "#",
      eligibility: "Undergraduate EE students (EMC focus, US schools)"
    },
    {
      id: 10,
      title: "IEEE Life Members' Fellowship in Electrical History",
      amount: "US$17,000 + US$3,000 research budget",
      category: "Fellowship",
      description: "This fellowship supports either one year of full-time graduate work in the history of electrical science and technology at a college or university of recognized standing, or up to one year of post-doctoral research for a scholar in this field who has received his or her Ph.D. within the past three years.",
      link: "#",
      eligibility: "Graduate students or recent Ph.D. holders in electrical history"
    },
    {
      id: 11,
      title: "IEEE Life Member Graduate Study Fellowship in Electrical Engineering",
      amount: "US$10,000 (Renewable)",
      category: "Fellowship",
      description: "This renewable fellowship is awarded annually to a first-year, full-time graduate student obtaining his or her master's degree for work in the area of electrical engineering, at an engineering school/program of recognized standing worldwide.",
      link: "#",
      eligibility: "First-year graduate students in EE (worldwide)"
    },
    {
      id: 12,
      title: "IEEE Microwave Theory and Techniques Society Graduate Fellowships",
      amount: "US$5,000",
      category: "Fellowship",
      description: "This program was created to support graduate research studies in microwave engineering. Fellowships are in the amount of US$5,000 each, and the deadline for submission is 30 November annually.",
      link: "#",
      eligibility: "Graduate students in microwave engineering"
    },
    {
      id: 13,
      title: "IEEE Nuclear and Plasma Sciences Society Graduate Scholarship Award",
      amount: "US$500",
      category: "Scholarship",
      description: "This scholarship recognizes contributions to the fields of nuclear and plasma sciences. Scholarships are awarded annually, with submission deadline on 31 January.",
      link: "#",
      eligibility: "Graduate students in nuclear and plasma sciences"
    },
    {
      id: 14,
      title: "IEEE Photonics Society Graduate Student Fellowship Program",
      amount: "US$5,000 (10 fellowships)",
      category: "Fellowship",
      description: "This fellowship program provides ten fellowships. They will be awarded based on the student membership in each of the main geographic regions: Americas, Europe/Mid-East/Africa, Asia/Pacific.",
      link: "#",
      eligibility: "Graduate students in photonics (regional distribution)"
    },
    {
      id: 15,
      title: "IEEE Power and Energy Society Scholarship Program",
      amount: "Varies",
      category: "Scholarship",
      description: "This program offers scholarships to students in power and energy related fields.",
      link: "#",
      eligibility: "Students in power and energy fields"
    }
  ];

  const categories = ['all', 'Scholarship', 'Fellowship', 'Travel Grant', 'Research Grant', 'Education Grant'];

  const filteredScholarships = scholarships.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Scholarships, Grants & Fellowships</h1>
          <p className="text-xl max-w-3xl opacity-90">
            Explore IEEE funding opportunities to support your academic and research endeavors
          </p>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Join IEEE?</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              IEEE membership opens doors to numerous funding opportunities including travel grants, 
              research fellowships, and educational scholarships. As the world's largest technical 
              professional organization, IEEE provides financial support to advance your career, 
              research, and academic pursuits in electrical engineering and related fields.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-6 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 h-5 w-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Scholarships Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Opportunities</h2>
            <p className="text-gray-600">Found {filteredScholarships.length} opportunities</p>
          </div>

          {filteredScholarships.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No scholarships found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredScholarships.map((scholarship) => (
                <div key={scholarship.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">{scholarship.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      scholarship.category === 'Scholarship' ? 'bg-blue-100 text-blue-800' :
                      scholarship.category === 'Fellowship' ? 'bg-purple-100 text-purple-800' :
                      scholarship.category === 'Travel Grant' ? 'bg-green-100 text-green-800' :
                      scholarship.category === 'Research Grant' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {scholarship.category}
                    </span>
                    <span className="text-lg font-bold text-blue-600">{scholarship.amount}</span>
                  </div>
                  <p className="text-gray-600 mb-3">{scholarship.description}</p>
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Eligibility: </span>
                    <span className="text-gray-600">{scholarship.eligibility}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Need More Information?</h2>
          <p className="text-lg mb-8 text-gray-600 max-w-2xl mx-auto">
            For detailed guidance on IEEE scholarships, grants, and fellowships, contact our chapter chair
          </p>
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Chapter Chair</h3>
            <p className="text-gray-600 mb-6">
              Get personalized assistance with your application process and eligibility requirements
            </p>
            <a
              href="mailto:chair@ieeesps-gujarat.org"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Contact Chair
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScholarshipsPage;