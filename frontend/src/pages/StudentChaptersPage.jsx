import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Users, Calendar, Mail, Phone, ExternalLink, Building2, GraduationCap } from 'lucide-react';

const StudentChaptersPage = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);

  useEffect(() => {
    fetchStudentChapters();
  }, []);

  const fetchStudentChapters = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/branches/public/student-chapters`);
      if (response.ok) {
        const data = await response.json();
        setChapters(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching student chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <GraduationCap className="h-8 w-8 md:h-12 md:w-12 mr-3 md:mr-4 flex-shrink-0" />
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">Student Chapters</h1>
          </div>
          <p className="text-base md:text-xl max-w-3xl opacity-90 leading-relaxed">
            Discover our active student chapters across Gujarat. Each chapter provides opportunities for students to engage with signal processing research, networking, and professional development.
          </p>
        </div>
      </section>

      {/* Chapters Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {chapters.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No active student chapters found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {chapters.map((chapter) => (
                <div
                  key={chapter._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedChapter(chapter)}
                >
                  <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-blue-400" />
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 flex-1 line-clamp-2">
                        {chapter.name}
                      </h3>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded ml-2 flex-shrink-0">
                        {chapter.code}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Building2 className="h-3 w-3 md:h-4 md:w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{chapter.college_name}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{chapter.city}, {chapter.district}</span>
                      </div>
                      {chapter.member_count > 0 && (
                        <div className="flex items-center">
                          <Users className="h-3 w-3 md:h-4 md:w-4 mr-2 text-gray-400 flex-shrink-0" />
                          <span>{chapter.member_count} members</span>
                        </div>
                      )}
                    </div>

                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                      View Details
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>



      {/* Chapter Details Modal */}
      {selectedChapter && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[999999]">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedChapter.name}
                  </h2>
                  <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded">
                    Chapter Code: {selectedChapter.code}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedChapter(null)}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">

              <div className="space-y-6">
                {/* College Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                    College Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                      <span className="font-medium">{selectedChapter.college_name}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                      <span>{selectedChapter.city}, {selectedChapter.district}</span>
                    </div>
                    {selectedChapter.established_date && (
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                        <span>Established: {formatDate(selectedChapter.established_date)}</span>
                      </div>
                    )}
                    {selectedChapter.member_count > 0 && (
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" />
                        <span>{selectedChapter.member_count} active members</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chairperson Information */}
                {selectedChapter.chairperson && selectedChapter.chairperson.name && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      Chapter Chairperson
                    </h3>
                    <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                      <div className="font-medium text-gray-900 text-lg">
                        {selectedChapter.chairperson.name}
                      </div>
                      {selectedChapter.chairperson.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                          <a
                            href={`mailto:${selectedChapter.chairperson.email}`}
                            className="text-blue-600 hover:text-blue-800 break-all"
                          >
                            {selectedChapter.chairperson.email}
                          </a>
                        </div>
                      )}
                      {selectedChapter.chairperson.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                          <a
                            href={`tel:${selectedChapter.chairperson.phone}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {selectedChapter.chairperson.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Website Link */}
                {selectedChapter.website && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <ExternalLink className="h-5 w-5 mr-2 text-blue-600" />
                      Chapter Website
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <a
                        href={selectedChapter.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <ExternalLink className="h-5 w-5 mr-3" />
                        Visit Chapter Website
                      </a>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-blue-600" />
                    Get Involved
                  </h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                    <p className="text-gray-700 mb-4">
                      Interested in joining this chapter or learning more about their activities?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {selectedChapter.chairperson && selectedChapter.chairperson.email && (
                        <a
                          href={`mailto:${selectedChapter.chairperson.email}?subject=Inquiry about ${selectedChapter.name}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                        >
                          Contact Chapter
                        </a>
                      )}
                      {selectedChapter.website && (
                        <a
                          href={selectedChapter.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-center flex items-center justify-center font-medium"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Website
                        </a>
                      )}
                      <a
                        href="/contact"
                        className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-center font-medium"
                      >
                        General Inquiry
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default StudentChaptersPage;