import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Award, Trash2, Edit2, Loader2, Image as ImageIcon } from 'lucide-react';
import { adminApi } from '../../../../services/adminApi'; // Rregullo rrugën
import { ErrorBanner, FieldLabel, FieldInput, ModalWrapper } from './SharedUI';

// Zëvendësoje me URL-në e saktë të serverit tënd për të shfaqur fotot
const BASE_IMAGE_URL = 'https://localhost:7049'; 

export default function BadgesTab({ isModalOpen, onClose, onOpenModal }) {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(null);

  // Form State për Create dhe Edit
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', badgeIconId: null, iconPath: null });
  
  // State për File Upload
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [modalErr, setModalErr] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); 
    setError(null);
    try { 
      setBadges(await adminApi.getBadges()); 
    } catch (e) { 
      setError(e.message); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni i sigurt që doni ta fshini këtë medalje?")) return;
    
    setSaving(id);
    try {
      await adminApi.deleteBadge(id);
      setBadges(b => b.filter(x => x.id !== id));
    } catch (e) { 
      setError(e.message); 
    } finally { 
      setSaving(null); 
    }
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setEditingId(null);
    setForm({ name: '', description: '', badgeIconId: null, iconPath: null });
    setIconFile(null);
    setIconPreview(null);
    setModalErr(null);
    onOpenModal();
  };

  const handleOpenEdit = (badge) => {
    setIsEditMode(true);
    setEditingId(badge.id);
    setForm({ 
      name: badge.name, 
      description: badge.description || '', 
      badgeIconId: badge.badgeIconId,
      iconPath: badge.iconPath 
    });
    setIconFile(null);
    setIconPreview(null);
    setModalErr(null);
    onOpenModal();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving('save'); 
    setModalErr(null);

    try {
      let finalBadgeIconId = form.badgeIconId;

      // 1. Nëse kemi zgjedhur një foto të re, e ngarkojmë fillimisht
      if (iconFile) {
        const formData = new FormData();
        formData.append('File', iconFile);
        formData.append('Filename', iconFile.name);
        formData.append('Entity', 'Badge'); 
        
        // Kthehet ID e file-it të sapokrijuar
        const uploadedFileId = await adminApi.uploadBadgeIcon(formData);
        finalBadgeIconId = uploadedFileId;
      }

      const payload = { 
        name: form.name, 
        description: form.description, 
        badgeIconId: finalBadgeIconId 
      };

      // 2. Ruajmë ose Përditësojmë Medaljen
      if (isEditMode) {
        await adminApi.updateBadge(editingId, payload);
      } else {
        await adminApi.createBadge(payload);
      }

      await load(); // Rifresko listën
      onClose(); // Mbyll modalin
    } catch (err) { 
      setModalErr(err.message); 
    } finally { 
      setSaving(null); 
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading font-bold text-slate-900 text-lg">Sistemi i Medaljeve</h3>
        <button onClick={handleOpenCreate}
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
            <div key={b.id} className="flex gap-4 p-4 border border-black/5 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all relative group overflow-hidden">
              
              {/* Shfaqja e Ikonës ose Fallback */}
              {b.iconPath ? (
                 <img 
                    src={`${BASE_IMAGE_URL}${b.iconPath}`} 
                    alt={b.name} 
                    className="w-12 h-12 object-cover rounded-xl shrink-0 border border-slate-100" 
                 />
              ) : (
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                  <Award size={22} className="text-amber-500" />
                </div>
              )}

              <div className="pr-12 min-w-0">
                <h4 className="font-bold text-slate-800 text-sm truncate">{b.name}</h4>
                {b.description && <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{b.description}</p>}
              </div>

              {/* Action Buttons (Edit & Delete) */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenEdit(b)} disabled={saving === b.id}
                  className="text-slate-300 hover:text-sky-500 transition-colors cursor-pointer disabled:opacity-50 bg-white rounded-full p-1 shadow-sm">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(b.id)} disabled={saving === b.id}
                  className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50 bg-white rounded-full p-1 shadow-sm">
                  {saving === b.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <ModalWrapper isOpen={isModalOpen} onClose={onClose} title={isEditMode ? "Ndrysho Medaljen" : "Krijo Medalje të Re"} error={modalErr}>
        <form onSubmit={handleSave} className="space-y-4">
          
          <div>
            <FieldLabel>Emri i Medaljes</FieldLabel>
            <FieldInput required placeholder="Iron Will" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
          </div>

          <div>
            <FieldLabel>Përshkrimi i Arritjes</FieldLabel>
            <textarea rows="3" required placeholder="Si fitohet kjo medalje..." value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] resize-none" />
          </div>

          {/* File Upload Section */}
          <div>
             <FieldLabel>Ikona e Medaljes (Opsionale)</FieldLabel>
             <div className="flex items-center gap-4 mt-2">
                {/* Preview i Fotos */}
                {(iconPreview || form.iconPath) ? (
                   <img 
                      src={iconPreview || `${BASE_IMAGE_URL}${form.iconPath}`} 
                      alt="Preview" 
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm" 
                   />
                ) : (
                   <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-300">
                      <ImageIcon size={24} className="text-slate-300" />
                   </div>
                )}
                
                {/* Input-i për të zgjedhur foton */}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="text-sm text-slate-500 
                    file:mr-4 file:py-2 file:px-4 
                    file:rounded-full file:border-0 
                    file:text-xs file:font-semibold 
                    file:bg-sky-50 file:text-sky-700 
                    hover:file:bg-sky-100 cursor-pointer transition-colors" 
                />
             </div>
          </div>

          <button type="submit" disabled={saving === 'save'} className="w-full mt-4 bg-slate-900 text-white rounded-xl py-3.5 text-sm font-bold hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2">
            {saving === 'save' && <Loader2 size={15} className="animate-spin" />} 
            {isEditMode ? "Ruaj Ndryshimet" : "Krijo Medaljen"}
          </button>
        </form>
      </ModalWrapper>
    </>
  );
}