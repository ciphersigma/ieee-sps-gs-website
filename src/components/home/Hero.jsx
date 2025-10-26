// src/components/home/Hero.jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

const Hero = () => {
  const canvasRef = useRef(null);
  
  // Signal processing animation using canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match window size
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      return { width: window.innerWidth, height: window.innerHeight };
    };
    
    const dimensions = setCanvasDimensions();
    
    // Parameters for the signal
    let time = 0;
    const baseFreq = 0.005; // Lower frequency for slower wave
    const amplitude = dimensions.height * 0.08; // Relative to screen height
    const centerY = dimensions.height * 0.5; // Center of screen
    
    // Color settings
    const blueColor = '#0077B5'; // IEEE blue
    const greenColor = '#8DC63F'; // IEEE green
    
    // Traveling particles
    const particles = [];
    const numParticles = 12;
    
    // Initialize traveling particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * dimensions.width,
        wave: Math.random() > 0.5, // true = blue wave, false = green wave
        speed: 1 + Math.random() * 2, // Random speed
        size: 2 + Math.random() * 3,
        opacity: 0.5 + Math.random() * 0.5
      });
    }
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Draw the grid - slightly more visible
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'; // Increased from 0.07 to 0.15
      ctx.lineWidth = 0.5;
      
      const gridSize = 25;
      
      // Vertical grid lines
      for (let x = 0; x < dimensions.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dimensions.height);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let y = 0; y < dimensions.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.width, y);
        ctx.stroke();
      }
      
      // Draw main wave (blue)
      ctx.strokeStyle = 'rgba(0, 119, 181, 0.4)'; // IEEE blue with low opacity
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Store points for the blue wave for particle movement
      const blueWavePoints = [];
      for (let x = 0; x < dimensions.width; x += 5) {
        const y = centerY + Math.sin((x * baseFreq) + time) * amplitude;
        blueWavePoints.push({ x, y });
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Draw secondary wave (green, dotted)
      ctx.strokeStyle = 'rgba(141, 198, 63, 0.3)'; // IEEE green with low opacity
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 10]); // Dashed line
      ctx.beginPath();
      
      // Store points for the green wave for particle movement
      const greenWavePoints = [];
      for (let x = 0; x < dimensions.width; x += 5) {
        // Secondary wave with different phase
        const y = centerY + Math.sin((x * baseFreq) + time + Math.PI) * (amplitude * 0.8);
        greenWavePoints.push({ x, y });
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash
      
      // Draw signal points at key positions
      const signalPoints = [];
      const numPoints = 8; // More points across screen
      
      for (let i = 0; i < numPoints; i++) {
        const x = dimensions.width * (i / (numPoints - 1));
        const y = centerY + Math.sin((x * baseFreq) + time) * amplitude;
        
        // Only add points on the blue wave
        signalPoints.push({ x, y, color: i % 2 === 0 ? blueColor : greenColor });
      }
      
      // Add points on the green wave
      for (let i = 0; i < numPoints - 1; i++) {
        const x = dimensions.width * ((i + 0.5) / (numPoints - 1));
        const y = centerY + Math.sin((x * baseFreq) + time + Math.PI) * (amplitude * 0.8);
        
        // These points go on the green wave
        if (i % 2 === 0) {
          signalPoints.push({ x, y, color: greenColor });
        }
      }
      
      // Draw points
      signalPoints.forEach((point) => {
        ctx.fillStyle = point.color === blueColor 
          ? 'rgba(0, 119, 181, 0.6)' 
          : 'rgba(141, 198, 63, 0.6)';
          
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Update and draw traveling particles
      particles.forEach((particle, index) => {
        // Move particles from left to right
        particle.x += particle.speed;
        
        // Reset particles that move off screen
        if (particle.x > dimensions.width) {
          particle.x = 0;
          particle.wave = Math.random() > 0.5;
          particle.speed = 1 + Math.random() * 2;
          particle.size = 2 + Math.random() * 3;
          particle.opacity = 0.5 + Math.random() * 0.5;
        }
        
        // Calculate y position based on which wave it's following
        const xIndex = Math.floor(particle.x / 5);
        const points = particle.wave ? blueWavePoints : greenWavePoints;
        
        if (xIndex >= 0 && xIndex < points.length) {
          const y = points[xIndex].y;
          
          // Draw the particle
          ctx.fillStyle = particle.wave 
            ? `rgba(0, 119, 181, ${particle.opacity})` 
            : `rgba(141, 198, 63, ${particle.opacity})`;
            
          ctx.beginPath();
          ctx.arc(particle.x, y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add glow effect
          const gradient = ctx.createRadialGradient(
            particle.x, y, 0,
            particle.x, y, particle.size * 3
          );
          gradient.addColorStop(0, particle.wave 
            ? `rgba(0, 119, 181, ${particle.opacity * 0.8})` 
            : `rgba(141, 198, 63, ${particle.opacity * 0.8})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, y, particle.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      // Add traveling pulse effect along both waves
      const pulsePosition = (time * 100) % dimensions.width;
      
      // Pulse on blue wave
      const blueY = centerY + Math.sin((pulsePosition * baseFreq) + time) * amplitude;
      ctx.fillStyle = 'rgba(0, 119, 181, 0.8)';
      ctx.beginPath();
      ctx.arc(pulsePosition, blueY, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Glow for blue pulse
      const blueGradient = ctx.createRadialGradient(
        pulsePosition, blueY, 0,
        pulsePosition, blueY, 20
      );
      blueGradient.addColorStop(0, 'rgba(0, 119, 181, 0.6)');
      blueGradient.addColorStop(1, 'rgba(0, 119, 181, 0)');
      
      ctx.fillStyle = blueGradient;
      ctx.beginPath();
      ctx.arc(pulsePosition, blueY, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Pulse on green wave
      const greenY = centerY + Math.sin((pulsePosition * baseFreq) + time + Math.PI) * (amplitude * 0.8);
      ctx.fillStyle = 'rgba(141, 198, 63, 0.8)';
      ctx.beginPath();
      ctx.arc(pulsePosition, greenY, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Glow for green pulse
      const greenGradient = ctx.createRadialGradient(
        pulsePosition, greenY, 0,
        pulsePosition, greenY, 20
      );
      greenGradient.addColorStop(0, 'rgba(141, 198, 63, 0.6)');
      greenGradient.addColorStop(1, 'rgba(141, 198, 63, 0)');
      
      ctx.fillStyle = greenGradient;
      ctx.beginPath();
      ctx.arc(pulsePosition, greenY, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Update time for next frame (slower)
      time += 0.01; // Reduced speed
      requestAnimationFrame(animate);
    };
    
    // Handle window resize
    const handleResize = () => {
      setCanvasDimensions();
    };
    
    window.addEventListener('resize', handleResize);
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background with IEEE SPS colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-secondary-400 to-primary-700"></div>
      
      {/* Full-screen canvas for signal animation */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-10"
        style={{ opacity: 0.8 }}
      ></canvas>
      
      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
          IEEE Signal Processing Society
        </h1>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
          Gujarat Chapter
        </h2>
        
        <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto">
          Join us in advancing the theory and application of signal processing across
          Gujarat through research, education, and collaborative innovation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/events" 
            className="inline-flex items-center px-6 py-3 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition-colors font-medium"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Explore Events
          </Link>
          
          <Link 
            to="/join" 
            className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-md hover:bg-white/10 transition-colors font-medium"
          >
            Join Our Community
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 w-full z-20">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 md:h-24">
          <path 
            d="M0,0 C600,120 1000,0 1200,0 L1200,120 L0,120 Z" 
            fill="white">
          </path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;