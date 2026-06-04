import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, FileClock, Settings,
  UserX, UserCheck, Shield, Trash2,
  AlertCircle, RefreshCw, ChevronLeft, ChevronRight,
  Filter, X, Plus, Pencil, Search, CheckCircle2, XCircle,
  SlidersHorizontal,
} from 'lucide-react'
import { adminApi } from '../../../services/adminApi'

// ── Helpers ───────────────────────────────────────────────────────────────────
function TabButton({ id, label, icon: Icon, active, setActive }) {
  return (
    <button
      onClick={() => setActive(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
        active === id ? 'bg-[#0ea5e9] text-white shadow-md' : 'text-dark/60 hover:bg-surface hover:text-dark'
      }`}
    >
      <Icon size={16} />{label}
    </button>
  )
}

function SkeletonRow({ cols = 5 }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 pr-4">
          <div className="h-3 bg-gray-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  )
}

function actionColor(action = '') {
  const a = action.toLowerCase()
  if (a.includes('delet') || a.includes('removed')) return 'bg-red-500'
  if (a.includes('creat') || a.includes('added'))   return 'bg-green-500'
  return 'bg-sky'
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-5 right-5 z-60 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold pointer-events-auto ${
              t.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {t.type === 'error' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ── Audit Logs Tab ────────────────────────────────────────────────────────────
function AuditLogsTab() {
  const [logs,    setLogs]    = useState([])
  const [meta,    setMeta]    = useState({ totalCount: 0, page: 1, pageSize: 20 })
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [filters, setFilters] = useState({ entity: '', action: '', from: '', to: '' })

  const load = useCallback(async (page = 1) => {
    setLoading(true); setError(null)
    try {
      const data = await adminApi.getAuditLogs({ ...filters, page, pageSize: meta.pageSize })
      setLogs(data.items ?? [])
      setMeta({ totalCount: data.totalCount, page: data.page, pageSize: data.pageSize })
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [filters, meta.pageSize])

  useEffect(() => { load(1) }, []) // eslint-disable-line

  const totalPages = Math.max(1, Math.ceil(meta.totalCount / meta.pageSize))

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-heading font-bold text-dark text-lg">Audit Logs Viewer</h3>
          <p className="text-xs text-dark/50 mt-0.5">
            {meta.totalCount > 0 ? `${meta.totalCount} regjistrime gjithsej` : 'Monitorimi i çdo veprimi në sistem'}
          </p>
        </div>
        <button onClick={() => load(meta.page)}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-surface hover:bg-sky/10 hover:text-sky transition-colors">
          <RefreshCw size={13} /> Rifresko
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-4 bg-surface/50 rounded-2xl border border-black/5">
        <input placeholder="Entity (p.sh. Recipe)" value={filters.entity}
          onChange={e => setFilters(f => ({ ...f, entity: e.target.value }))}
          className="bg-white border border-black/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky/40" />
        <input placeholder="Veprimi (p.sh. Created)" value={filters.action}
          onChange={e => setFilters(f => ({ ...f, action: e.target.value }))}
          className="bg-white border border-black/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky/40" />
        <input type="date" value={filters.from}
          onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
          className="bg-white border border-black/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky/40" />
        <input type="date" value={filters.to}
          onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
          className="bg-white border border-black/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky/40" />
        <button onClick={() => load(1)}
          className="col-span-2 md:col-span-4 flex items-center justify-center gap-2 bg-[#0ea5e9] text-white rounded-xl py-2 text-xs font-bold hover:bg-sky/90 transition-colors">
          <Filter size={13} /> Apliko Filtrat
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          <AlertCircle size={15} className="shrink-0" />{error}
          <button onClick={() => load(meta.page)} className="ml-auto text-xs font-bold hover:underline">Retry</button>
        </div>
      )}

      <div className="space-y-2">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-50 rounded-2xl animate-pulse" />
            ))
          : logs.length === 0
            ? (
              <div className="flex flex-col items-center justify-center py-16 text-dark/30">
                <FileClock size={40} className="mb-3 opacity-30" />
                <p className="text-sm font-semibold">Asnjë regjistrim nuk u gjet</p>
              </div>
            )
            : logs.map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface/30 border border-black/5 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${actionColor(log.action)}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-dark truncate">
                      {log.action} — <span className="text-sky">{log.entity}</span>
                      {log.entityId ? ` #${log.entityId}` : ''}
                    </p>
                    <p className="text-xs text-dark/50 mt-0.5">
                      Kryer nga: <span className="font-semibold text-dark/70">{log.userName || `User #${log.userId}`}</span>
                      {log.ipAddress ? <span className="ml-2 text-dark/30">· {log.ipAddress}</span> : ''}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-dark/40 bg-surface px-2 py-1 rounded-lg shrink-0 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString('sq-AL', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
            ))
        }
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/5">
          <span className="text-xs text-dark/40">Faqja {meta.page} nga {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={meta.page <= 1} onClick={() => load(meta.page - 1)}
              className="p-2 rounded-xl border border-black/5 hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft size={14} />
            </button>
            <button disabled={meta.page >= totalPages} onClick={() => load(meta.page + 1)}
              className="p-2 rounded-xl border border-black/5 hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── User Activate/Deactivate Dialog ───────────────────────────────────────────
function UserConfirmDialog({ user, onConfirm, onCancel, loading }) {
  const deactivating = user?.isActive
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full border border-black/5"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl ${deactivating ? 'bg-red-50' : 'bg-green-50'}`}>
            {deactivating ? <UserX size={20} className="text-red-500" /> : <UserCheck size={20} className="text-green-600" />}
          </div>
          <button onClick={onCancel} className="text-dark/30 hover:text-dark"><X size={18} /></button>
        </div>
        <h4 className="font-bold text-dark text-base mb-1">
          {deactivating ? 'Çaktivizo llogarinë?' : 'Aktivizo llogarinë?'}
        </h4>
        <p className="text-sm text-dark/60 mb-6">
          {deactivating
            ? <>Përdoruesi <span className="font-semibold text-dark">{user?.fullName}</span> nuk do të mund të hyjë në sistem.</>
            : <>Përdoruesi <span className="font-semibold text-dark">{user?.fullName}</span> do të fitojë qasje sërish.</>
          }
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-black/10 text-sm font-bold text-dark/70 hover:bg-surface disabled:opacity-40">
            Anulo
          </button>
          <button onClick={onConfirm} disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 ${
              deactivating ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}>
            {loading ? 'Duke u ruajtur...' : (deactivating ? 'Çaktivizo' : 'Aktivizo')}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab() {
  const [users,      setUsers]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [filter,     setFilter]     = useState('all')
  const [actionUser, setActionUser] = useState(null)
  const [actionBusy, setActionBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try { setUsers((await adminApi.getUsers()) ?? []) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleToggle = async () => {
    if (!actionUser) return
    setActionBusy(true)
    try {
      actionUser.isActive
        ? await adminApi.deactivateUser(actionUser.id)
        : await adminApi.activateUser(actionUser.id)
      setUsers(prev => prev.map(u => u.id === actionUser.id ? { ...u, isActive: !u.isActive } : u))
    } catch (e) { setError(e.message) }
    finally { setActionBusy(false); setActionUser(null) }
  }

  const visible = users.filter(u =>
    filter === 'active'   ? u.isActive  :
    filter === 'inactive' ? !u.isActive : true
  )

  return (
    <>
      <AnimatePresence>
        {actionUser && (
          <UserConfirmDialog user={actionUser} onConfirm={handleToggle}
            onCancel={() => setActionUser(null)} loading={actionBusy} />
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-heading font-bold text-dark text-lg">Lista e Përdoruesve</h3>
          {!loading && <p className="text-xs text-dark/50 mt-0.5">{users.length} përdorues gjithsej</p>}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-surface rounded-xl p-1 gap-1 text-xs font-bold">
            {[['all','Të gjithë'],['active','Aktiv'],['inactive','Joaktiv']].map(([val, lbl]) => (
              <button key={val} onClick={() => setFilter(val)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filter === val ? 'bg-white shadow text-sky' : 'text-dark/50 hover:text-dark'
                }`}>{lbl}</button>
            ))}
          </div>
          <button onClick={load} className="p-2 rounded-xl border border-black/5 hover:bg-surface" title="Rifresko">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          <AlertCircle size={15} className="shrink-0" />{error}
          <button onClick={load} className="ml-auto text-xs font-bold hover:underline">Riprovo</button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-black/5 text-dark/40 text-xs font-medium uppercase tracking-wider">
              <th className="pb-3">Emri</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Roli</th>
              <th className="pb-3">Statusi</th>
              <th className="pb-3 text-right">Veprimi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 text-sm">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={5} />)
              : visible.length === 0
                ? <tr><td colSpan={5} className="py-12 text-center text-dark/30 text-sm">Nuk u gjet asnjë përdorues</td></tr>
                : visible.map(user => (
                  <tr key={user.id} className="hover:bg-surface/10 transition-colors">
                    <td className="py-4 font-bold text-dark">{user.fullName}</td>
                    <td className="py-4 text-dark/60">{user.email}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        user.role === 'Admin'        ? 'bg-red-50 text-red-600'    :
                        user.role === 'Trainer' || user.role === 'Nutritionist'
                                                     ? 'bg-purple-50 text-purple-600'
                                                     : 'bg-gray-100 text-gray-600'
                      }`}>{user.role ?? 'Member'}</span>
                    </td>
                    <td className="py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        user.isActive ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-400'
                      }`}>{user.isActive ? 'Aktiv' : 'Joaktiv'}</span>
                    </td>
                    <td className="py-4 text-right">
                      <button onClick={() => setActionUser(user)}
                        className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                          user.isActive ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}>
                        {user.isActive ? <><UserX size={14} /> Deaktivizo</> : <><UserCheck size={14} /> Aktivizo</>}
                      </button>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

// ── Settings: Delete Confirm Dialog ──────────────────────────────────────────
function SettingDeleteDialog({ name, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full border border-black/5"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-xl bg-red-50">
            <Trash2 size={20} className="text-red-500" />
          </div>
          <button onClick={onCancel} className="text-dark/30 hover:text-dark"><X size={18} /></button>
        </div>
        <h4 className="font-bold text-dark text-base mb-1">Fshi cilësimin?</h4>
        <p className="text-sm text-dark/60 mb-6">
          Cilësimi{' '}
          <span className="font-semibold font-mono text-dark bg-gray-50 px-1.5 py-0.5 rounded-lg">{name}</span>{' '}
          do të fshihet përgjithmonë. Ky veprim nuk mund të kthehet.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-black/10 text-sm font-bold text-dark/70 hover:bg-surface disabled:opacity-40">
            Anulo
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-40">
            {loading ? 'Duke fshirë...' : 'Fshi'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Settings: Form Modal ──────────────────────────────────────────────────────
function SettingFormModal({ initial, onSave, onClose, busy }) {
  const isEdit = Boolean(initial)
  const [form,   setForm]   = useState({ key: initial?.key ?? '', value: initial?.value ?? '', description: initial?.description ?? '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.key.trim())              e.key = 'Çelësi është i detyrueshëm.'
    if (form.key.trim().length > 100)  e.key = 'Çelësi nuk mund të kalojë 100 karaktere.'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave({ key: form.key.trim(), value: form.value.trim() || null, description: form.description.trim() || null })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full border border-black/5"
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h4 className="font-bold text-dark text-lg">{isEdit ? 'Ndrysho Cilësimin' : 'Shto Cilësim të Ri'}</h4>
            <p className="text-xs text-dark/50 mt-0.5">
              {isEdit ? 'Modifiko çelësin ose vlerën.' : 'Krijo një konfigurim të ri për sistemin.'}
            </p>
          </div>
          <button onClick={onClose} className="text-dark/30 hover:text-dark transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Key */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark/60 mb-1.5">
              Çelësi (Key) <span className="text-red-400">*</span>
            </label>
            <input
              value={form.key}
              onChange={e => { setForm(f => ({ ...f, key: e.target.value })); setErrors(er => ({ ...er, key: undefined })) }}
              placeholder="p.sh. site_name, max_upload_mb"
              className={`w-full bg-surface/50 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky/50 font-mono ${
                errors.key ? 'border-red-300' : 'border-black/8'
              }`}
            />
            {errors.key && <p className="text-xs text-red-500 mt-1">{errors.key}</p>}
          </div>

          {/* Value */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark/60 mb-1.5">Vlera (Value)</label>
            <input
              value={form.value}
              onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
              placeholder="Vlera e cilësimit (opsionale)"
              className="w-full bg-surface/50 border border-black/8 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark/60 mb-1.5">Përshkrimi</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Çfarë kontrollon ky cilësim? (opsionale)"
              className="w-full bg-surface/50 border border-black/8 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-sky/50 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} disabled={busy}
              className="flex-1 py-2.5 rounded-xl border border-black/10 text-sm font-bold text-dark/70 hover:bg-surface disabled:opacity-40 transition-colors">
              Anulo
            </button>
            <button type="submit" disabled={busy}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0ea5e9] hover:bg-sky/90 disabled:opacity-40 transition-colors shadow-lg shadow-sky/20">
              {busy ? 'Duke u ruajtur...' : (isEdit ? 'Ruaj Ndryshimet' : 'Krijo Cilësimin')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ── Settings Tab ──────────────────────────────────────────────────────────────
function SettingsTab() {
  const [settings,     setSettings]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [search,       setSearch]       = useState('')
  const [modal,        setModal]        = useState(null)   // null | 'create' | setting-object
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteBusy,   setDeleteBusy]   = useState(false)
  const [saveBusy,     setSaveBusy]     = useState(false)
  const [toasts,       setToasts]       = useState([])

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try { setSettings((await adminApi.getSettings()) ?? []) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = settings.filter(s =>
    s.key.toLowerCase().includes(search.toLowerCase()) ||
    (s.description ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = async (formData) => {
    setSaveBusy(true)
    try {
      if (modal === 'create') {
        await adminApi.createSetting(formData)
        addToast('Cilësimi u krijua me sukses.')
      } else {
        await adminApi.updateSetting(modal.id, formData)
        addToast('Cilësimi u përditësua me sukses.')
      }
      setModal(null)
      await load()
    } catch (e) {
      addToast(e.message, 'error')
    } finally {
      setSaveBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteBusy(true)
    try {
      await adminApi.deleteSetting(deleteTarget.id)
      addToast('Cilësimi u fshi me sukses.')
      setSettings(prev => prev.filter(s => s.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (e) {
      addToast(e.message, 'error')
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} />

      <AnimatePresence>
        {deleteTarget && (
          <SettingDeleteDialog
            name={deleteTarget.key}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleteBusy}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal !== null && (
          <SettingFormModal
            initial={modal === 'create' ? null : modal}
            onSave={handleSave}
            onClose={() => setModal(null)}
            busy={saveBusy}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-heading font-bold text-dark text-lg">Cilësimet e Sistemit</h3>
          {!loading && (
            <p className="text-xs text-dark/50 mt-0.5">
              {filtered.length !== settings.length
                ? `${filtered.length} nga ${settings.length} cilësime`
                : `${settings.length} cilësime gjithsej`
              }
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Kërko sipas çelësit..."
              className="pl-8 pr-8 py-2 text-xs bg-surface border border-black/5 rounded-xl focus:outline-none focus:border-sky/40 w-48"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark">
                <X size={12} />
              </button>
            )}
          </div>
          {/* Refresh */}
          <button onClick={load}
            className="p-2 rounded-xl border border-black/5 hover:bg-surface transition-colors" title="Rifresko">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          {/* Add */}
          <button onClick={() => setModal('create')}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-[#0ea5e9] text-white hover:bg-sky/90 transition-colors shadow-lg shadow-sky/20">
            <Plus size={14} /> Shto Cilësim
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          <AlertCircle size={15} className="shrink-0" />{error}
          <button onClick={load} className="ml-auto text-xs font-bold hover:underline">Riprovo</button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-black/5">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface/60">
            <tr className="text-dark/40 text-xs font-semibold uppercase tracking-wider">
              <th className="px-4 py-3">Çelësi (Key)</th>
              <th className="px-4 py-3">Vlera (Value)</th>
              <th className="px-4 py-3 hidden md:table-cell">Përshkrimi</th>
              <th className="px-4 py-3 text-right">Veprimet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 text-sm">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>
                    <td className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-1/2" /></td>
                    <td className="px-4 py-4 hidden md:table-cell"><div className="h-3 bg-gray-100 rounded w-2/3" /></td>
                    <td className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-1/4 ml-auto" /></td>
                  </tr>
                ))
              : filtered.length === 0
                ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center text-dark/30">
                        <SlidersHorizontal size={36} className="mb-3 opacity-30" />
                        <p className="text-sm font-semibold">
                          {search ? 'Asnjë cilësim nuk përputhet me kërkimin.' : 'Asnjë cilësim nuk u gjet.'}
                        </p>
                        {!search && <p className="text-xs mt-1">Shtyp "Shto Cilësim" për të krijuar të parin.</p>}
                      </div>
                    </td>
                  </tr>
                )
                : filtered.map(s => (
                  <tr key={s.id} className="hover:bg-surface/30 transition-colors group">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs font-semibold bg-sky/10 text-sky px-2 py-1 rounded-lg">
                        {s.key}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 max-w-50">
                      {s.value
                        ? <span className="text-sm text-dark/80 truncate block">{s.value}</span>
                        : <span className="text-xs text-dark/25 italic">—</span>
                      }
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell max-w-65">
                      {s.description
                        ? <span className="text-xs text-dark/55 truncate block">{s.description}</span>
                        : <span className="text-xs text-dark/25 italic">—</span>
                      }
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setModal(s)}
                          className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-sky/10 text-sky hover:bg-sky/20 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Pencil size={12} /> Ndrysho
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={12} /> Fshi
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {!loading && filtered.length > 0 && (
        <p className="text-xs text-dark/30 mt-3 text-right">
          Duke shfaqur {filtered.length} cilësim{filtered.length !== 1 ? 'e' : ''}
          {search && ` · Filtruar nga "${search}"`}
        </p>
      )}
    </>
  )
}

// ── Roles Tab (mock — pending API integration) ────────────────────────────────
const initialRoles = [
  { id: 'trainer',      name: 'Trainer',      permissions: { addRecipes: false, deleteVideos: true,  manageUsers: false } },
  { id: 'nutritionist', name: 'Nutritionist', permissions: { addRecipes: true,  deleteVideos: false, manageUsers: false } },
  { id: 'admin',        name: 'Admin',        permissions: { addRecipes: true,  deleteVideos: true,  manageUsers: true  } },
]

function PermissionToggle({ label, allowed, onChange }) {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-black/5">
      <span className="text-xs font-medium text-dark/80">{label}</span>
      <input type="checkbox" checked={allowed} onChange={onChange} className="w-4 h-4 accent-[#0ea5e9] cursor-pointer" />
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function SystemManagementDashboard() {
  const [activeTab, setActiveTab] = useState('users')
  const [roles,     setRoles]     = useState(initialRoles)

  const togglePermission = (roleId, key) =>
    setRoles(r => r.map(x => x.id === roleId ? { ...x, permissions: { ...x.permissions, [key]: !x.permissions[key] } } : x))

  return (
    <div className="p-4 md:p-10 bg-surface/30 min-h-screen">
      <header className="mb-8 mt-12 md:mt-0">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-dark">
          User & System Management ⚙️
        </h1>
        <p className="text-dark/60 mt-1">Menaxhoni përdoruesit, stafin, lejet dhe konfigurimet globale të sistemit.</p>
      </header>

      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-black/5 shadow-sm max-w-max">
        <TabButton id="users"    label="User Management"     icon={Users}    active={activeTab} setActive={setActiveTab} />
        <TabButton id="roles"    label="Roles & Permissions" icon={Shield}   active={activeTab} setActive={setActiveTab} />
        <TabButton id="logs"     label="Audit Logs"          icon={FileClock} active={activeTab} setActive={setActiveTab} />
        <TabButton id="settings" label="Global Settings"     icon={Settings}  active={activeTab} setActive={setActiveTab} />
      </div>

      <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm min-h-100">
        <AnimatePresence mode="wait">

          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <UsersTab />
            </motion.div>
          )}

          {activeTab === 'roles' && (
            <motion.div key="roles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h3 className="font-heading font-bold text-dark text-lg mb-2">Menaxhimi i Qasjes për Stafin</h3>
              <p className="text-xs text-dark/50 mb-6">Përcaktoni saktë se çfarë mund të bëjë secili rol në sistem.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map(role => (
                  <div key={role.id} className="border border-black/5 p-5 rounded-2xl bg-surface/20">
                    <div className="flex items-center gap-2 mb-4 border-b border-black/5 pb-3">
                      <Shield size={18} className="text-sky" />
                      <h4 className="font-bold text-dark">{role.name}</h4>
                    </div>
                    <div className="space-y-3">
                      <PermissionToggle label="Mund të shtojë receta"         allowed={role.permissions.addRecipes}   onChange={() => togglePermission(role.id, 'addRecipes')} />
                      <PermissionToggle label="Mund të fshijë video"          allowed={role.permissions.deleteVideos} onChange={() => togglePermission(role.id, 'deleteVideos')} />
                      <PermissionToggle label="Mund të menaxhojë përdoruesit" allowed={role.permissions.manageUsers}  onChange={() => togglePermission(role.id, 'manageUsers')} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AuditLogsTab />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <SettingsTab />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
