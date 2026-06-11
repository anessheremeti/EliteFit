import React, { useState, useEffect, useCallback } from 'react'
import { Plus, UtensilsCrossed, Flame, Trash2, Edit2, Loader2, Apple, Scale, Image as ImageIcon } from 'lucide-react'
import { adminApi } from '../../../../services/adminApi'
import { ErrorBanner, FieldLabel, FieldInput, ModalWrapper } from './SharedUI'

const INITIAL_FORM = { 
  id: null, 
  title: '', 
  calories: '', 
  instructions: '',
  proteinG: '',
  carbsG: '',
  fatG: '',
  imageFileId: ''
}

const BACKEND_URL = 'https://localhost:7049';

export default function RecipesTab({ isModalOpen, onClose, onOpenModal }) {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(null)
  
  const [form, setForm] = useState(INITIAL_FORM)
  const [selectedFile, setSelectedFile] = useState(null) 
  const [modalErr, setModalErr] = useState(null)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try { setRecipes(await adminApi.getRecipes()) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni i sigurt që dëshironi ta fshini këtë recetë?")) return
    setSaving(id)
    try {
      await adminApi.deleteRecipe(id)
      setRecipes(r => r.filter(x => x.id !== id))
    } catch (e) { setError(e.message) }
    finally { setSaving(null) }
  }

  const handleEditClick = (recipe) => {
    setForm({
      id: recipe.id,
      title: recipe.title || recipe.name || '',
      calories: recipe.calories != null ? recipe.calories.toString() : '',
      instructions: recipe.instructions || '',
      proteinG: recipe.proteinG != null ? recipe.proteinG.toString() : '',
      carbsG: recipe.carbsG != null ? recipe.carbsG.toString() : '',
      fatG: recipe.fatG != null ? recipe.fatG.toString() : '',
      imageFileId: recipe.imageFileId != null ? recipe.imageFileId.toString() : ''
    })
    setSelectedFile(null)
    onOpenModal()
  }

  const handleCloseModal = () => {
    setForm(INITIAL_FORM)
    setSelectedFile(null)
    setModalErr(null)
    onClose()
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title) return
    
    const isEditing = !!form.id
    setSaving(isEditing ? 'update' : 'create')
    setModalErr(null)

    try {
      let finalImageId = form.imageFileId ? parseInt(form.imageFileId) : null

      // 1. Nëse kemi zgjedhur një foto të re, e ngarkojmë në server
      if (selectedFile) {
        const formData = new FormData()
        formData.append('File', selectedFile) 
        formData.append('Entity', 'Recipe')
        formData.append('EntityId', form.id ? form.id.toString() : '0')
        formData.append('UploaderId', '1') 

        const uploadResponse = await adminApi.uploadFile(formData)
        
        // Menaxhimi inteligjent i përgjigjes në varësi të strukturës që kthen API
        if (typeof uploadResponse === 'number') {
          finalImageId = uploadResponse
        } else if (typeof uploadResponse === 'string') {
          finalImageId = parseInt(uploadResponse)
        } else {
          finalImageId = uploadResponse?.fileId || uploadResponse?.FileId || uploadResponse?.id || uploadResponse?.Id
        }
      }

      // 2. Ndërtimi i Payload-it për Backend
      const payload = {
        id: form.id || undefined,
        title: form.title,
        instructions: form.instructions || null,
        calories: form.calories ? parseInt(form.calories) : null,
        proteinG: form.proteinG ? parseFloat(form.proteinG) : null,
        carbsG: form.carbsG ? parseFloat(form.carbsG) : null,
        fatG: form.fatG ? parseFloat(form.fatG) : null,
        allergenIds: [],
        // Sigurohemi që nëse nuk ka foto të re, dërgojmë ID-në ekzistuese dhe jo null
        imageFileId: finalImageId || (form.imageFileId ? parseInt(form.imageFileId) : null)
      }

      if (isEditing) {
        await adminApi.updateRecipe(form.id, payload)
      } else {
        await adminApi.createRecipe(payload)
      }

      await load() 
      handleCloseModal()
    } catch (err) { 
      setModalErr(err.message || "Diçka shkoi keq gjatë ruajtjes.") 
    } finally { 
      setSaving(null) 
    }
  }

  return (
    <>
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
            <div key={r.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-black/5 rounded-2xl bg-white hover:bg-slate-50/50 shadow-sm transition-colors gap-4">
              
              <div className="flex items-center gap-4">
                {r.imagePath ? (
                  <img 
                    src={r.imagePath.startsWith('http') ? r.imagePath : `${BACKEND_URL}${r.imagePath.startsWith('/') ? '' : '/'}${r.imagePath}`} 
                    alt={r.title} 
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-sm bg-slate-50"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-300">
                    <ImageIcon size={24} />
                  </div>
                )}
                
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{r.title || r.name}</h4>
                  <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-400">
                    {r.calories != null && (
                      <span className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-0.5 rounded-lg font-medium">
                        <Flame size={12} /> {r.calories} kcal
                      </span>
                    )}
                    {r.proteinG != null && <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg font-medium"><Apple size={12}/> P: {r.proteinG}g</span>}
                    {r.carbsG != null && <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg font-medium"><Scale size={12}/> C: {r.carbsG}g</span>}
                    {r.fatG != null && <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg font-medium">F: {r.fatG}g</span>}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 text-sm font-semibold items-center justify-end">
                <button onClick={() => handleEditClick(r)}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer text-xs bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg">
                  <Edit2 size={13} /> Ndrysho
                </button>
                <button onClick={() => handleDelete(r.id)} disabled={saving === r.id}
                  className="flex items-center gap-1 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50 cursor-pointer text-xs bg-red-50/50 hover:bg-red-50 px-2.5 py-1.5 rounded-lg">
                  {saving === r.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />} Fshij
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalWrapper isOpen={isModalOpen} onClose={handleCloseModal} title={form.id ? "Ndrysho Recetën" : "Shto Recetë të Re"} error={modalErr}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FieldLabel>Emri i Recetës</FieldLabel>
            <FieldInput required placeholder="P.sh. Pancakes me Proteinë" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Kaloritë (kcal)</FieldLabel>
              <FieldInput type="number" placeholder="350" value={form.calories} onChange={e => setForm(f => ({...f, calories: e.target.value}))} />
            </div>
            
            <div>
              <FieldLabel>Foto e Recetës</FieldLabel>
              <label className="flex items-center gap-2 border border-dashed border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold text-slate-600">
                <ImageIcon size={16} className="text-slate-400" />
                <span className="truncate w-full">
                  {selectedFile ? selectedFile.name : (form.imageFileId ? "Foto ekzistuese (Kliko për t'a ndryshuar)" : "Zgjidh një foto")}
                </span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <FieldLabel>Proteinë (g)</FieldLabel>
              <FieldInput type="number" step="0.1" placeholder="25" value={form.proteinG} onChange={e => setForm(f => ({...f, proteinG: e.target.value}))} />
            </div>
            <div>
              <FieldLabel>Karbohidrate (g)</FieldLabel>
              <FieldInput type="number" step="0.1" placeholder="40" value={form.carbsG} onChange={e => setForm(f => ({...f, carbsG: e.target.value}))} />
            </div>
            <div>
              <FieldLabel>Yndyrë (g)</FieldLabel>
              <FieldInput type="number" step="0.1" placeholder="8" value={form.fatG} onChange={e => setForm(f => ({...f, fatG: e.target.value}))} />
            </div>
          </div>

          <div>
            <FieldLabel>Instruksionet (opsionale)</FieldLabel>
            <textarea rows="3" placeholder="Mënyra e përgatitjes..." value={form.instructions} onChange={e => setForm(f => ({...f, instructions: e.target.value}))}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] resize-none" />
          </div>

          <button type="submit" disabled={saving === 'create' || saving === 'update'} className="w-full bg-slate-900 text-white rounded-xl py-3.5 text-sm font-bold hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-60 flex justify-center items-center gap-2">
            {(saving === 'create' || saving === 'update') && <Loader2 size={15} className="animate-spin" />} 
            {form.id ? "Ruaj Ndryshimet" : "Ruaj Recetën"}
          </button>
        </form>
      </ModalWrapper>
    </>
  )
}