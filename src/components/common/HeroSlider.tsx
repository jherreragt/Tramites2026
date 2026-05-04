import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  backgroundColor: string;
  textColor: string;
  buttonText?: string;
  buttonAction?: () => void;
  stats?: Array<{
    label: string;
    value: string;
  }>;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  height?: string;
}

export default function HeroSlider({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  height = 'h-96'
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, slides.length, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (slides.length === 0) return null;

  const currentSlideData = slides[currentSlide];

  return (
    <div className={`relative ${height} overflow-hidden`}>
      {/* Background with gradient overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: currentSlideData.backgroundImage ? `url(${currentSlideData.backgroundImage})` : 'none',
          backgroundColor: currentSlideData.backgroundColor
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            <div className="mb-6">
              <h1 
                className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight transition-all duration-500 ${currentSlideData.textColor}`}
                style={{ 
                  animation: `slideInUp 0.8s ease-out ${currentSlide * 0.1}s both`
                }}
              >
                {currentSlideData.title}
              </h1>
              
              <h2 
                className={`text-xl md:text-2xl lg:text-3xl mb-6 transition-all duration-500 ${currentSlideData.textColor} opacity-90`}
                style={{ 
                  animation: `slideInUp 0.8s ease-out ${currentSlide * 0.1 + 0.2}s both`
                }}
              >
                {currentSlideData.subtitle}
              </h2>
              
              <p 
                className={`text-lg md:text-xl mb-8 max-w-3xl leading-relaxed transition-all duration-500 ${currentSlideData.textColor} opacity-80`}
                style={{ 
                  animation: `slideInUp 0.8s ease-out ${currentSlide * 0.1 + 0.4}s both`
                }}
              >
                {currentSlideData.description}
              </p>
            </div>

            {/* Stats */}
            {currentSlideData.stats && (
              <div 
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
                style={{ 
                  animation: `slideInUp 0.8s ease-out ${currentSlide * 0.1 + 0.6}s both`
                }}
              >
                {currentSlideData.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-2xl md:text-3xl font-bold ${currentSlideData.textColor} mb-1`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${currentSlideData.textColor} opacity-80`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Button */}
            {currentSlideData.buttonText && currentSlideData.buttonAction && (
              <div
                style={{ 
                  animation: `slideInUp 0.8s ease-out ${currentSlide * 0.1 + 0.8}s both`
                }}
              >
                <button
                  onClick={currentSlideData.buttonAction}
                  className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
                >
                  {currentSlideData.buttonText}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Play/Pause Button */}
      {autoPlay && slides.length > 1 && (
        <button
          onClick={togglePlayPause}
          className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      )}

      {/* Slide Indicator */}
      {slides.length > 1 && (
        <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          {currentSlide + 1} / {slides.length}
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}