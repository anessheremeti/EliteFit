import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FeaturedBanner }   from './components/FeaturedBanner';
import { FilterBar }        from './components/FilterBar';
import { ContinueWatching } from './components/ContinueWatching';
import { WorkoutCard }      from './components/WorkoutCard';
import { WorkoutRow }       from './components/WorkoutRow';
import { workoutService }   from '../../../services/workoutService'; 
import WorkoutApi           from '../../../api/user/workout/workouts'; 

// Renditja e preferuar e seksioneve në faqen kryesore
const SECTION_ORDER = ['Core', 'Upper Body', 'Lower Body', 'Full Body'];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

export default function WorkoutsPage() {
  // State-at për videot
  const [workouts, setWorkouts]           = useState([]); 
  const [searchResults, setSearchResults] = useState([]); 
  const [featured, setFeatured]           = useState([]);
  const [continuing, setContinuing]       = useState([]);
  
  // State-at për opsionet e filtrave
  const [categories, setCategories]       = useState(['All']); 
  const [difficulties, setDifficulties]   = useState(['All']); 
  const [muscleGroups, setMuscleGroups]   = useState(['All']); 
  const [durations, setDurations]         = useState(['All']); 

  // Loading states
  const [loading, setLoading]             = useState(true);
  const [contLoading, setContLoading]     = useState(true);

  // State-at e vlerave aktive (Zgjedhjet e përdoruesit)
  const [category, setCategory]           = useState('All');
  const [difficulty, setDifficulty]       = useState('All');
  const [muscleGroup, setMuscleGroup]     = useState('All');
  const [duration, setDuration]           = useState('All');
  const [searchQuery, setSearchQuery]     = useState(''); 
  const [sortBy, setSortBy]               = useState(''); 

  // Kontrollojmë nëse ka ndonjë filtër aktiv
  const hasFilters = 
    category !== 'All' || 
    difficulty !== 'All' || 
    muscleGroup !== 'All' || 
    duration !== 'All' || 
    searchQuery.trim() !== '' || 
    sortBy !== '';

  // 1. NGARKIMI FILLESTAR
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [all, feat, cats, dbFilters] = await Promise.all([
          workoutService.getAll(),         
          workoutService.getFeatured(3),   
          workoutService.getCategories(),  
          WorkoutApi.getFilters(),         // Kthen direkt të dhënat për shkak të interceptorit
        ]);
        
        if (cancelled) return;

        setWorkouts(all);
        setFeatured(feat);
        setCategories(['All', ...cats]);
        
        // RREGULLIM: Interceptori e ka hequr fushën '.data', dbFilters vjen i pastër
       if (dbFilters) {
  setDifficulties(dbFilters.difficulties || ['All']);
  setMuscleGroups(dbFilters.muscleGroups || ['All']);
  setDurations(dbFilters.durations || ['All']);
}
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function loadContinue() {
      try {
        const data = await workoutService.getContinueWatching(); 
        if (!cancelled) setContinuing(data);
      } catch {
        // Përdoruesi nuk ka stërvitje në proces
      } finally {
        if (!cancelled) setContLoading(false);
      }
    }

    load();
    loadContinue();
    return () => { cancelled = true; };
  }, []);

  // 2. KËRKIMI I FILTRUAR NË BACKEND (Debounced)
  useEffect(() => {
    if (!hasFilters) return;

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        // RREGULLIM: Emrat e parametrave përputhen 100% me SearchWorkoutsQuery në C#
        const params = {
          searchTerm: searchQuery.trim() !== '' ? searchQuery.trim() : undefined,
          difficulty: difficulty !== 'All' ? difficulty : undefined,
          muscleGroup: muscleGroup !== 'All' ? muscleGroup : undefined,
          duration: duration !== 'All' ? duration : undefined,
          sortBy: sortBy !== '' ? sortBy : undefined,
          // Nëse backend juaj në query merr emrin e kategorisë:
          // category: category !== 'All' ? category : undefined
        };

        const response = await WorkoutApi.searchVideos(params);
        
        // RREGULLIM: Interceptori e kthen direkt listën, jo response.data
        if (response) {
          // Filtruesi lokal në frontend për kategorinë nëse nuk e kalon në backend API
          let finalData = response;
          if (category !== 'All') {
            finalData = response.filter(w => w.category === category);
          }
          setSearchResults(finalData);
        }
      } catch (err) {
        console.error('Gabim gjatë kërkimit:', err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [category, difficulty, muscleGroup, duration, searchQuery, sortBy, hasFilters]);

  // Grupimi i videove për pamjen Default (Kur nuk ka filtra aktivë)
  const sections = useMemo(() => {
    if (hasFilters) return [];
    const map = new Map();
    for (const w of workouts) { 
      const key = w.muscleGroup ?? 'Other';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(w);
    }
    
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
    setCategory('All'); 
    setDifficulty('All');
    setMuscleGroup('All'); 
    setDuration('All');
    setSearchQuery('');
    setSortBy('');
  }

  return (
    <div className="min-h-screen bg-surface">

      <FeaturedBanner slides={featured} />

      <div className="px-6 py-5 space-y-8">

        <FilterBar
          categories={categories}       category={category}           onCategoryChange={setCategory}
          difficulties={difficulties}   difficulty={difficulty}       onDifficultyChange={setDifficulty}
          muscleGroups={muscleGroups}   muscleGroup={muscleGroup}     onMuscleGroupChange={setMuscleGroup}
          durations={durations}         duration={duration}           onDurationChange={setDuration}
          searchQuery={searchQuery}     onSearchChange={setSearchQuery}
          sortBy={sortBy}               onSortByChange={setSortBy}
        />

        <ContinueWatching items={continuing} loading={contLoading} />

        {/* Seksionet e grupuara (Kur nuk ka filtra) */}
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

        {/* Grid i rrafshët (Kur ka filtra/search) */}
        {hasFilters && (
          <section>
            <div className="flex items-baseline gap-2 mb-4">
              <h2 className="text-lg font-bold text-dark">
                {category !== 'All' ? category : 'Filtered Workouts'}
              </h2>
              {!loading && (
                <span className="text-sm text-dark/40">{searchResults.length} workouts</span>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="aspect-video rounded-2xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <motion.div
                key={`${category}-${difficulty}-${muscleGroup}-${duration}-${searchQuery}-${sortBy}`}
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              >
                {searchResults.map(workout => (
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