import React from 'react';
import { BookOpen, Users, Award } from 'lucide-react';

// Define the component
const AboutSection = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Research Excellence',
      description: 'Leading research in signal processing, machine learning, and communication systems with cutting-edge methodologies.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Professional Network',
      description: 'Connect with industry leaders, researchers, and peers across Gujarat and international IEEE community.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Recognition Programs',
      description: 'Awards and recognition for outstanding contributions to signal processing research and education.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About IEEE SPS Gujarat
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            The IEEE Signal Processing Society Gujarat Chapter is dedicated to advancing the theory and application of signal processing through collaboration, education, and professional development.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-8 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-center mb-4 text-blue-600 dark:text-blue-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Make sure this line is present and not commented out
export default AboutSection;