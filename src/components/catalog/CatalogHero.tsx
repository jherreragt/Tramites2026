import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, FileText, Search, TrendingUp } from 'lucide-react';

interface CatalogHeroProps {
  totalProcedures: number;
}

const slides = [
  {
    id: 1,
    title: 'Catálogo Completo de Trámites',
    description: 'Encuentra todos los trámites disponibles en un solo lugar',
    gradient: 'from-blue-800 to-blue-900',
    icon: FileText
  },
  {
    id: 2,
    title: 'Búsqueda Rápida y Eficiente',
    description: 'Utiliza nuestros filtros para encontrar exactamente lo que necesitas',
    gradient: 'from-blue-600 to-blue-700',
    icon: Search
  },
  {
    id: 3,
    title: 'Los Trámites Más Solicitados',
    description: 'Descubre cuáles son los procedimientos más populares',
    gradient: 'from-blue-600 to-blue-700',
    icon: TrendingUp
  }
];

export default function CatalogHero({ totalProcedures }: CatalogHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="mb-8">

      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className={`bg-gradient-to-r ${currentSlideData.gradient} text-white transition-all duration-500`}>
          <div className="max-w-4xl mx-auto px-8 py-16 text-center">
            <Icon className="w-16 h-16 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {currentSlideData.title}
            </h2>
            <p className="text-xl text-white/90">
              {currentSlideData.description}
            </p>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Siguiente slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
