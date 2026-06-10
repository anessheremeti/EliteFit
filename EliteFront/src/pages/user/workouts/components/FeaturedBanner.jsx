import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function FeaturedBanner({ slides = [] }) {
  const [current, setCurrent] = useState(0);

  // Ndryshimi automatik i sllajdeve çdo 5 sekonda (vetëm nëse ka sllajde)
  useEffect(() => {
    if (!slides || slides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  // Nëse nuk ka sllajde ose të dhënat janë duke u ngarkuar, shfaqet një skeleton loading i thjeshtë
  if (!slides || slides.length === 0) {
    return (
      <div className="w-full h-[300px] sm:h-[400px] bg-gray-100 rounded-3xl animate-pulse flex items-center justify-center text-dark/20">
        <span className="text-sm font-medium">Duke ngarkuar videot kryesore...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] rounded-3xl overflow-hidden bg-dark shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Fotoja e sllajdit (Thumbnail) */}
          <img
            src={slides[current]?.thumbnailUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000'}
            alt={slides[current]?.title}
            className="w-full h-full object-cover opacity-60"
          />

          {/* Gradient overlay për tekstin */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />

          {/* Përmbajtja e Tekstit */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white space-y-2">
            <span className="px-3 py-1 bg-sky text-dark text-xs font-bold uppercase rounded-full tracking-wider">
              {slides[current]?.category || 'Stërvitje'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight max-w-2xl">
              {slides[current]?.title}
            </h1>
            <p className="text-sm text-white/70 max-w-md line-clamp-2">
              {slides[current]?.description || 'Nise stërvitjen tënde të radhës tani dhe arrij objektivat e tu.'}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pikat e navigimit poshtë (Dots) */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current ? 'w-6 bg-sky' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Shko te sllajdi ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}