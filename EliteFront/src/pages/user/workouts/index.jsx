import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FeaturedBanner }   from './components/FeaturedBanner';
import { FilterBar }        from './components/FilterBar';
import { ContinueWatching } from './components/ContinueWatching';
import { WorkoutCard }      from './components/WorkoutCard';
import { WorkoutRow }       from './components/WorkoutRow';
import { DIFFICULTIES, MUSCLE_GROUPS, DURATIONS } from './data/workouts';
import { workoutService }   from '../../../services/workoutService';

const DURATION_RANGES = {
  '< 15 min':  [0,  14],
  '15–30 min': [15, 30],
  '30–45 min': [30, 45],
  '45–60 min': [45, 60],
  '60+ min':   [60, Infinity],
};

// Preferred display order for muscle group sections
const SECTION_ORDER = ['Core', 'Upper Body', 'Lower Body', 'Full Body'];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

export default function WorkoutsPage() {
  const [workouts,    setWorkouts]    = useState([]);
  const [featured,    setFeatured]    = useState([]);
  const [continuing,  setContinuing]  = useState([]);
  const [categories,  setCategories]  = useState(['All']);
  const [loading,     setLoading]     = useState(true);
  const [contLoading, setContLoading] = useState(true);

  const [category,    setCategory]    = useState('All');
  const [difficulty,  setDifficulty]  = useState('All');
  const [muscleGroup, setMuscleGroup] = useState('All');
  const [duration,    setDuration]    = useState('All');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [all, feat, cats] = await Promise.all([
          workoutService.getAll(),
          workoutService.getFeatured(3),
          workoutService.getCategories(),
        ]);
        if (cancelled) return;
        setWorkouts(all);
        setFeatured(feat);
        setCategories(['All', ...cats]);
      } catch (err) {
        console.error('Failed to load workouts:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function loadContinue() {
      try {
        const data = await workoutService.getContinueWatching();
        if (!cancelled) setContinuing(data);
      } catch {
        // user has no in-progress workouts — silent
      } finally {
        if (!cancelled) setContLoading(false);
      }
    }

    load();
    loadContinue();
    return () => { cancelled = true; };
  }, []);

  const hasFilters = category !== 'All' || difficulty !== 'All' || muscleGroup !== 'All' || duration !== 'All';

  const filtered = useMemo(() => {
    if (!hasFilters) return workouts;
    return workouts.filter(w => {
      if (category    !== 'All' && w.category    !== category)    return false;
      if (difficulty  !== 'All' && w.difficulty  !== difficulty)  return false;
      if (muscleGroup !== 'All' && w.muscleGroup !== muscleGroup) return false;
      if (duration !== 'All') {
        const [min, max] = DURATION_RANGES[duration] ?? [0, Infinity];
        if (w.durationMin < min || w.durationMin > max) return false;
      }
      return true;
    });
  }, [workouts, hasFilters, category, difficulty, muscleGroup, duration]);

  // Group all workouts by muscleGroup for the sections layout
  const sections = useMemo(() => {
    if (hasFilters) return [];
    const map = new Map();
    for (const w of workouts) {
      const key = w.muscleGroup ?? 'Other';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(w);
    }
    // Sort sections: known order first, then alphabetical for anything else
    const entries = [...map.entries()];
    entries.sort(([a], [b]) => {
      const ai = SECTION_ORDER.indexOf(a);
      const bi = SECTION_ORDER.indexOf(b);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.localeCompare(b);
    });
    return entries;
  }, [workouts, hasFilters]);

  function clearFilters() {
    setCategory('All'); setDifficulty('All');
    setMuscleGroup('All'); setDuration('All');
  }

  return (
    <div className="min-h-screen bg-surface">

      <FeaturedBanner slides={featured} />

      <div className="px-6 py-5 space-y-8">

        <FilterBar
          categories={categories}
          category={category}       onCategoryChange={setCategory}
          difficulty={difficulty}   onDifficultyChange={setDifficulty}
          muscleGroup={muscleGroup} onMuscleGroupChange={setMuscleGroup}
          duration={duration}       onDurationChange={setDuration}
          difficulties={DIFFICULTIES}
          muscleGroups={MUSCLE_GROUPS}
          durations={DURATIONS}
        />

        <ContinueWatching items={continuing} loading={contLoading} />

        {/* ── Sections layout (no active filters) ── */}
        {!hasFilters && (
          loading ? (
            <div className="space-y-10">
              {[1, 2, 3].map(i => (
                <WorkoutRow key={i} title="" workouts={[]} loading />
              ))}
            </div>
          ) : sections.length > 0 ? (
            <div className="space-y-10">
              {sections.map(([sectionTitle, sectionWorkouts]) => (
                <WorkoutRow
                  key={sectionTitle}
                  title={sectionTitle}
                  workouts={sectionWorkouts}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-dark/30 gap-2">
              <span className="text-4xl">🏋️</span>
              <p className="text-sm font-medium">No workouts available yet</p>
            </div>
          )
        )}

        {/* ── Flat filtered grid (any filter active) ── */}
        {hasFilters && (
          <section>
            <div className="flex items-baseline gap-2 mb-4">
              <h2 className="text-lg font-bold text-dark">
                {category !== 'All' ? category : 'Filtered Workouts'}
              </h2>
              {!loading && (
                <span className="text-sm text-dark/40">{filtered.length} workouts</span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="aspect-video rounded-2xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <motion.div
                key={`${category}-${difficulty}-${muscleGroup}-${duration}`}
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              >
                {filtered.map(workout => (
                  <motion.div key={workout.id} variants={item}>
                    <WorkoutCard workout={workout} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-dark/30 gap-2">
                <span className="text-4xl">🏋️</span>
                <p className="text-sm font-medium">No workouts match your filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-1 text-xs text-sky font-semibold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}
