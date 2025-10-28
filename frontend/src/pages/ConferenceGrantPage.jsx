// src/pages/ConferenceGrantPage.jsx
import React from 'react';
import { Mail, FileText, CheckCircle, AlertCircle, DollarSign, Calendar, Users } from 'lucide-react';

const ConferenceGrantPage = () => {
  const conditions = [
    "The conference must be an IEEE conference of repute.",
    "The applicant must be an SPS member of IEEE (Gujarat Section) for at least three consecutive years including the year in which he/she has applied for the grant.",
    "The applicant should not have availed the same grant from the SPS Chapter of IEEE (GS) in the last two years.",
    "The grant includes registration fees only and not applicable to any other expenses like travel, lodging, boarding, etc.",
    "The applicable grant amount will be Rs. 10,000/- or actual Registration Fees whichever is minimum.",
    "The amount will be reimbursed to the applicant after attending the event upon producing the registration fee receipt.",
    "The maximum number of grants allocated per year will be based on the availability of funds."
  ];

  const applicationSections = [
    {
      title: "Section 1 - Personal Details",
      items: ["Name", "Current Affiliation", "Contact details [email and phone number (preferably WhatsApp)]", "IEEE SPS Membership Number"]
    },
    {
      title: "Section 2 - Publication Details", 
      items: ["Title of the Paper", "Name of the Conference", "Venue and Date of the Conference"]
    },
    {
      title: "Section 3 - Details of the Registration Fees",
      items: ["Registration fee amount and payment details"]
    },
    {
      title: "Section 4 - Details of the fund received from SPS or IEEE",
      items: ["Details of the funds received from any other sources for attending the said conference", "Details of the funds received from SPS Chapter of IEEE (GS) in the last 3 years", "Details of any other fund received from IEEE and its related bodies (except the SPS Chapter of IEEE (GS))"]
    },
    {
      title: "Section 5 - Recommendation (Applicable to Students Members only)",
      items: ["Name of the Supervisor", "Endorsement by the Supervisor"]
    },
    {
      title: "Section 6 - Self Declaration",
      items: ["Declaration of information accuracy", "Confirmation of no previous grant in last two years", "Assurance of proper fund utilization", "Commitment to submit utilization report"]
    },
    {
      title: "Section 7 - Attachments",
      items: ["Conference brochure", "Paper Review and Acceptance Email", "Proof of last three years SPS membership renewal"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0077B5] to-[#1E40AF] text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Conference Grant Scheme</h1>
          <p className="text-xl max-w-3xl opacity-90">
            Financial support for SPS members attending IEEE conferences of repute
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Scheme</h2>
            <p className="text-gray-700 mb-6">
              Signal Processing Society (SPS) Chapter of IEEE (Gujarat Section) is pleased to announce the "Conference Grant Scheme of SPS Chapter of IEEE (GS)". Under this scheme, financial support will be provided to SPS members of IEEE (Gujarat Section) whose papers are accepted in IEEE conferences of repute subjected to the following conditions.
            </p>
          </div>

          {/* Grant Details */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold">Grant Amount</h3>
              </div>
              <p className="text-gray-700">Rs. 10,000/- or actual Registration Fees (whichever is minimum)</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold">Processing Time</h3>
              </div>
              <p className="text-gray-700">10 to 15 working days for application review</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold">Eligibility</h3>
              </div>
              <p className="text-gray-700">SPS members of IEEE (Gujarat Section) for 3+ consecutive years</p>
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Conditions & Eligibility</h2>
            <div className="space-y-4">
              {conditions.map((condition, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-[#0077B5] text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{condition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Application Process */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Apply</h2>
            
            {/* Step 1 */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-4">1</div>
                <h3 className="text-xl font-semibold">Submit Application</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Send your application to the Chair, SPS Chapter of IEEE (GS): <strong>Prof. S. K. Mitra</strong> at{' '}
                <a href="mailto:suman_mitra@daiict.ac.in" className="text-[#0077B5] hover:underline">
                  suman_mitra@daiict.ac.in
                </a>
              </p>
              
              <div className="space-y-4">
                {applicationSections.map((section, index) => (
                  <div key={index} className="border-l-4 border-[#0077B5] pl-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{section.title}</h4>
                    <ul className="space-y-1">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700 text-sm flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">2</div>
                <h3 className="text-xl font-semibold">Application Review</h3>
              </div>
              <p className="text-gray-700">
                Based on the availability of funds and application merit, the Chair will make a decision on accepting or rejecting the application and the same will be conveyed to the applicant via email by the secretary. The entire process is expected to take 10 to 15 working days.
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-4">3</div>
                <h3 className="text-xl font-semibold">Reimbursement</h3>
              </div>
              <p className="text-gray-700">
                After completion of the event the applicant is required to share the registration fee receipt for the reimbursement. The applicable amount will be paid through the A/C Pay Cheque in favor of the applicant only.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-[#0077B5] to-[#1E40AF] text-white rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 mr-3" />
              <div>
                <p className="font-semibold">Prof. S. K. Mitra</p>
                <p>Chair, SPS Chapter of IEEE (Gujarat Section)</p>
                <a href="mailto:suman_mitra@daiict.ac.in" className="text-blue-200 hover:text-white">
                  suman_mitra@daiict.ac.in
                </a>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 mt-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold mb-2">Important Note:</p>
                  <p className="text-sm">
                    Please ensure all required documents are attached and information is accurate before submitting your application. 
                    Incomplete applications may result in delays or rejection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConferenceGrantPage;