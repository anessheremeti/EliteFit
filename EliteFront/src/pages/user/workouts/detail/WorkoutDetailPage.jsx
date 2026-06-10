import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FeaturedBanner } from '../components/FeaturedBanner';
import { FilterBar } from '../components/FilterBar';
import { ContinueWatching } from '../components/ContinueWatching';
import { WorkoutCard }      from '../components/WorkoutCard';
import { WorkoutRow }       from '../components/WorkoutRow';

// Importojmë API-n tonë të vërtetë të backend-it
import WorkoutApi from '../../../../api/user/workout/workouts';

// Konstanta e filtrave dinamikë që përputhen me modelin e backend-it tuaj
const DIFFICULTIES  = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const MUSCLE_GROUPS = ['All', 'Full Body', 'Upper Body', 'Lower Body', 'Core', 'Back'];
const DURATIONS     = ['All', '< 15 min', '15–30 min', '30–45 min', '45–60 min', '60+ min'];

// Llogaritja e minutave duke u bazuar në sekondat që vijnë nga databaza (DurationSeconds / 60)
const DURATION_RANGES = {
  '< 15 min':  [0,  14],
  '15–30 min': [15, 30],
  '30–45 min': [30, 45],
  '45–60 min': [45, 60],
  '60+ min':   [60, Infinity],
};

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

    async function loadDataFromApi() {
      try {
        setLoading(true);
        
        // Thërrasim pikën tonë të re GET /api/Workouts/videos
        const response = await WorkoutApi.getVideos();
        
        if (cancelled) return;

        // Kujdesemi nëse përgjigja vjen si { data: [...] } apo direkt si varg [...]
        const allVideos = Array.isArray(response) 
          ? response 
          : (response && Array.isArray(response.data) ? response.data : []);

        setWorkouts(allVideos);

        // Dinamike: Marrim 3 videot e para për slider-in kryesor (Sigurohemi me ?.slice)
        setFeatured(allVideos.slice(0, 3));

        // Dinamike: Gjenerojmë kategoritë automatikisht direkt nga ato që ekzistojnë në DB
        const uniqueCategories = [...new Set(allVideos.map(v => v?.category).filter(Boolean))];
        setCategories(['All', ...uniqueCategories]);

      } catch (err) {
        console.error('Gabim gjatë ngarkimit të videove nga backend:', err);
        setWorkouts([]);
        setFeatured([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    async function loadContinueWatching() {
      try {
        setContLoading(true);
        // Do të mbushet kur të jetë gati endpoint-i i historikut
        setContinuing([]);
      } catch (err) {
        console.error('Gabim gjatë ngarkimit të historikut:', err);
      } finally {
        if (!cancelled) setContLoading(false);
      }
    }

    loadDataFromApi();
    loadContinueWatching();

    return () => { cancelled = true; };
  }, []);

  const hasFilters = category !== 'All' || difficulty !== 'All' || muscleGroup !== 'All' || duration !== 'All';

  // Filtrimi në Frontend duke përdorur të dhënat camelCase nga C# API
 // Filtrimi në Frontend me pastrim të karaktereve (të padukshme/hapësira)
  const filtered = useMemo(() => {
    if (!Array.isArray(workouts)) return [];
    if (!hasFilters) return workouts;
    
    return workouts.filter(w => {
      if (!w) return false;

      // 1. Kategoritë (mbrojtje)
      const matchesCategory = category === 'All' || 
        (w.category?.toLowerCase().trim() === category.toLowerCase().trim());

      // 2. Vështirësia (me .trim() dhe .toLowerCase() për siguri)
      const diffVal = (w.difficultyLevel || w.difficulty || '').toLowerCase().trim();
      const matchesDifficulty = difficulty === 'All' || (diffVal === difficulty.toLowerCase().trim());

      // 3. Muscle Group
      const matchesMuscle = muscleGroup === 'All' || 
        (w.muscleGroup?.toLowerCase().trim() === muscleGroup.toLowerCase().trim());
      
      // 4. Kohëzgjatja (kjo ngelet siç është)
      let matchesDuration = true;
      if (duration !== 'All') {
        const [min, max] = DURATION_RANGES[duration] ?? [0, Infinity];
        const durationInMinutes = w.durationSeconds ? Math.round(w.durationSeconds / 60) : 0;
        if (durationInMinutes < min || durationInMinutes > max) matchesDuration = false;
      }

      return matchesCategory && matchesDifficulty && matchesMuscle && matchesDuration;
    });
  }, [workouts, hasFilters, category, difficulty, muscleGroup, duration]);

  // Grupimi dinamik i rreshtave (Workout Rows) sipas fushës muscleGroup të databazës
  const sections = useMemo(() => {
    if (!Array.isArray(workouts) || hasFilters) return [];
    
    const map = new Map();
    for (const w of workouts) {
      if (!w) continue;
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
  }

  return (
    <div className="min-h-screen bg-surface">

      <FeaturedBanner slides={featured} />

      <div className="px-6 py-5 space-y-8">

        <FilterBar
          categories={categories}
          category={category}           onCategoryChange={setCategory}
          difficulty={difficulty}       onDifficultyChange={setDifficulty}
          muscleGroup={muscleGroup}     onMuscleGroupChange={setMuscleGroup}
          duration={duration}           onDurationChange={setDuration}
          difficulties={DIFFICULTIES}
          muscleGroups={MUSCLE_GROUPS}
          durations={DURATIONS}
        />

        <ContinueWatching items={continuing} loading={contLoading} />

        {/* ── Seksionet Dinamike (Kur nuk ka filtra aktivë) ── */}
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
                  workouts={Array.isArray(sectionWorkouts) ? sectionWorkouts : []}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-dark/30 gap-2">
              <span className="text-4xl">🏋️</span>
              <p className="text-sm font-medium">Nuk ka asnjë video stërvitore në databazë.</p>
            </div>
          )
        )}

        {/* ── Grid-i i Filtruar (Kur aktivizohet ndonjë filtër) ── */}
        {hasFilters && (
          <section>
            <div className="flex items-baseline gap-2 mb-4">
              <h2 className="text-lg font-bold text-dark">
                {category !== 'All' ? category : 'Rezultatet e Filtruara'}
              </h2>
              {!loading && (
                <span className="text-sm text-dark/40">{filtered.length} stërvitje u gjetën</span>
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
                  workout?.id ? (
                    <motion.div key={workout.id} variants={item}>
                      <WorkoutCard workout={workout} />
                    </motion.div>
                  ) : null
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-dark/30 gap-2">
                <span className="text-4xl">🏋️</span>
                <p className="text-sm font-medium">Asnjë stërvitje nuk përputhet me filtrat e zgjedhur.</p>
                <button
                  onClick={clearFilters}
                  className="mt-1 text-xs text-sky font-semibold hover:underline"
                >
                  Pastro filtrat
                </button>
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}