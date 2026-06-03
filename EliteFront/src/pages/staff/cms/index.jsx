import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlaySquare, UtensilsCrossed, LayoutList, Award,
  Plus, UploadCloud, Trash2, Edit3, Tag,
  Dumbbell, X, Flame, AlertCircle, Loader2
} from 'lucide-react'
import { adminApi } from '../../../services/adminApi'

// ── Helpers ───────────────────────────────────────────────────────────────────
const THUMB_COLORS = ['bg-red-100','bg-green-100','bg-blue-100','bg-purple-100','bg-yellow-100']
const randColor = () => THUMB_COLORS[Math.floor(Math.random() * THUMB_COLORS.length)]

function TabButton({ id, label, icon: Icon, active, setActive }) {
  return (
    <button onClick={() => setActive(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
        active === id ? 'bg-[#0ea5e9] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}>
      <Icon size={16} />{label}
    </button>
  )
}

function FieldLabel({ children }) {
  return <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">{children}</label>
}

function FieldInput({ ...props }) {
  return (
    <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all font-medium" {...props} />
  )
}

function ErrorBanner({ msg, onRetry }) {
  return (
    <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
      <AlertCircle size={15} className="shrink-0" />{msg}
      {onRetry && <button onClick={onRetry} className="ml-auto text-xs font-bold hover:underline">Retry</button>}
    </div>
  )
}

// ── Recipes Tab ───────────────────────────────────────────────────────────────
function RecipesTab({ onOpenModal }) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [saving,  setSaving]  = useState(null) // id of item being deleted

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try { setRecipes(await adminApi.getRecipes()) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    setSaving(id)
    try {
      await adminApi.deleteRecipe(id)
      setRecipes(r => r.filter(x => x.id !== id))
    } catch (e) { setError(e.message) }
    finally { setSaving(null) }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading font-bold text-slate-900 text-lg">Menaxheri i Recetave</h3>
        <button onClick={onOpenModal}
          className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl transition-colors cursor-pointer">
          <Plus size={14} /> Shto Recetë
        </button>
      </div>

      {error && <ErrorBanner msg={error} onRetry={load} />}

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse" />)}
        </div>
      ) : recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-300">
          <UtensilsCrossed size={40} className="mb-3" />
          <p className="text-sm font-semibold text-slate-400">Nuk ka receta. Shto të parën!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recipes.map(r => (
            <div key={r.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-black/5 rounded-2xl bg-white hover:bg-slate-50/50 shadow-sm transition-colors gap-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{r.name || r.title}</h4>
                {r.calories && (
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Flame size={12} className="text-orange-500" /> {r.calories} kcal / porcion
                  </p>
                )}
              </div>
              <div className="flex gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 text-sm font-semibold items-center">
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={saving === r.id}
                  className="flex items-center gap-1 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                  {saving === r.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Fshij
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Badges Tab ────────────────────────────────────────────────────────────────
function BadgesTab({ onOpenModal }) {
  const [badges,  setBadges]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [saving,  setSaving]  = useState(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try { setBadges(await adminApi.getBadges()) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    setSaving(id)
    try {
      await adminApi.deleteBadge(id)
      setBadges(b => b.filter(x => x.id !== id))
    } catch (e) { setError(e.message) }
    finally { setSaving(null) }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading font-bold text-slate-900 text-lg">Sistemi i Medaljeve</h3>
        <button onClick={onOpenModal}
          className="flex items-center gap-1.5 text-xs font-bold bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-3 py-2 rounded-xl transition-colors cursor-pointer shadow-md shadow-sky-500/10">
          <Plus size={14} /> Krijoni Medalje
        </button>
      </div>

      {error && <ErrorBanner msg={error} onRetry={load} />}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse" />)}
        </div>
      ) : badges.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-300">
          <Award size={40} className="mb-3" />
          <p className="text-sm font-semibold text-slate-400">Nuk ka medalje. Krijo të parën!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map(b => (
            <div key={b.id}
              className="flex gap-4 p-4 border border-black/5 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all relative group">
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                <Award size={22} className="text-amber-500" />
              </div>
              <div className="pr-6 min-w-0">
                <h4 className="font-bold text-slate-800 text-sm truncate">{b.name}</h4>
                {b.description && <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{b.description}</p>}
              </div>
              <button
                onClick={() => handleDelete(b.id)}
                disabled={saving === b.id}
                className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
              >
                {saving === b.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Workout & Category tabs stay local-only (no video upload endpoint yet) ───

const initialWorkouts = [
  { id: 1, title: 'Full Body HIIT',      difficulty: 'Hard',         duration: '45 min', thumbnail: 'bg-red-100' },
  { id: 2, title: 'Morning Yoga Flow',   difficulty: 'Beginner',     duration: '20 min', thumbnail: 'bg-green-100' },
  { id: 3, title: 'Dumbbell Upper Body', difficulty: 'Intermediate', duration: '30 min', thumbnail: 'bg-blue-100' },
]
const initialCategories = [
  { id: 1, name: 'Weight Loss',      type: 'Goal' },
  { id: 2, name: 'Muscle Gain',      type: 'Goal' },
  { id: 3, name: 'Cardio',           type: 'Category' },
  { id: 4, name: 'Strength Training',type: 'Category' },
]

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ContentManagementDashboard() {
  const [activeTab,     setActiveTab]     = useState('workouts')
  const [workouts,      setWorkouts]      = useState(initialWorkouts)
  const [categories,    setCategories]    = useState(initialCategories)
  const [activeModal,   setActiveModal]   = useState(null)
  const [saving,        setSaving]        = useState(false)
  const [modalError,    setModalError]    = useState(null)

  // forms
  const [workoutForm,  setWorkoutForm]  = useState({ title: '', difficulty: 'Beginner', duration: '' })
  const [recipeForm,   setRecipeForm]   = useState({ title: '', calories: '', instructions: '' })
  const [categoryForm, setCategoryForm] = useState({ name: '', type: 'Category' })
  const [badgeForm,    setBadgeForm]    = useState({ name: '', description: '' })

  // recipe/badge list refs — so modals can trigger reload
  const [recipeKey,  setRecipeKey]  = useState(0)
  const [badgeKey,   setBadgeKey]   = useState(0)

  const openModal = () => {
    setModalError(null)
    if (activeTab === 'workouts')   setActiveModal('workout')
    if (activeTab === 'recipes')    setActiveModal('recipe')
    if (activeTab === 'categories') setActiveModal('category')
    if (activeTab === 'badges')     setActiveModal('badge')
  }

  // ── Workout (local) ───────────────────────────────────────────────────────
  const handleAddWorkout = (e) => {
    e.preventDefault()
    if (!workoutForm.title || !workoutForm.duration) return
    setWorkouts(w => [{ id: Date.now(), ...workoutForm, duration: `${workoutForm.duration} min`, thumbnail: randColor() }, ...w])
    setWorkoutForm({ title: '', difficulty: 'Beginner', duration: '' })
    setActiveModal(null)
  }

  // ── Recipe (API) ──────────────────────────────────────────────────────────
  const handleAddRecipe = async (e) => {
    e.preventDefault()
    if (!recipeForm.title) return
    setSaving(true); setModalError(null)
    try {
      await adminApi.createRecipe({
        title: recipeForm.title,
        instructions: recipeForm.instructions || null,
        calories: recipeForm.calories ? parseInt(recipeForm.calories) : null,
        allergenIds: [],
      })
      setRecipeKey(k => k + 1)
      setRecipeForm({ title: '', calories: '', instructions: '' })
      setActiveModal(null)
    } catch (err) {
      setModalError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Category (local) ──────────────────────────────────────────────────────
  const handleAddCategory = (e) => {
    e.preventDefault()
    if (!categoryForm.name) return
    setCategories(c => [...c, { id: Date.now(), ...categoryForm }])
    setCategoryForm({ name: '', type: 'Category' })
    setActiveModal(null)
  }

  // ── Badge (API) ───────────────────────────────────────────────────────────
  const handleAddBadge = async (e) => {
    e.preventDefault()
    if (!badgeForm.name) return
    setSaving(true); setModalError(null)
    try {
      await adminApi.createBadge({ name: badgeForm.name, description: badgeForm.description, badgeIconId: null })
      setBadgeKey(k => k + 1)
      setBadgeForm({ name: '', description: '' })
      setActiveModal(null)
    } catch (err) {
      setModalError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteLocalWorkout  = (id) => setWorkouts(w => w.filter(x => x.id !== id))
  const deleteLocalCategory = (id) => setCategories(c => c.filter(x => x.id !== id))

  return (
    <div className="p-4 md:p-10 bg-[#f8fafc]/30 min-h-screen relative">

      <header className="mb-8 mt-12 md:mt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Content Management 📝</h1>
          <p className="text-slate-500 mt-1">Menaxhoni videot, recetat, kategoritë dhe medaljet e platformës.</p>
        </div>
        <button onClick={openModal}
          className="flex items-center justify-center gap-2 bg-[#0ea5e9] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#0284c7] transition-all shadow-lg shadow-sky-500/20 cursor-pointer">
          <Plus size={20} /> Krijo të re
        </button>
      </header>

      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-black/5 shadow-sm max-w-max">
        <TabButton id="workouts"   label="Workout Manager"   icon={PlaySquare}     active={activeTab} setActive={setActiveTab} />
        <TabButton id="recipes"    label="Recipe Manager"    icon={UtensilsCrossed} active={activeTab} setActive={setActiveTab} />
        <TabButton id="categories" label="Categories & Goals" icon={LayoutList}     active={activeTab} setActive={setActiveTab} />
        <TabButton id="badges"     label="Badge Creator"      icon={Award}          active={activeTab} setActive={setActiveTab} />
      </div>

      <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm min-h-125">
        <AnimatePresence mode="wait">

          {/* ── WORKOUTS ── */}
          {activeTab === 'workouts' && (
            <motion.div key="workouts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h3 className="font-heading font-bold text-slate-900 text-lg mb-6">Biblioteka e Stërvitjeve</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div onClick={() => setActiveModal('workout')}
                  className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:bg-slate-50 hover:text-[#0ea5e9] hover:border-[#0ea5e9]/40 cursor-pointer transition-all min-h-50">
                  <UploadCloud size={40} className="mb-3" />
                  <p className="font-bold text-sm">Ngarko Video të Re</p>
                  <p className="text-xs text-center mt-1">MP4, WebM (Maks. 500MB)</p>
                </div>
                {workouts.map(w => (
                  <div key={w.id} className="border border-black/5 rounded-2xl overflow-hidden group bg-white shadow-sm hover:shadow-md transition-all">
                    <div className={`h-32 ${w.thumbnail} relative flex items-center justify-center`}>
                      <Dumbbell className="text-slate-400/40" size={48} />
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-800 backdrop-blur-sm shadow-sm">{w.duration}</div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{w.title}</h4>
                      <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-50">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                          w.difficulty === 'Hard' ? 'bg-red-50 text-red-500' :
                          w.difficulty === 'Intermediate' ? 'bg-orange-50 text-orange-500' :
                          'bg-green-50 text-green-500'}`}>{w.difficulty}</span>
                        <button onClick={() => deleteLocalWorkout(w.id)} className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── RECIPES — API ── */}
          {activeTab === 'recipes' && (
            <motion.div key={`recipes-${recipeKey}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <RecipesTab onOpenModal={() => setActiveModal('recipe')} />
            </motion.div>
          )}

          {/* ── CATEGORIES ── */}
          {activeTab === 'categories' && (
            <motion.div key="categories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h3 className="font-heading font-bold text-slate-900 text-lg mb-6">Kategoritë & Qëllimet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Kategoritë e Ushtrimeve</h4>
                    <button onClick={() => { setCategoryForm(f => ({...f, type:'Category'})); setActiveModal('category') }}
                      className="text-[#0ea5e9] hover:bg-sky-50 p-1.5 rounded-lg cursor-pointer"><Plus size={18} /></button>
                  </div>
                  <ul className="space-y-2">
                    {categories.filter(c => c.type === 'Category').map(item => (
                      <li key={item.id} className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-black/5 text-sm font-medium text-slate-700 shadow-sm">
                        {item.name}
                        <Trash2 size={14} onClick={() => deleteLocalCategory(item.id)} className="text-slate-300 hover:text-red-500 cursor-pointer transition-colors" />
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Qëllimet e Klientëve</h4>
                    <button onClick={() => { setCategoryForm(f => ({...f, type:'Goal'})); setActiveModal('category') }}
                      className="text-[#0ea5e9] hover:bg-sky-50 p-1.5 rounded-lg cursor-pointer"><Plus size={18} /></button>
                  </div>
                  <ul className="space-y-2">
                    {categories.filter(c => c.type === 'Goal').map(item => (
                      <li key={item.id} className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-black/5 text-sm font-medium text-slate-700 shadow-sm">
                        {item.name}
                        <Trash2 size={14} onClick={() => deleteLocalCategory(item.id)} className="text-slate-300 hover:text-red-500 cursor-pointer transition-colors" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── BADGES — API ── */}
          {activeTab === 'badges' && (
            <motion.div key={`badges-${badgeKey}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <BadgesTab onOpenModal={() => setActiveModal('badge')} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {activeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setActiveModal(null); setModalError(null) }}>
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100"
              onClick={e => e.stopPropagation()}>

              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-bold text-slate-900 text-lg">
                  {activeModal === 'workout'  && 'Shto Stërvitje të Re'}
                  {activeModal === 'recipe'   && 'Shto Recetë të Re'}
                  {activeModal === 'category' && 'Shto Kategorinë / Qëllimin'}
                  {activeModal === 'badge'    && 'Krijo Medalje të Re'}
                </h3>
                <button onClick={() => { setActiveModal(null); setModalError(null) }}
                  className="p-1.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"><X size={18} /></button>
              </div>

              {modalError && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs">
                  <AlertCircle size={14} className="shrink-0" />{modalError}
                </div>
              )}

              {/* Workout form */}
              {activeModal === 'workout' && (
                <form onSubmit={handleAddWorkout} className="space-y-4">
                  <div><FieldLabel>Titulli</FieldLabel><FieldInput required placeholder="Full Body Burn" value={workoutForm.title} onChange={e => setWorkoutForm(f => ({...f, title: e.target.value}))} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><FieldLabel>Vështirësia</FieldLabel>
                      <select value={workoutForm.difficulty} onChange={e => setWorkoutForm(f => ({...f, difficulty: e.target.value}))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] cursor-pointer">
                        <option>Beginner</option><option>Intermediate</option><option>Hard</option>
                      </select>
                    </div>
                    <div><FieldLabel>Kohëzgjatja (min)</FieldLabel><FieldInput required type="number" placeholder="30" value={workoutForm.duration} onChange={e => setWorkoutForm(f => ({...f, duration: e.target.value}))} /></div>
                  </div>
                  <button type="submit" className="w-full bg-slate-900 text-white rounded-xl py-3.5 text-sm font-bold hover:bg-slate-800 transition-colors cursor-pointer">Ruaj Stërvitjen</button>
                </form>
              )}

              {/* Recipe form — calls .NET API */}
              {activeModal === 'recipe' && (
                <form onSubmit={handleAddRecipe} className="space-y-4">
                  <div><FieldLabel>Emri i Recetës</FieldLabel><FieldInput required placeholder="Pancakes me Proteinë" value={recipeForm.title} onChange={e => setRecipeForm(f => ({...f, title: e.target.value}))} /></div>
                  <div><FieldLabel>Kaloritë (kcal)</FieldLabel><FieldInput type="number" placeholder="350" value={recipeForm.calories} onChange={e => setRecipeForm(f => ({...f, calories: e.target.value}))} /></div>
                  <div><FieldLabel>Instruksionet (opsionale)</FieldLabel>
                    <textarea rows="3" placeholder="Mënyra e përgatitjes..." value={recipeForm.instructions}
                      onChange={e => setRecipeForm(f => ({...f, instructions: e.target.value}))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] resize-none" />
                  </div>
                  <button type="submit" disabled={saving}
                    className="w-full bg-slate-900 text-white rounded-xl py-3.5 text-sm font-bold hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving && <Loader2 size={15} className="animate-spin" />} Ruaj Recetën
                  </button>
                </form>
              )}

              {/* Category form */}
              {activeModal === 'category' && (
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div><FieldLabel>Emri</FieldLabel><FieldInput required placeholder="Yoga, Muscle Building" value={categoryForm.name} onChange={e => setCategoryForm(f => ({...f, name: e.target.value}))} /></div>
                  <div>
                    <FieldLabel>Tipi</FieldLabel>
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                      {['Category','Goal'].map(t => (
                        <button key={t} type="button" onClick={() => setCategoryForm(f => ({...f, type: t}))}
                          className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${categoryForm.type === t ? 'bg-white text-[#0ea5e9] shadow-sm' : 'text-slate-400'}`}>
                          {t === 'Category' ? 'Kategori Ushtrimi' : 'Qëllim Klienti'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-slate-900 text-white rounded-xl py-3.5 text-sm font-bold hover:bg-slate-800 transition-colors cursor-pointer">Shto Opsionin</button>
                </form>
              )}

              {/* Badge form — calls .NET API */}
              {activeModal === 'badge' && (
                <form onSubmit={handleAddBadge} className="space-y-4">
                  <div><FieldLabel>Emri i Medaljes</FieldLabel><FieldInput required placeholder="Iron Will" value={badgeForm.name} onChange={e => setBadgeForm(f => ({...f, name: e.target.value}))} /></div>
                  <div><FieldLabel>Përshkrimi i Arritjes</FieldLabel>
                    <textarea rows="3" required placeholder="Si fitohet kjo medalje..." value={badgeForm.description}
                      onChange={e => setBadgeForm(f => ({...f, description: e.target.value}))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] resize-none" />
                  </div>
                  <button type="submit" disabled={saving}
                    className="w-full bg-slate-900 text-white rounded-xl py-3.5 text-sm font-bold hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving && <Loader2 size={15} className="animate-spin" />} Krijo Medaljen
                  </button>
                </form>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
