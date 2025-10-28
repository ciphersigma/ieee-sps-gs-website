import React from 'react';
import { Users, Award, BookOpen, Globe, DollarSign, Calendar } from 'lucide-react';

const JoinBenefitsPage = () => {
  const benefits = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Complimentary Tools & Resources",
      description: "Access to top-ranked educational resources and research materials"
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      title: "Global Network",
      description: "Connect with professionals, academics, and students worldwide"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-blue-600" />,
      title: "Exclusive Discounts",
      description: "Special pricing on world-class SPS products and services"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Volunteer Opportunities",
      description: "Become an asset to society activities and community initiatives"
    }
  ];

  const membershipTypes = [
    {
      type: "Student Member",
      price: "$1 USD / year",
      description: "Perfect for students learning about signal processing and career development",
      features: [
        "Career development opportunities",
        "Student-focused competitions",
        "Seasonal Schools for graduate students",
        "Travel grants to SPS conferences"
      ]
    },
    {
      type: "Professional Member",
      price: "$22 USD / year",
      description: "Full membership with complete access to all SPS benefits",
      features: [
        "Full conference access",
        "Professional networking",
        "Award eligibility",
        "Complete resource library"
      ]
    },
    {
      type: "Electronic Member",
      price: "$11 USD / year",
      description: "Digital-only membership with online resources and benefits",
      features: [
        "Digital publications",
        "Online conferences",
        "Electronic resources",
        "Virtual networking"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Join IEEE Signal Processing Society
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-6">
              A membership with the IEEE Signal Processing Society (SPS) provides you with dynamic opportunities to collaborate and connect with industry professionals, academics, and students alike working toward the advancement of signal processing and the technology it enables.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              When you join SPS, you'll have access to conferences and events, employment and professional networking opportunities, award eligibility, and top-ranked educational resources that help build rewarding, lifelong careers in the signal processing fields.
            </p>
          </div>
        </div>

        {/* Student Focus Section */}
        <div className="bg-blue-50 rounded-lg p-8 mb-16">
          <div className="flex items-center mb-4">
            <Award className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Student Benefits</h2>
          </div>
          <p className="text-gray-700 text-lg">
            If you're a student looking to learn more about signal processing and careers within the field, a student membership with SPS offers unique benefits, including opportunities for career development, student-focused competitions, Seasonal Schools for graduate students, and travel grants to attend SPS flagship conferences around the world.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Join us in shaping the future of our digital life
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            With an SPS membership, you can:
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Membership Details */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Membership Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {membershipTypes.map((membership, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 text-white p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">{membership.type}</h3>
                  <div className="text-3xl font-bold">{membership.price}</div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{membership.description}</p>
                  <ul className="space-y-2">
                    {membership.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Now Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-xl mb-6">
            Become part of the global signal processing community today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.ieee.org/membership/join/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Join IEEE SPS
            </a>
            <a
              href="https://signalprocessingsociety.org/community-involvement"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinBenefitsPage;