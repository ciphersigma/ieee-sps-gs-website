// src/components/home/ImageCarousel.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';

const ImageCarousel = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch carousel images from API
  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        setLoading(true);
        const data = await api.getCarouselImages();
        setImages(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching carousel images:', err);
        setError('Failed to load carousel images');
        setLoading(false);
      }
    };
    
    fetchCarouselImages();
  }, []);

  // Auto slideshow
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [images.length]);

  // Navigation functions
  const prevSlide = () => {
    if (images.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    if (images.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <ImageIcon className="h-10 w-10 text-gray-400" />
              <p className="mt-3 text-gray-500 text-sm">Loading...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error or no images
  if (error || images.length === 0) {
    return (
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
            <div className="text-center">
              <ImageIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-gray-900">
                {error || "No images available"}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {error ? "Please try again later" : "Images will appear here once added"}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Carousel container with reduced height */}
        <div className="relative h-64 md:h-72 overflow-hidden rounded-lg shadow-md border border-gray-100">
          <div className="absolute inset-0 w-full h-full">
            {/* Slides */}
            <div 
              className="h-full flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {images.map((image, index) => (
                <div key={image.id} className="flex-shrink-0 w-full h-full relative">
                  <img 
                    src={image.image_url} 
                    alt={image.description || "IEEE SPS Gujarat"} 
                    className="w-full h-full object-contain bg-white"
                  />
                  {/* Title overlay with IEEE blue theme */}
                  {image.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(37,99,235,0.7)] to-transparent text-white p-3">
                      <p className="text-sm font-medium">{image.title}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons - styled to match blue theme */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full bg-white/70 hover:bg-white text-blue-700 shadow-sm z-10 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full bg-white/70 hover:bg-white text-blue-700 shadow-sm z-10 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
              
              {/* Dots indicator - styled with blue theme */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1.5 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide 
                        ? 'bg-blue-600' 
                        : 'bg-white/70 hover:bg-white/90'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;