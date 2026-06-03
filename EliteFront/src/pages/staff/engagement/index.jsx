import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BellRing, Zap, Send, Trash2, Plus,
  MessageSquare, AlertCircle, CheckCircle2,
  Users, Loader2, RefreshCw
} from 'lucide-react'
import { adminApi } from '../../../services/adminApi'

// ── Tab Button ────────────────────────────────────────────────────────────────
function TabButton({ id, label, icon: Icon, active, setActive }) {
  return (
    <button onClick={() => setActive(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
        active === id ? 'bg-[#0ea5e9] text-white shadow-md shadow-sky/10' : 'text-dark/60 hover:bg-surface hover:text-dark'
      }`}>
      <Icon size={16} />{label}
    </button>
  )
}

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
      const created = await adminApi.createTip({
        title:    form.text.slice(0, 80),
        content:  form.text,
        category: form.category,
      })
      // reload the list to get fresh server data
      await load()
      setForm({ category: 'Nutrition', text: '' })
    } catch (err) {
      setFormErr(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
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
      <div className="lg:col-span-1 bg-yellow-50/50 p-5 rounded-2xl border border-yellow-100">
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
            className="flex items-center gap-1 text-xs font-bold text-dark/40 hover:text-sky transition-colors">
            <RefreshCw size={12} /> Rifresko
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
            <AlertCircle size={15} className="shrink-0" />{error}
            <button onClick={load} className="ml-auto text-xs font-bold hover:underline">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-surface rounded-2xl animate-pulse" />)}
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

// ── Bulk Notifications Tab ────────────────────────────────────────────────────
// No backend endpoint yet — form is ready for future integration
const initialHistory = [
  { id: 1, title: 'Sfidë e Re: Summer Body 🏖️', date: 'Sot, 10:00',  audience: 'Të gjithë përdoruesit', type: 'info' },
  { id: 2, title: 'Mirëmbajtje e Sistemit',      date: 'Dje, 18:30',  audience: 'Përdoruesit Aktivë',    type: 'warning' },
]

function BulkNotificationsTab() {
  const [form, setForm] = useState({ title: '', message: '', type: 'info', audience: 'all' })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="font-heading font-bold text-dark text-lg mb-6 flex items-center gap-2">
          <Send className="text-sky" size={20} /> Dërgo Njoftim Masiv
        </h3>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-dark/60 mb-2 uppercase tracking-wider">Titulli</label>
            <input type="text" placeholder="psh. Oferta e Fundjavës 🚀"
              value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
              className="w-full bg-surface/50 border border-black/5 rounded-xl p-3 text-sm focus:outline-none focus:border-sky/50" />
          </div>
          <div>
            <label className="block text-xs font-bold text-dark/60 mb-2 uppercase tracking-wider">Mesazhi</label>
            <textarea rows="4" placeholder="Shkruaj përmbajtjen e njoftimit..."
              value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
              className="w-full bg-surface/50 border border-black/5 rounded-xl p-3 text-sm focus:outline-none focus:border-sky/50 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-dark/60 mb-2 uppercase tracking-wider">Tipi</label>
              <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}
                className="w-full bg-surface/50 border border-black/5 rounded-xl p-3 text-sm focus:outline-none focus:border-sky/50 cursor-pointer">
                <option value="info">Info (Blu)</option>
                <option value="success">Sukses (E Gjelbër)</option>
                <option value="warning">Kujdes (E Kuqe)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-dark/60 mb-2 uppercase tracking-wider">Audienca</label>
              <select value={form.audience} onChange={e => setForm(f => ({...f, audience: e.target.value}))}
                className="w-full bg-surface/50 border border-black/5 rounded-xl p-3 text-sm focus:outline-none focus:border-sky/50 cursor-pointer">
                <option value="all">Të gjithë përdoruesit</option>
                <option value="active">Vetëm Aktivët</option>
                <option value="inactive">Vetëm Jo-aktivët</option>
              </select>
            </div>
          </div>
          <button
            className="w-full flex items-center justify-center gap-2 bg-[#0ea5e9] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-sky/90 transition-all shadow-lg shadow-sky/20 cursor-pointer">
            <BellRing size={18} /> Dërgo Tani
          </button>
        </div>
      </div>

      <div className="bg-surface/20 p-6 rounded-3xl border border-black/5">
        <h3 className="font-heading font-bold text-dark text-md mb-6 flex items-center gap-2">
          <MessageSquare className="text-dark/40" size={18} /> Historiku i Dërgesave
        </h3>
        <div className="space-y-4">
          {initialHistory.map(log => (
            <div key={log.id} className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {log.type === 'info'
                    ? <CheckCircle2 size={16} className="text-sky" />
                    : <AlertCircle size={16} className="text-red-500" />}
                  <h4 className="font-bold text-sm text-dark">{log.title}</h4>
                </div>
                <span className="text-[10px] text-dark/40 font-medium">{log.date}</span>
              </div>
              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-black/5">
                <Users size={12} className="text-dark/40" />
                <span className="text-[11px] font-medium text-dark/60">
                  Dërguar te: <strong className="text-dark/80">{log.audience}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CommunicationDashboard() {
  const [activeTab, setActiveTab] = useState('tips')

  return (
    <div className="p-4 md:p-10 bg-surface/30 min-h-screen">
      <header className="mb-8 mt-12 md:mt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-dark">Engagement & Comm 📢</h1>
          <p className="text-dark/60 mt-1">Dërgoni njoftime masive dhe menaxhoni këshillat e shpejta për përdoruesit.</p>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-black/5 shadow-sm max-w-max">
        <TabButton id="tips"          label="QuickFix Tips"     icon={Zap}     active={activeTab} setActive={setActiveTab} />
        <TabButton id="notifications" label="Bulk Notifications" icon={BellRing} active={activeTab} setActive={setActiveTab} />
      </div>

      <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm min-h-125">
        <AnimatePresence mode="wait">
          {activeTab === 'tips' && (
            <motion.div key="tips" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <QuickFixTipsTab />
            </motion.div>
          )}
          {activeTab === 'notifications' && (
            <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <BulkNotificationsTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
