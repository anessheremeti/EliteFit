import React, { useState, useEffect, useCallback } from 'react'
import { Zap, Plus, Trash2, AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { adminApi } from '../../../services/adminApi'

const CATEGORY_STYLE = {
  Nutrition: 'bg-green-50 text-green-500',
  Workout:   'bg-orange-50 text-orange-500',
  Lifestyle: 'bg-purple-50 text-purple-500',
}

// ── QuickFix Tips Tab ─────────────────────────────────────────────────────────
function QuickFixTipsTab() {
  const [tips,     setTips]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [saving,   setSaving]   = useState(false)
  const [formErr,  setFormErr]  = useState(null)
  const [form,     setForm]     = useState({ category: 'Nutrition', text: '' })

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try { setTips(await adminApi.getTips()) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.text.trim()) return
    setSaving(true); setFormErr(null)
    try {
      await adminApi.createTip({
        title:    form.text.slice(0, 80),
        content:  form.text,
        category: form.category,
      })
      await load()
      setForm({ category: 'Nutrition', text: '' })
    } catch (err) {
      setFormErr(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni i sigurt që dëshironi ta fshini këtë këshillë?")) return
    setDeleting(id)
    try {
      await adminApi.deleteTip(id)
      setTips(t => t.filter(x => x.id !== id))
    } catch (e) {
      setError(e.message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* ── Create form ── */}
      <div className="lg:col-span-1 bg-yellow-50/50 p-5 rounded-2xl border border-yellow-100 h-max">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="text-yellow-500" size={20} />
          <h3 className="font-heading font-bold text-dark text-md">Shto Këshillë</h3>
        </div>

        {formErr && (
          <div className="flex items-center gap-2 p-2 mb-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs">
            <AlertCircle size={13} className="shrink-0" />{formErr}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-dark/60 mb-1">Kategoria</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-white border border-black/5 rounded-xl p-2.5 text-sm focus:outline-none focus:border-yellow-400 cursor-pointer">
              <option>Nutrition</option>
              <option>Workout</option>
              <option>Lifestyle</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-dark/60 mb-1">Teksti i Këshillës</label>
            <textarea rows="4" required
              placeholder="Shkruaj një këshillë të shkurtër e të vlefshme..."
              value={form.text}
              onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
              className="w-full bg-white border border-black/5 rounded-xl p-2.5 text-sm focus:outline-none focus:border-yellow-400 resize-none"
            />
          </div>
          <button type="submit" disabled={saving}
            className="w-full bg-yellow-400 text-dark rounded-xl py-3 text-sm font-bold hover:bg-yellow-500 transition-colors cursor-pointer flex justify-center items-center gap-2 disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Plus size={16} />}
            Ruaj Këshillën
          </button>
        </form>
      </div>

      {/* ── Tips list ── */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-dark text-md">
            Këshillat Aktive
            {!loading && <span className="ml-2 text-xs font-normal text-dark/40">({tips.length})</span>}
          </h3>
          <button onClick={load}
            className="flex items-center gap-1 text-xs font-bold text-dark/40 hover:text-sky transition-colors cursor-pointer">
            <RefreshCw size={12} /> Rifresko
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
            <AlertCircle size={15} className="shrink-0" />{error}
            <button onClick={load} className="ml-auto text-xs font-bold hover:underline">Riprovo</button>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-surface rounded-2xl animate-pulse" />)}
          </div>
        ) : tips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-dark/25">
            <Zap size={36} className="mb-3 opacity-40" />
            <p className="text-sm font-semibold text-dark/40">Nuk ka këshilla. Shto të parën!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tips.map(tip => (
              <div key={tip.id}
                className="flex items-start justify-between p-4 border border-black/5 rounded-2xl hover:bg-surface/30 transition-colors gap-4 group">
                <div className="flex gap-3 items-start min-w-0">
                  <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${CATEGORY_STYLE[tip.category] ?? 'bg-gray-50 text-gray-400'}`}>
                    <Zap size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-dark/40 uppercase tracking-wider">{tip.category}</span>
                    <p className="text-sm font-medium text-dark mt-0.5 leading-relaxed line-clamp-3">
                      {tip.content || tip.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(tip.id)}
                  disabled={deleting === tip.id}
                  className="text-dark/20 hover:text-red-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 shrink-0 disabled:opacity-50"
                >
                  {deleting === tip.id
                    ? <Loader2 size={16} className="animate-spin" />
                    : <Trash2 size={16} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CommunicationDashboard() {
  return (
    <div className="p-4 md:p-10 bg-surface/30 min-h-screen">
      <header className="mb-8 mt-12 md:mt-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-dark">QuickFix Tips </h1>
          <p className="text-dark/60 mt-1">Menaxhoni këshillat e shpejta që shfaqen në aplikacion për përdoruesit.</p>
        </div>
      </header>

      <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm min-h-125">
        <QuickFixTipsTab />
      </div>
    </div>
  )
}