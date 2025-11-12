'use client';

import React from 'react';
import { Target, Zap, Users, BookOpen, Award, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const AboutSection = () => {
  const activities = [
    {
      icon: BookOpen,
      title: 'Research',
      description: 'Promoting cutting-edge research in signal processing through publications, conferences, and collaborations.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a vibrant community of professionals, researchers, and students passionate about signal processing.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Fostering innovation in signal processing applications across communications, healthcare, and emerging technologies.'
    },
    {
      icon: Award,
      title: 'Recognition',
      description: 'Recognizing excellence in signal processing through awards, competitions, and special programs.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with Green Accent */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <h2 className="text-3xl md:text-4xl font-bold relative inline-block">
              About IEEE SPS Gujarat
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary-500 transform translate-y-2"></span>
            </h2>
          </div>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Advancing signal processing technology and applications in Gujarat through research, education, and collaboration.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Column: Text Content */}
          <div>
            <div className="mb-8 relative pl-5 border-l-4 border-primary-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700">
                The IEEE Signal Processing Society Gujarat Chapter is dedicated to promoting research, development, and education in signal processing, while fostering professional growth and networking opportunities for our members.
              </p>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <p>
                Established in 2015, our chapter serves as a hub for signal processing professionals, researchers, and students across Gujarat, providing a platform for knowledge exchange and collaboration in this rapidly evolving field.
              </p>
              <p>
                We organize workshops, conferences, technical talks, and networking events to connect our members with industry leaders, renowned academics, and fellow enthusiasts in signal processing.
              </p>
            </div>

            <div className="mt-8">
              <Link 
                href="/about" 
                className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-all duration-300 shadow-md"
              >
                <Globe className="mr-2 h-5 w-5" />
                Learn More About Us
              </Link>
            </div>
          </div>

          {/* Right Column: Image or Stat Card */}
          <div className="relative">
            {/* Main image with decorative elements */}
            <div className="rounded-lg overflow-hidden shadow-xl relative z-10">
              <Image 
                src="/assets/images/ExCommMeet24-2-600x400.jpeg"
                alt="IEEE SPS Gujarat Chapter Meeting" 
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-primary-500 -mt-4 -mr-4 z-0"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-primary-500 -mb-4 -ml-4 z-0"></div>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12">
            <span className="inline-block pb-2 border-b-4 border-primary-500">What We Do</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-primary-500/10 p-3 rounded-full inline-block mb-4">
                    <Icon className="h-8 w-8 text-primary-500" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h4>
                  <p className="text-gray-600">{activity.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;