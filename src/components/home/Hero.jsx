// src/components/home/Hero.jsx
import React from 'react';

const Hero = () => {
  // CSS for animations
  const animationStyles = `
    @keyframes wave {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.08; }
      50% { opacity: 0.12; }
    }
    
    @keyframes float {
      0% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
      100% { transform: translateY(0); }
    }
    
    .wave-animation {
      animation: wave 25s linear infinite;
    }
    
    .pulse-animation {
      animation: pulse 8s ease-in-out infinite;
    }
    
    .float-animation {
      animation: float 15s ease-in-out infinite;
    }
  `;

  return (
    <section id="home" className="relative pt-16 overflow-hidden min-h-screen flex items-center">
      {/* Include the CSS animations */}
      <style>{animationStyles}</style>
      
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"></div>
      
      {/* Grid background - keeping the original opacity */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-gray-400"/>
        </svg>
      </div>
      
      {/* Signal Processing Waveforms - with original opacity levels */}
      <div className="absolute inset-0 opacity-10">
        {/* Animated sine waves that move horizontally */}
        <div className="absolute inset-0 wave-animation" style={{ width: '200%' }}>
          <svg className="w-full h-full" viewBox="0 0 2400 800" preserveAspectRatio="none">
            {/* Sine wave */}
            <path 
              d="M0,400 Q150,300 300,400 T600,400 T900,400 T1200,400 T1500,400 T1800,400 T2100,400 T2400,400" 
              fill="none" 
              stroke="#4f46e5" 
              strokeWidth="2"
              opacity="0.4"
            />
            
            {/* Cosine wave */}
            <path 
              d="M0,500 Q150,600 300,500 T600,500 T900,500 T1200,500 T1500,500 T1800,500 T2100,500 T2400,500" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="2"
              opacity="0.4"
            />
            
            {/* Digital pulse signal */}
            <path 
              d="M0,300 H100 V250 H200 V300 H300 V250 H400 V300 H500 V250 H600 V300 H700 V250 H800 V300" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="3"
              opacity="0.3"
              strokeLinecap="square"
              strokeDasharray="0"
              transform="translate(600, 0)"
            />
          </svg>
        </div>
        
        {/* FFT-like visualization - pulsing effect */}
        <div className="absolute inset-0 pulse-animation">
          <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            <g transform="translate(600, 650)">
              {/* Frequency bars */}
              {[...Array(30)].map((_, i) => {
                const height = 20 + Math.sin(i * 0.3) * 15 + Math.floor(Math.random() * 80);
                return (
                  <rect 
                    key={i} 
                    x={i * 20 - 300} 
                    y={-height} 
                    width="10" 
                    height={height} 
                    fill={i % 3 === 0 ? "#4f46e5" : (i % 3 === 1 ? "#3b82f6" : "#60a5fa")} 
                    rx="2"
                    opacity={0.2 + (i % 5) * 0.02}
                  />
                );
              })}
            </g>
          </svg>
        </div>
        
        {/* Floating signal nodes */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
            {/* Generate floating nodes */}
            {[...Array(12)].map((_, i) => {
              const x = 100 + (i * 100) % 1000;
              const y = 100 + (i * 70) % 600;
              const delay = i * 0.5;
              
              return (
                <g key={i} className="float-animation" style={{ animationDelay: `${delay}s` }}>
                  <circle cx={x} cy={y} r="5" fill="#3b82f6" opacity="0.4" />
                  <circle cx={x} cy={y} r="15" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.2" />
                  <circle cx={x} cy={y} r="30" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.1" />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            IEEE Signal Processing Society
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium mb-6 text-blue-600">
            Gujarat Chapter
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Advancing the theory and application of signal processing and fostering scientific research and technological innovation in Gujarat
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1">
              Join Us Today
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300">
              Explore Events
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;