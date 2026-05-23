import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=80';

export function FeaturedBanner({ slides = [] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setCurrent(i => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <div className="relative w-full h-[260px] md:h-[280px] bg-dark animate-pulse" />
    );
  }

  const slide = slides[current];

  return (
    <div className="relative w-full h-[260px] md:h-[280px] overflow-hidden bg-dark select-none">

      <AnimatePresence mode="wait">
        <motion.img
          key={slide.id}
          src={slide.thumbnailUrl || PLACEHOLDER_IMG}
          alt={slide.title}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
          draggable={false}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

      <div className="relative h-full flex flex-col justify-center px-8 md:px-10 max-w-[480px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col"
          >
            <span className="text-sky text-xs font-bold uppercase tracking-widest mb-2">
              {slide.label ?? slide.category ?? 'Featured'}
            </span>
            <h1 className="text-white text-3xl md:text-[2.4rem] font-bold leading-tight mb-2.5 drop-shadow-sm">
              {slide.title}
            </h1>
            <p className="text-white/65 text-sm leading-relaxed mb-5 max-w-[280px]">
              {slide.description ?? `${slide.difficulty} · ${slide.durationMin} min`}
            </p>
            <button className="inline-flex items-center bg-pink text-white px-6 py-2.5 rounded-full text-sm font-bold w-fit shadow-lg shadow-pink/25 hover:bg-pink/90 active:scale-95 transition-all duration-150">
              Start Now
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      <button className="absolute right-[28%] top-1/2 -translate-y-1/2 w-[56px] h-[56px] rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all">
        <Play size={20} fill="white" className="text-white ml-0.5" />
      </button>

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
