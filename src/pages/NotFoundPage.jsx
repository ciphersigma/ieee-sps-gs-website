// src/pages/NotFoundPage.jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  const canvasRef = useRef(null);
  
  // Signal processing animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 600;
    const height = canvas.height = 200;
    
    // Set up oscilloscope-like display
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Function to generate signal
    const generateSignal = (time) => {
      const points = [];
      // First portion: normal sine wave
      for (let x = 0; x < width * 0.4; x++) {
        const y = Math.sin((x + time) * 0.05) * 30 + height / 2;
        points.push({ x, y });
      }
      
      // Middle portion: distortion/error
      for (let x = width * 0.4; x < width * 0.6; x++) {
        // Random error pattern for the 404 section
        const noise = (Math.random() - 0.5) * 60;
        const y = Math.sin((x + time) * 0.05) * 30 + height / 2 + noise;
        points.push({ x, y });
      }
      
      // Final portion: normal sine wave
      for (let x = width * 0.6; x < width; x++) {
        const y = Math.sin((x + time) * 0.05) * 30 + height / 2;
        points.push({ x, y });
      }
      
      return points;
    };
    
    // Draw the signal
    let animationFrame;
    let time = 0;
    
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, width, height);
      
      // Draw grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      
      // Vertical grid lines
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Generate and draw the signal
      const signalPoints = generateSignal(time);
      
      // Draw signal
      ctx.strokeStyle = '#8DC63F'; // IEEE SPS Green
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(signalPoints[0].x, signalPoints[0].y);
      
      for (let i = 1; i < signalPoints.length; i++) {
        ctx.lineTo(signalPoints[i].x, signalPoints[i].y);
      }
      
      ctx.stroke();
      
      // Draw "404" text in the oscilloscope
      ctx.fillStyle = '#0077B5'; // IEEE SPS Blue
      ctx.font = 'bold 64px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('404', width / 2, height / 2 + 20);
      
      // Draw a blinking cursor
      if (Math.floor(time / 15) % 2 === 0) {
        ctx.fillStyle = '#8DC63F';
        ctx.fillRect(width / 2 + 80, height / 2 + 5, 10, 2);
      }
      
      time += 1;
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#8DC63F] to-[#0077B5]">
          Signal Lost
        </h1>
        
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8 mx-auto overflow-hidden">
          <canvas 
            ref={canvasRef} 
            width="600" 
            height="200"
            className="max-w-full h-auto mx-auto"
          />
        </div>
        
        <p className="text-xl md:text-2xl mb-4 text-gray-300">
          The signal you're looking for couldn't be processed
        </p>
        
        <p className="text-lg mb-8 text-gray-400">
          Error analysis: The page you requested has experienced signal degradation and cannot be found in our frequency domain.
        </p>
        
        <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
          <Link 
            to="/" 
            className="px-8 py-3 rounded-lg font-medium bg-[#0077B5] text-white hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Return to Home
          </Link>
          
          <Link 
            to="/contact" 
            className="px-8 py-3 rounded-lg font-medium bg-[#8DC63F] text-white hover:bg-green-600 transition-colors inline-flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Report Issue
          </Link>
        </div>
        
        <div className="mt-12 text-gray-500 text-sm">
          <p>
            Try applying a low-pass filter and searching again, or return to our main signal source.
          </p>
        </div>
      </div>
      
      {/* IEEE SPS Footer */}
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500">
          IEEE Signal Processing Society Gujarat Chapter
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
