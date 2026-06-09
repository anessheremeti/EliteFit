import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { FieldLabel, FieldInput, ModalWrapper } from './SharedUI'
import { adminApi } from '../../../../services/adminApi' 

export default function CategoriesTab({ isModalOpen, onClose, onOpenModal }) {
  const [categories, setCategories] = useState([]) // Nuk kemi më initialGoals statike
  const [form, setForm] = useState({ name: '', type: 'Category' })
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // 1. Merr Kategoritë dhe Qëllimet nga Backend-i
  const fetchAllData = async () => {
    try {
      // Bëjmë dy thirrje paralele për performancë më të mirë
      const [apiCategories, apiGoals] = await Promise.all([
        adminApi.getExerciseCategories(),
        adminApi.getGoals() // Sigurohu që ky funksion ekziston në adminApi
      ])

      const formattedCategories = apiCategories.map(c => ({
        id: c.id,
        name: c.name,
        type: 'Category'
      }))

      const formattedGoals = apiGoals.map(g => ({
        id: g.id,
        name: g.name,
        type: 'Goal'
      }))

      setCategories([...formattedCategories, ...formattedGoals])
    } catch (error) {
      console.error("Gabim gjatë marrjes së të dhënave:", error.message)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  // 2. Trajtimi i Formularit (Shtim ose Editim)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name) return

    setLoading(true)

    try {
      if (editingId) {
        // --- LOGJIKA E EDITIMIT ---
        if (form.type === 'Category') {
          await adminApi.updateExerciseCategory(editingId, { id: editingId, name: form.name })
        } else {
          await adminApi.updateGoal(editingId, { id: editingId, name: form.name })
        }
      } else {
        // --- LOGJIKA E SHTIMIT ---
        if (form.type === 'Category') {
          await adminApi.createExerciseCategory({ name: form.name })
        } else {
          await adminApi.createGoal({ name: form.name })
        }
      }

      // Rifreskojmë të dhënat nga serveri pas çdo ndryshimi
      await fetchAllData()
      handleClose()
    } catch (error) {
      alert(`Dështoi ${editingId ? 'përditësimi' : 'shtimi'}: ` + error.message)
    } finally {
      setLoading(false)
    }
  }

  // 3. Fshirja
  const handleDelete = async (item) => {
    const isCategory = item.type === 'Category'
    const entityName = isCategory ? 'kategorinë' : 'qëllimin'

    if (window.confirm(`A jeni të sigurt që dëshironi të fshini ${entityName} "${item.name}"?`)) {
      try {
        if (isCategory) {
          await adminApi.deleteExerciseCategory(item.id)
        } else {
          await adminApi.deleteGoal(item.id)
        }
        await fetchAllData()
      } catch (error) {
        alert(`Dështoi fshirja e ${entityName}: ` + error.message)
      }
    }
  }

  // 4. Hapja e Modalit për SHTIM
  const openForAdd = (type) => {
    setEditingId(null)
    setForm({ name: '', type })
    onOpenModal()
  }

  // 5. Hapja e Modalit për EDITIM
  const openForEdit = (item) => {
    setEditingId(item.id)
    setForm({ name: item.name, type: item.type })
    onOpenModal()
  }

  // Mbyllja e Modalit dhe pastrimi i state-eve
  const handleClose = () => {
    setForm({ name: '', type: 'Category' })
    setEditingId(null)
    onClose()
  }

  return (
    <>
      <h3 className="font-heading font-bold text-slate-900 text-lg mb-6">Kategoritë & Qëllimet</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Kolona e Kategorive */}
        <div>
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Kategoritë e Ushtrimeve</h4>
            <button onClick={() => openForAdd('Category')} className="text-[#0ea5e9] hover:bg-sky-50 p-1.5 rounded-lg cursor-pointer transition-colors"><Plus size={18} /></button>
          </div>
          <ul className="space-y-2">
            {categories.filter(c => c.type === 'Category').map(item => (
              <li key={`cat-${item.id}`} className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-black/5 text-sm font-medium text-slate-700 shadow-sm group">
                {item.name}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil size={14} onClick={() => openForEdit(item)} className="text-slate-400 hover:text-[#0ea5e9] cursor-pointer transition-colors" />
                  <Trash2 size={14} onClick={() => handleDelete(item)} className="text-slate-400 hover:text-red-500 cursor-pointer transition-colors" />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolona e Qëllimeve */}
        <div>
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Qëllimet e Klientëve</h4>
            <button onClick={() => openForAdd('Goal')} className="text-[#0ea5e9] hover:bg-sky-50 p-1.5 rounded-lg cursor-pointer transition-colors"><Plus size={18} /></button>
          </div>
          <ul className="space-y-2">
            {categories.filter(c => c.type === 'Goal').map(item => (
              <li key={`goal-${item.id}`} className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-black/5 text-sm font-medium text-slate-700 shadow-sm group">
                {item.name}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil size={14} onClick={() => openForEdit(item)} className="text-slate-400 hover:text-[#0ea5e9] cursor-pointer transition-colors" />
                  <Trash2 size={14} onClick={() => handleDelete(item)} className="text-slate-400 hover:text-red-500 cursor-pointer transition-colors" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modali për Shtim / Editim */}
      <ModalWrapper isOpen={isModalOpen} onClose={handleClose} title={editingId ? "Ndrysho të Dhënat" : "Shto Kategorinë / Qëllimin"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FieldLabel>Emri</FieldLabel>
            <FieldInput required placeholder="P.sh. Yoga, Muscle Building" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
          </div>
          <div>
            <FieldLabel>Tipi</FieldLabel>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
              {['Category','Goal'].map(t => (
                <button 
                  key={t} 
                  type="button" 
                  disabled={editingId !== null} // Bllokojmë ndryshimin e tipit nëse po editojmë
                  onClick={() => setForm(f => ({...f, type: t}))}
                  className={`py-2 text-xs font-bold rounded-lg transition-all 
                    ${form.type === t ? 'bg-white text-[#0ea5e9] shadow-sm' : 'text-slate-400'}
                    ${editingId !== null ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
                  `}>
                  {t === 'Category' ? 'Kategori Ushtrimi' : 'Qëllim Klienti'}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white rounded-xl py-3.5 text-sm font-bold hover:bg-slate-800 transition-colors cursor-pointer disabled:bg-slate-400">
            {loading ? 'Duke u ruajtur...' : (editingId ? 'Ruaj Ndryshimet' : 'Shto Opsionin')}
          </button>
        </form>
      </ModalWrapper>
    </>
  ) 
}