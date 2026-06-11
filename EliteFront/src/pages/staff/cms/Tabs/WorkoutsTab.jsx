import React, { useState, useEffect } from 'react'
import { Video, Dumbbell, Trash2, Edit, Play } from 'lucide-react'
import { FieldLabel, FieldInput, ModalWrapper } from './SharedUI'
import { adminApi } from '../../../../services/adminApi' 
import axios from 'axios'

const THUMB_COLORS = ['bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-purple-100', 'bg-yellow-100']
const randColor = () => THUMB_COLORS[Math.floor(Math.random() * THUMB_COLORS.length)]

const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

export default function WorkoutsTab({ isModalOpen, onClose, onOpenModal }) {
  const [workouts, setWorkouts] = useState([])
  const [categories, setCategories] = useState([]) // State për kategoritë
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [viewVideoUrl, setViewVideoUrl] = useState(null)
  
  const [form, setForm] = useState({ 
    title: '', description: '', difficultyLevel: 'Beginner', 
    durationMinutes: '', muscleGroup: '', estimatedCaloriesBurned: '',
    categoryId: '', videoUrl: '' 
  })

  useEffect(() => {
    fetchWorkouts();
    fetchCategories(); // Thirrja e kategorive në fillim
  }, [])

  // Leximi i stërvitjeve
  const fetchWorkouts = async () => {
    try {
      const data = await adminApi.getWorkouts()
      const formattedData = data.map(w => ({ ...w, thumbnail: randColor() }))
      setWorkouts(formattedData)
    } catch (error) {
      console.error("Gabim në leximin e stërvitjeve:", error)
    }
  }

  // Metoda për të lexuar kategoritë nga API i ri
  const fetchCategories = async () => {
    try {
const response = await axios.get('https://localhost:5193/api/ExerciseCategories')
      setCategories(response.data)
    } catch (error) {
      console.error("Gabim në leximin e kategorive:", error)
    }
  }

  // Butoni i Edit-it hapur
  const handleEditClick = (workout) => {
    setEditingId(workout.id);
    setForm({
      title: workout.title || '',
      description: workout.description || '',
      difficultyLevel: workout.difficultyLevel || 'Beginner',
      durationMinutes: workout.durationSeconds ? Math.floor(workout.durationSeconds / 60) : '',
      muscleGroup: workout.muscleGroup || '',
      estimatedCaloriesBurned: workout.estimatedCaloriesBurned || '', 
      categoryId: workout.categoryId || '', // Popullon kategorinë ekzistuese
      videoUrl: workout.videoUrl || '' 
    });
    onOpenModal(); 
  }

  // Mbyllja e modalit dhe pastrimi
  const handleCloseModal = () => {
    setEditingId(null);
    setForm({
      title: '', description: '', difficultyLevel: 'Beginner', 
      durationMinutes: '', muscleGroup: '', estimatedCaloriesBurned: '', categoryId: '', videoUrl: ''
    });
    onClose();
  }

  // Ruajtja ose Editimi
// Ruajtja ose Editimi
  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title || !form.videoUrl) {
      alert("Ju lutem plotësoni Titullin dhe Linkun e Videos.");
      return;
    }

    setLoading(true) 

    const workoutPayload = {
      ...(editingId && { id: editingId }),
      title: form.title,
      description: form.description,
      difficultyLevel: form.difficultyLevel,
      muscleGroup: form.muscleGroup || '',
      categoryId: form.categoryId ? parseInt(form.categoryId) : null, // Konvertohet në int ose null
      estimatedCaloriesBurned: parseInt(form.estimatedCaloriesBurned) || 0,
      durationSeconds: parseInt(form.durationMinutes) * 60 || 0,
      videoUrl: form.videoUrl
    };

    try {
      if (editingId) {
        // RREGULLUAR: Përdoret adminApi që të mos anashkalohet Token-i i sigurisë
        await adminApi.updateWorkout(editingId, workoutPayload);
      } else {
        // RREGULLUAR: Përdoret adminApi për dërgimin e saktë të kërkesës POST
        await adminApi.createWorkout(workoutPayload);
      }
      
      handleCloseModal();
      fetchWorkouts();
    } catch (apiError) {
      console.error("Gabimi nga API:", apiError);
      // Pasi interceptori yt e paketon gabimin, mund t'ia shfaqësh përdoruesit mesazhin ekzaktesisht nga backend-i
      alert(`Dështoi ruajtja e stërvitjes: ${apiError.message || "Shikoni konsolën."}`);
    } finally {
      setLoading(false);
    }
  }
  // Fshirja
  const handleDelete = async (id) => {
    if (!window.confirm("Jeni i sigurt që doni të fshini këtë stërvitje?")) return;
    try {
      await adminApi.deleteWorkout(id)
      setWorkouts(w => w.filter(x => x.id !== id))
    } catch (error) {
      console.error("Gabim gjatë fshirjes:", error)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
         <h3 className="font-heading font-bold text-slate-900 text-lg">Biblioteka e Stërvitjeve</h3>
         <button onClick={() => { setEditingId(null); onOpenModal(); }} className="bg-[#0ea5e9] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-sky-600 transition-colors cursor-pointer">
            <Video size={18} />
            Shto Link Videoje
         </button>
      </div>

      {/* Grid për listimin e videove */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map(w => (
          <div key={w.id} className="border border-black/5 rounded-2xl overflow-hidden group bg-white shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className={`h-36 ${w.thumbnail || 'bg-slate-100'} relative flex items-center justify-center group/play`}>
              <Dumbbell className="text-slate-400/40" size={56} />
              
              {w.videoUrl && (
                <div 
                  onClick={() => setViewVideoUrl(w.videoUrl)}
                  className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/play:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]"
                >
                  <div className="bg-white text-rose-500 rounded-full p-3 shadow-lg hover:scale-110 transition-transform">
                     <Play fill="currentColor" size={24} />
                  </div>
                </div>
              )}

              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-800 backdrop-blur-sm shadow-sm">
                {w.durationSeconds ? Math.floor(w.durationSeconds / 60) + ' min' : '-'}
              </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
              <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{w.title}</h4>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2 flex-1">{w.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                 <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-600">{w.muscleGroup || 'E Përgjithshme'}</span>
                 <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-rose-50 text-rose-500">{w.estimatedCaloriesBurned || 0} kcal</span>
                 {w.category?.name && (
                   <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-sky-50 text-sky-600">{w.category.name}</span>
                 )}
              </div>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                  w.difficultyLevel === 'Hard' ? 'bg-red-50 text-red-500' :
                  w.difficultyLevel === 'Intermediate' ? 'bg-orange-50 text-orange-500' :
                  'bg-green-50 text-green-500'}`}>
                  {w.difficultyLevel}
                </span>
                
                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(w)} className="p-1.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(w.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALI PËR SHTIM DHE EDITIM */}
      <ModalWrapper isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? "Modifiko Stërvitjen" : "Shto Stërvitje nga YouTube"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <FieldLabel>Titulli</FieldLabel>
            <FieldInput required placeholder="Full Body Burn" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
          </div>

          <div>
            <FieldLabel>Linku i Videos (YouTube / Vimeo)</FieldLabel>
            <div className="relative">
                <Video className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                    required 
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..." 
                    value={form.videoUrl} 
                    onChange={e => setForm(f => ({...f, videoUrl: e.target.value}))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-3 text-sm focus:outline-none focus:border-[#0ea5e9]"
                />
            </div>
          </div>

          {/* Dropdown-i dinamik për zgjedhjen e Kategorisë */}
          <div>
            <FieldLabel>Kategoria e Stërvitjes</FieldLabel>
            <select 
              value={form.categoryId} 
              onChange={e => setForm(f => ({...f, categoryId: e.target.value}))}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] cursor-pointer"
            >
              <option value="">Zgjidhni Kategorinë</option>
              {categories && categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Përshkrimi</FieldLabel>
            <textarea 
              rows={3}
              placeholder="Përshkrim i shkurtër i stërvitjes..."
              value={form.description} 
              onChange={e => setForm(f => ({...f, description: e.target.value}))}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Vështirësia</FieldLabel>
              <select value={form.difficultyLevel} onChange={e => setForm(f => ({...f, difficultyLevel: e.target.value}))}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] cursor-pointer">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <FieldLabel>Kohëzgjatja (Minuta)</FieldLabel>
              <FieldInput required type="number" placeholder="30" value={form.durationMinutes} onChange={e => setForm(f => ({...f, durationMinutes: e.target.value}))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Grupi i Muskujve</FieldLabel>
              <FieldInput placeholder="Këmbë, Bark..." value={form.muscleGroup} onChange={e => setForm(f => ({...f, muscleGroup: e.target.value}))} />
            </div>
            <div>
              <FieldLabel>Kaloritë (Kcal)</FieldLabel>
              <FieldInput type="number" placeholder="250" value={form.estimatedCaloriesBurned} onChange={e => setForm(f => ({...f, estimatedCaloriesBurned: e.target.value}))} />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full mt-4 bg-slate-900 text-white rounded-xl py-3.5 text-sm font-bold hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50">
            {loading ? 'Duke u ruajtur...' : (editingId ? 'Përditëso Stërvitjen' : 'Ruaj Stërvitjen')}
          </button>
        </form>
      </ModalWrapper>

      {/* MODALI PËR TË PARË VIDEON */}
      <ModalWrapper isOpen={!!viewVideoUrl} onClose={() => setViewVideoUrl(null)} title="Shiko Videon">
        <div className="w-full aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
          {getYoutubeEmbedUrl(viewVideoUrl) ? (
             <iframe
               width="100%"
               height="100%"
               src={getYoutubeEmbedUrl(viewVideoUrl)}
               title="YouTube video player"
               frameBorder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
               allowFullScreen
             ></iframe>
          ) : (
             <p className="text-white text-sm">Linku nuk është format i vlefshëm YouTube.</p>
          )}
        </div>
      </ModalWrapper>
    </>
  )
}