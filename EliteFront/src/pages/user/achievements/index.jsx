import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Target, AlertCircle, RefreshCw } from 'lucide-react';
import { badgeService }        from '../../../services/badgeService';
import { BadgeCard }           from './components/BadgeCard';
import { BadgeCardSkeleton }   from './components/BadgeCardSkeleton';
import { BadgeDetailModal }    from './components/BadgeDetailModal';

// ── Animation variants ────────────────────────────────────────────────────────

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.04 } },
};
const cardItem = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.24 } },
};

// ── Category filters ──────────────────────────────────────────────────────────

const CATEGORY_ICONS = {
  All:       { emoji: '🏅', color: 'text-gray-500' },
  Workout:   { emoji: '🏋️', color: 'text-blue-500'   },
  Streak:    { emoji: '🔥', color: 'text-orange-500' },
  Calorie:   { emoji: '⚡', color: 'text-red-500'    },
  Nutrition: { emoji: '🥗', color: 'text-green-500'  },
  Milestone: { emoji: '🌟', color: 'text-purple-500' },
};

// ── Stats header ──────────────────────────────────────────────────────────────

function StatChip({ icon, label, value, accent }) {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5 px-4 py-3
                    bg-white rounded-2xl border border-black/5 shadow-sm min-w-[80px]">
      <span className={accent}>{icon}</span>
      <span className="text-base font-bold text-dark leading-none">{value}</span>
      <span className="text-[10px] text-dark/40 font-medium leading-none">{label}</span>
    </div>
  );
}

function AchievementHeader({ summary }) {
  const { totalEarned, totalBadges, totalPoints, completionPct } = summary;

  return (
    <div className="space-y-4">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-dark">Achievements</h1>
          <p className="text-sm text-dark/45 mt-0.5">Your fitness milestones &amp; earned badges</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100
                        flex items-center justify-center shadow-sm">
          <Trophy size={22} className="text-amber-500" />
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-bold text-dark">{completionPct}% complete</span>
          <span className="text-xs text-dark/40">{totalEarned} / {totalBadges} badges</span>
        </div>
        <div className="h-2 bg-black/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
            className="h-full rounded-full bg-amber-400"
          />
        </div>
      </div>

      {/* Stat chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <StatChip
          icon={<Trophy size={16} />}
          label="Earned"
          value={totalEarned}
          accent="text-amber-500"
        />
        <StatChip
          icon={<Zap size={16} />}
          label="Total XP"
          value={totalPoints.toLocaleString()}
          accent="text-yellow-500"
        />
        <StatChip
          icon={<Target size={16} />}
          label="Remaining"
          value={totalBadges - totalEarned}
          accent="text-dark/40"
        />
        <StatChip
          icon={<Star size={16} />}
          label="Total"
          value={totalBadges}
          accent="text-sky"
        />
      </div>
    </div>
  );
}

// ── Category filter tabs ──────────────────────────────────────────────────────

function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map(cat => {
        const cfg      = CATEGORY_ICONS[cat] ?? CATEGORY_ICONS.All;
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                        whitespace-nowrap transition-all duration-150 border
                        ${isActive
                          ? 'bg-dark text-white border-dark shadow-sm'
                          : 'bg-white text-dark/60 border-black/8 hover:border-black/15 hover:text-dark'}`}
          >
            <span className="text-sm leading-none">{cfg.emoji}</span>
            {cat}
          </button>
        );
      })}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyCategory({ category, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-dark/30">
      <span className="text-5xl">{(CATEGORY_ICONS[category] ?? CATEGORY_ICONS.All).emoji}</span>
      <p className="text-sm font-medium">No badges in this category yet</p>
      <button
        onClick={onReset}
        className="text-xs text-sky font-semibold hover:underline"
      >
        View all badges
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AchievementsPage() {
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);

  const load = useCallback(async (cat) => {
    setLoading(true);
    setError(null);
    try {
      const res = await badgeService.getGallery(cat);
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load achievements.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(category); }, [load, category]);

  function handleCategoryChange(cat) {
    setCategory(cat);
  }

  // ── Skeletons ──────────────────────────────────────────────────────────────
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="px-4 md:px-6 py-5 max-w-7xl mx-auto space-y-6">
          <div className="space-y-2">
            <div className="h-7 w-40 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 w-56 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-2 bg-gray-100 rounded-full animate-pulse" />
          <div className="flex gap-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-8 w-20 bg-gray-100 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 20 }).map((_, i) => <BadgeCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error && !data) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8 max-w-sm text-center">
          <AlertCircle size={32} className="text-rose-400" />
          <p className="text-sm font-medium text-dark/60">{error}</p>
          <button
            onClick={() => load(category)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark text-white
                       text-sm font-semibold hover:bg-dark/90 transition-colors"
          >
            <RefreshCw size={14} /> Try again
          </button>
        </div>
      </div>
    );
  }

  const { summary, badges } = data;
  const categories          = summary.categories ?? ['All'];

  return (
    <div className="min-h-screen bg-surface">
      <div className="px-4 md:px-6 py-5 max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <AchievementHeader summary={summary} />

        {/* Category tabs */}
        <CategoryTabs
          categories={categories}
          active={category}
          onChange={handleCategoryChange}
        />

        {/* Error banner (partial) */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700">
            <AlertCircle size={16} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Grid or empty state */}
        {!loading && badges.length === 0 ? (
          <EmptyCategory
            category={category}
            onReset={() => handleCategoryChange('All')}
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={category}
              variants={container}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <BadgeCardSkeleton key={i} />)
                : badges.map(badge => (
                    <motion.div key={badge.id} variants={cardItem}>
                      <BadgeCard badge={badge} onClick={setSelected} />
                    </motion.div>
                  ))}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="h-8" />
      </div>

      {/* Detail modal */}
      <BadgeDetailModal
        badge={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
