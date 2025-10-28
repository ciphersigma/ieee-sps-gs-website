import React from 'react';
import { Plane, Award, ExternalLink } from 'lucide-react';

const StudentTravelGrantsPage = () => {
  const societyGrants = [
    "IEEE Signal Processing Society grants designated for Student Members only"
  ];

  const foundationGrants = [
    "Spoken Language Processing Student Grant Program",
    "Harold Sobol Student Grant Program", 
    "Grainger: IEEE PES Student Program Fund",
    "IEEE Valentin T. Jordanov Radiation Instrumentation Travel Grant",
    "Charles DeSoer LiSSA Attendance Grant",
    "Ganesh N. Ramaswamy Memorial Student Grant",
    "William R. Mann Memorial Student Travel Grant",
    "Raj Mittra Travel Grant",
    "Michel Goutmann Memorial Fund",
    "IEEE Magnetic Society Student Travel Award",
    "IEEE Magnetic Society Best Student Paper Award"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <Plane className="h-12 w-12 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Student Travel Grants & Compensation</h1>
          </div>
          <p className="text-xl max-w-3xl opacity-90">
            IEEE offers Student Travel Grants to assist Student Members in attending conferences and presenting papers
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          
          {/* Overview */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Overview</h2>
            <p className="text-gray-600 mb-4">
              IEEE is pleased to offer a number of Student Travel Grants to assist Student Members in attending conferences and presenting papers. Additional student grant opportunities may be found by visiting an IEEE Conference Web site(s) matching your technical interest.
            </p>
          </div>

          {/* IEEE Society Grants */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-4">
              <Award className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">IEEE Society Offering Grants</h2>
            </div>
            <p className="text-gray-600 mb-4">
              IEEE Signal Processing Society that are designated for Student Members only. To apply, you will need to follow the appropriate link to obtain eligibility and applications.
            </p>
            <div className="space-y-3">
              {societyGrants.map((grant, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <p className="text-gray-700">{grant}</p>
                </div>
              ))}
            </div>
          </div>

          {/* IEEE Foundation Grants */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center mb-4">
              <Award className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">IEEE Foundation Student Grants</h2>
            </div>
            <p className="text-gray-600 mb-6">
              The IEEE Foundation supports various Education Funds to support the brightest and most capable young minds. To view each grants requirements or to apply, you will need to visit the Education Funds Web page for further details.
            </p>
            <div className="space-y-3">
              {foundationGrants.map((grant, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-4">
                  <p className="text-gray-700">{grant}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gray-50 py-12 px-6 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Need More Information?</h2>
            <p className="text-lg mb-6 text-gray-600">
              For detailed guidance on student travel grants and application processes, contact our chapter chair
            </p>
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Chapter Chair</h3>
              <p className="text-gray-600 mb-4">
                Get personalized assistance with your grant application and eligibility requirements
              </p>
              <a
                href="mailto:chair@ieeesps-gujarat.org"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
              >
                Contact Chair
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default StudentTravelGrantsPage;