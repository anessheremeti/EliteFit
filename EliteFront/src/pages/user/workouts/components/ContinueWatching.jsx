import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80';

function ContinueCard({ item }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 380, damping: 24 }}
      className="flex-none w-[290px] bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden flex cursor-pointer"
    >
      {/* Pjesa vizuale - tani përdorim vetëm PLACEHOLDER pasi nuk kemi URL nga backend */}
      <div className="relative w-[112px] flex-none">
        <img
          src={PLACEHOLDER}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-md backdrop-blur-sm">
          {item.durationMin} min
        </span>
        <div className="absolute bottom-0 inset-x-0 h-1 bg-black/20">
          <div
            className="h-full bg-sky transition-all duration-300"
            style={{ width: `${item.progressPct}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-between gap-2 px-3 py-2 min-w-0">
        <p className="text-sm font-semibold text-dark truncate leading-snug">{item.title}</p>
        <button className="flex-none text-[12px] border border-sky/50 text-sky px-3 py-1.5 rounded-full font-semibold hover:bg-sky/5 active:scale-95 transition-all whitespace-nowrap">
          Resume
        </button>
      </div>
    </motion.div>
  );
}

export function ContinueWatching({ items = [], loading = false }) {
  if (loading) {
    return (
      <section>
        <h2 className="text-lg font-bold text-dark mb-3">Continue Watching</h2>
        <div className="flex gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-none w-[290px] h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  // Nëse nuk ka asgjë, komponenti nuk shfaqet
  if (!items || items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-dark">Continue Watching</h2>
        <button className="flex items-center gap-0.5 text-sm text-sky font-semibold hover:underline underline-offset-2">
          See all <ChevronRight size={15} />
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {items.map(item => (
          <ContinueCard key={item.progressId} item={item} />
        ))}
      </div>
    </section>
  );
}