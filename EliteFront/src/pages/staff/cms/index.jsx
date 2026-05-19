import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlaySquare, 
  UtensilsCrossed, 
  LayoutList, 
  Award, 
  Plus, 
  UploadCloud, 
  Trash2, 
  Edit3, 
  Tag,
  Dumbbell,
  X,
  Flame,
  Clock
} from 'lucide-react'

// Të dhënat simuluese fillestare (Initial Mock Data)
const initialWorkouts = [
  { id: 1, title: 'Full Body HIIT', difficulty: 'Hard', duration: '45 min', thumbnail: 'bg-red-100' },
  { id: 2, title: 'Morning Yoga Flow', difficulty: 'Beginner', duration: '20 min', thumbnail: 'bg-green-100' },
  { id: 3, title: 'Dumbbell Upper Body', difficulty: 'Intermediate', duration: '30 min', thumbnail: 'bg-blue-100' },
]

const initialRecipes = [
  { id: 1, title: 'Chicken & Quinoa Bowl', calories: 450, allergies: ['Gluten-Free', 'Nut-Free'] },
  { id: 2, title: 'Peanut Butter Protein Smoothie', calories: 320, allergies: ['Vegan', 'Dairy-Free'] },
]

const initialCategories = [
  { id: 1, name: 'Weight Loss', type: 'Goal' },
  { id: 2, name: 'Muscle Gain', type: 'Goal' },
  { id: 3, name: 'Cardio', type: 'Category' },
  { id: 4, name: 'Strength Training', type: 'Category' },
]

const initialBadges = [
  { id: 1, name: '7-Day Streak', icon: '🔥', description: 'Kryej stërvitje 7 ditë radhazi.' },
  { id: 2, name: 'Early Bird', icon: '🌅', description: 'Përfundo një stërvitje para orës 7 AM.' },
]

export default function ContentManagementDashboard() {
  const [activeTab, setActiveTab] = useState('workouts')
  
  // States për menaxhimin e të dhënave (CRUD)
  const [workouts, setWorkouts] = useState(initialWorkouts)
  const [recipes, setRecipes] = useState(initialRecipes)
  const [categories, setCategories] = useState(initialCategories)
  const [badges, setBadges] = useState(initialBadges)

  // State për kontrollin e Modaleve
  const [activeModal, setActiveModal] = useState(null) // 'workout' | 'recipe' | 'category' | 'badge' | null

  // States për Formularët e Modaleve
  const [workoutForm, setWorkoutForm] = useState({ title: '', difficulty: 'Beginner', duration: '' })
  const [recipeForm, setRecipeForm] = useState({ title: '', calories: '', allergies: '' })
  const [categoryForm, setCategoryForm] = useState({ name: '', type: 'Category' })
  const [badgeForm, setBadgeForm] = useState({ name: '', description: '', icon: '🏆' })

  // Funksionet e Menaxhimit të të Dhënave (Handlers)
  const openContextualModal = () => {
    if (activeTab === 'workouts') setActiveModal('workout')
    if (activeTab === 'recipes') setActiveModal('recipe')
    if (activeTab === 'categories') setActiveModal('category')
    if (activeTab === 'badges') setActiveModal('badge')
  }

  const handleAddWorkout = (e) => {
    e.preventDefault()
    if (!workoutForm.title || !workoutForm.duration) return
    const colors = ['bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-purple-100', 'bg-yellow-100']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    
    const newWorkout = {
      id: Date.now(),
      title: workoutForm.title,
      difficulty: workoutForm.difficulty,
      duration: `${workoutForm.duration} min`,
      thumbnail: randomColor
    }
    setWorkouts([newWorkout, ...workouts])
    setWorkoutForm({ title: '', difficulty: 'Beginner', duration: '' })
    setActiveModal(null)
  }

  const handleAddRecipe = (e) => {
    e.preventDefault()
    if (!recipeForm.title || !recipeForm.calories) return
    
    const newRecipe = {
      id: Date.now(),
      title: recipeForm.title,
      calories: parseInt(recipeForm.calories) || 0,
      allergies: recipeForm.allergies ? recipeForm.allergies.split(',').map(item => item.trim()) : []
    }
    setRecipes([newRecipe, ...recipes])
    setRecipeForm({ title: '', calories: '', allergies: '' })
    setActiveModal(null)
  }

  const handleAddCategory = (e) => {
    e.preventDefault()
    if (!categoryForm.name) return
    
    const newCategory = {
      id: Date.now(),
      name: categoryForm.name,
      type: categoryForm.type
    }
    setCategories([...categories, newCategory])
    setCategoryForm({ name: '', type: 'Category' })
    setActiveModal(null)
  }

  const handleAddBadge = (e) => {
    e.preventDefault()
    if (!badgeForm.name || !badgeForm.description) return
    
    const newBadge = {
      id: Date.now(),
      name: badgeForm.name,
      description: badgeForm.description,
      icon: badgeForm.icon
    }
    setBadges([newBadge, ...badges])
    setBadgeForm({ name: '', description: '', icon: '🏆' })
    setActiveModal(null)
  }

  // Funksionet për Fshirje (Delete)
  const deleteItem = (id, type) => {
    if (type === 'workout') setWorkouts(workouts.filter(w => w.id !== id))
    if (type === 'recipe') setRecipes(recipes.filter(r => r.id !== id))
    if (type === 'category') setCategories(categories.filter(c => c.id !== id))
    if (type === 'badge') setBadges(badges.filter(b => b.id !== id))
  }

  return (
    <div className="p-4 md:p-10 bg-[#f8fafc]/30 min-h-screen relative">
      
      {/* HEADER KRYESOR */}
      <header className="mb-8 mt-12 md:mt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">
            Content Management 📝
          </h1>
          <p className="text-slate-500 mt-1">Menaxhoni videot, recetat, kategoritë dhe medaljet e platformës.</p>
        </div>
        <button 
          onClick={openContextualModal}
          className="flex items-center justify-center gap-2 bg-[#0ea5e9] cursor-pointer text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#0284c7] transition-all shadow-lg shadow-sky-500/20"
        >
          <Plus size={20} />
          Krijo të re
        </button>
      </header>

      {/* NAVIGIMI ME TABS */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-black/5 shadow-sm max-w-max">
        <TabButton id="workouts" label="Workout Manager" icon={PlaySquare} active={activeTab} setActive={setActiveTab} />
        <TabButton id="recipes" label="Recipe Manager" icon={UtensilsCrossed} active={activeTab} setActive={setActiveTab} />
        <TabButton id="categories" label="Categories & Goals" icon={LayoutList} active={activeTab} setActive={setActiveTab} />
        <TabButton id="badges" label="Badge Creator" icon={Award} active={activeTab} setActive={setActiveTab} />
      </div>

      {/* PËRMBAJTJA E NDRYSHUESHME */}
      <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: WORKOUT MANAGER */}
          {activeTab === 'workouts' && (
            <motion.div key="workouts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h3 className="font-heading font-bold text-slate-900 text-lg mb-6">Biblioteka e Stërvitjeve</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Shto Video të Re (Placeholder) */}
                <div 
                  onClick={() => setActiveModal('workout')}
                  className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:bg-slate-50 hover:text-[#0ea5e9] hover:border-[#0ea5e9]/40 cursor-pointer transition-all min-h-[200px]"
                >
                  <UploadCloud size={40} className="mb-3" />
                  <p className="font-bold text-sm">Ngarko Video të Re</p>
                  <p className="text-xs text-center mt-1">MP4, WebM (Maks. 500MB)</p>
                </div>

                {/* Videot Ekzistuese */}
                {workouts.map(workout => (
                  <div key={workout.id} className="border border-black/5 rounded-2xl overflow-hidden group bg-white shadow-sm hover:shadow-md transition-all">
                    <div className={`h-32 ${workout.thumbnail} relative flex items-center justify-center`}>
                      <Dumbbell className="text-slate-400/40" size={48} />
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-800 backdrop-blur-sm shadow-sm">
                        {workout.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{workout.title}</h4>
                      <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-50">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                          workout.difficulty === 'Hard' ? 'bg-red-50 text-red-500' :
                          workout.difficulty === 'Intermediate' ? 'bg-orange-50 text-orange-500' :
                          'bg-green-50 text-green-500'
                        }`}>
                          {workout.difficulty}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-slate-400 hover:text-[#0ea5e9] transition-colors cursor-pointer"><Edit3 size={16} /></button>
                          <button onClick={() => deleteItem(workout.id, 'workout')} className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 2: RECIPE MANAGER */}
          {activeTab === 'recipes' && (
            <motion.div key="recipes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-bold text-slate-900 text-lg">Menaxheri i Recetave</h3>
                <button 
                  onClick={() => setActiveModal('recipe')} 
                  className="flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <Plus size={14} /> Shto Recetë
                </button>
              </div>
              
              <div className="space-y-4">
                {recipes.map(recipe => (
                  <div key={recipe.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-black/5 rounded-2xl bg-white hover:bg-slate-50/50 shadow-sm transition-colors gap-4">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{recipe.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Flame size={12} className="text-orange-500" /> {recipe.calories} kcal / porcion
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recipe.allergies.length > 0 ? recipe.allergies.map((allergy, idx) => (
                        <span key={idx} className="flex items-center gap-1 text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-1 rounded-lg">
                          <Tag size={10} /> {allergy}
                        </span>
                      )) : <span className="text-[10px] text-slate-400 italic">Nuk ka alergji të specifikuara</span>}
                    </div>
                    <div className="flex gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 text-sm font-semibold">
                      <button className="text-slate-400 hover:text-[#0ea5e9] transition-colors cursor-pointer">Edito</button>
                      <button onClick={() => deleteItem(recipe.id, 'recipe')} className="text-red-400 hover:text-red-600 transition-colors cursor-pointer">Fshij</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 3: CATEGORIES & GOALS */}
          {activeTab === 'categories' && (
            <motion.div key="categories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h3 className="font-heading font-bold text-slate-900 text-lg mb-6">Kategoritë & Qëllimet (Listat Statike)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Kolona e Kategorive */}
                <div>
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Kategoritë e Ushtrimeve</h4>
                    <button onClick={() => { setCategoryForm({...categoryForm, type: 'Category'}); setActiveModal('category'); }} className="text-[#0ea5e9] hover:bg-sky-50 p-1.5 rounded-lg transition-colors cursor-pointer"><Plus size={18} /></button>
                  </div>
                  <ul className="space-y-2">
                    {categories.filter(c => c.type === 'Category').map(item => (
                      <li key={item.id} className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-black/5 text-sm font-medium text-slate-700 shadow-sm">
                        {item.name}
                        <Trash2 size={14} onClick={() => deleteItem(item.id, 'category')} className="text-slate-300 hover:text-red-500 cursor-pointer transition-colors" />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kolona e Qëllimeve */}
                <div>
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Qëllimet e Klientëve</h4>
                    <button onClick={() => { setCategoryForm({...categoryForm, type: 'Goal'}); setActiveModal('category'); }} className="text-[#0ea5e9] hover:bg-sky-50 p-1.5 rounded-lg transition-colors cursor-pointer"><Plus size={18} /></button>
                  </div>
                  <ul className="space-y-2">
                    {categories.filter(c => c.type === 'Goal').map(item => (
                      <li key={item.id} className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-black/5 text-sm font-medium text-slate-700 shadow-sm">
                        {item.name}
                        <Trash2 size={14} onClick={() => deleteItem(item.id, 'category')} className="text-slate-300 hover:text-red-500 cursor-pointer transition-colors" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: BADGE CREATOR */}
          {activeTab === 'badges' && (
            <motion.div key="badges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-bold text-slate-900 text-lg">Sistemi i Medaljeve</h3>
                <button 
                  onClick={() => setActiveModal('badge')}
                  className="flex items-center gap-1.5 text-xs font-bold bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-3 py-2 rounded-xl transition-colors cursor-pointer shadow-md shadow-sky-500/10"
                >
                  <Plus size={14} /> Krijoni Medalje
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {badges.map(badge => (
                  <div key={badge.id} className="flex gap-4 p-4 border border-black/5 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all relative group">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-inner">
                      {badge.icon}
                    </div>
                    <div className="pr-6">
                      <h4 className="font-bold text-slate-800 text-sm">{badge.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
                    </div>
                    <button 
                      onClick={() => deleteItem(badge.id, 'badge')}
                      className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* GLOBAL MODALS INFRASRUCTURE */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-bold text-slate-900 text-lg">
                  {activeModal === 'workout' && 'Shto Stërvitje të Re'}
                  {activeModal === 'recipe' && 'Shto Recetë të Re'}
                  {activeModal === 'category' && 'Shto Kategorinë / Qëllimin'}
                  {activeModal === 'badge' && 'Krijo Medalje të Re'}
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* FORMULARI: WORKOUT */}
              {activeModal === 'workout' && (
                <form onSubmit={handleAddWorkout} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Titulli i Stërvitjes</label>
                    <input 
                      type="text" 
                      required
                      placeholder="p.sh. Full Body Burn" 
                      value={workoutForm.title}
                      onChange={(e) => setWorkoutForm({...workoutForm, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Vështirësia</label>
                      <select 
                        value={workoutForm.difficulty}
                        onChange={(e) => setWorkoutForm({...workoutForm, difficulty: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all font-medium cursor-pointer"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Kohëzgjatja (Minuta)</label>
                      <input 
                        type="number" 
                        required
                        placeholder="p.sh. 30" 
                        value={workoutForm.duration}
                        onChange={(e) => setWorkoutForm({...workoutForm, duration: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-slate-900 text-white rounded-xl py-3.5 text-sm font-bold hover:bg-slate-800 transition-colors mt-2 cursor-pointer shadow-lg shadow-slate-900/10">
                    Ruaj Stërvitjen
                  </button>
                </form>
              )}

              {/* FORMULARI: RECIPE */}
              {activeModal === 'recipe' && (
                <form onSubmit={handleAddRecipe} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Emri i Recetës</label>
                    <input 
                      type="text" 
                      required
                      placeholder="p.sh. Pancakes me Proteinë" 
                      value={recipeForm.title}
                      onChange={(e) => setRecipeForm({...recipeForm, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Kaloritë (kcal)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="p.sh. 350" 
                      value={recipeForm.calories}
                      onChange={(e) => setRecipeForm({...recipeForm, calories: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Alergjitë (Ndaji me presje)</label>
                    <input 
                      type="text" 
                      placeholder="p.sh. Nuts, Dairy, Gluten-Free" 
                      value={recipeForm.allergies}
                      onChange={(e) => setRecipeForm({...recipeForm, allergies: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all font-medium"
                    />
                  </div>
                  <button type="submit" className="w-full bg-slate-900 text-white rounded-xl py-3.5 text-sm font-bold hover:bg-slate-800 transition-colors mt-2 cursor-pointer shadow-lg shadow-slate-900/10">
                    Ruaj Recetën
                  </button>
                </form>
              )}

              {/* FORMULARI: CATEGORY / GOAL */}
              {activeModal === 'category' && (
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Emri i Listës</label>
                    <input 
                      type="text" 
                      required
                      placeholder="p.sh. Yoga, Muscle Building" 
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Tipi i Strukturës</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                      <button 
                        type="button"
                        onClick={() => setCategoryForm({...categoryForm, type: 'Category'})}
                        className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${categoryForm.type === 'Category' ? 'bg-white text-[#0ea5e9] shadow-sm' : 'text-slate-400'}`}
                      >
                        Kategori Ushtrimi
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCategoryForm({...categoryForm, type: 'Goal'})}
                        className={`py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${categoryForm.type === 'Goal' ? 'bg-white text-[#0ea5e9] shadow-sm' : 'text-slate-400'}`}
                      >
                        Qëllim Klienti
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-slate-900 text-white rounded-xl py-3.5 text-sm font-bold hover:bg-slate-800 transition-colors mt-2 cursor-pointer shadow-lg shadow-slate-900/10">
                    Shto Opsionin
                  </button>
                </form>
              )}

              {/* FORMULARI: BADGE */}
              {activeModal === 'badge' && (
                <form onSubmit={handleAddBadge} className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 items-end">
                    <div className="col-span-3">
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Emri i Medaljes</label>
                      <input 
                        type="text" 
                        required
                        placeholder="p.sh. Hydra King" 
                        value={badgeForm.name}
                        onChange={(e) => setBadgeForm({...badgeForm, name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all font-medium"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider text-center">Ikonë</label>
                      <select 
                        value={badgeForm.icon}
                        onChange={(e) => setBadgeForm({...badgeForm, icon: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm text-center focus:outline-none focus:border-[#0ea5e9] font-medium cursor-pointer"
                      >
                        <option value="🏆">🏆</option>
                        <option value="🔥">🔥</option>
                        <option value="🌅">🌅</option>
                        <option value="⚡">⚡</option>
                        <option value="💪">💪</option>
                        <option value="🥗">🥗</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Përshkrimi i Arritjes</label>
                    <textarea 
                      rows="3" 
                      required
                      placeholder="Si fitohet kjo medalje..." 
                      value={badgeForm.description}
                      onChange={(e) => setBadgeForm({...badgeForm, description: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all font-medium resize-none"
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full bg-slate-900 text-white rounded-xl py-3.5 text-sm font-bold hover:bg-slate-800 transition-colors mt-2 cursor-pointer shadow-lg shadow-slate-900/10">
                    Krijo Medaljen
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

// KOMPONENT NDIHMËS: TAB BUTTON
function TabButton({ id, label, icon: Icon, active, setActive }) {
  const isActive = active === id
  return (
    <button
      onClick={() => setActive(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${isActive ? 'bg-[#0ea5e9] text-white shadow-md shadow-sky-500/10' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
    >
      <Icon size={16} />
      {label}
    </button>
  )
}