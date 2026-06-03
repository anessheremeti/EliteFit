import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, ShieldAlert, FileClock, Settings,
  UserX, UserCheck, Shield, Save, Trash2,
  AlertCircle, RefreshCw, ChevronLeft, ChevronRight,
  Filter, Plus, Check, X
} from 'lucide-react'
import { adminApi } from '../../../services/adminApi'

// ── Tab Button ────────────────────────────────────────────────────────────────
function TabButton({ id, label, icon: Icon, active, setActive }) {
  return (
    <button
      onClick={() => setActive(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
        active === id ? 'bg-[#0ea5e9] text-white shadow-md shadow-sky/10' : 'text-dark/60 hover:bg-surface hover:text-dark'
      }`}
    >
      <Icon size={16} />{label}
    </button>
  )
}

// ── Skeleton row ──────────────────────────────────────────────────────────────
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

// ── Action colour map ─────────────────────────────────────────────────────────
function actionColor(action = '') {
  const a = action.toLowerCase()
  if (a.includes('delet') || a.includes('removed')) return 'bg-red-500'
  if (a.includes('creat') || a.includes('added'))   return 'bg-green-500'
  return 'bg-sky'
}

// ── Audit Logs Tab ────────────────────────────────────────────────────────────
function AuditLogsTab() {
  const [logs,    setLogs]    = useState([])
  const [meta,    setMeta]    = useState({ totalCount: 0, page: 1, pageSize: 20 })
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [filters, setFilters] = useState({ entity: '', action: '', from: '', to: '' })

  const load = useCallback(async (page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminApi.getAuditLogs({ ...filters, page, pageSize: meta.pageSize })
      setLogs(data.items ?? [])
      setMeta({ totalCount: data.totalCount, page: data.page, pageSize: data.pageSize })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [filters, meta.pageSize])

  useEffect(() => { load(1) }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
        <button
          onClick={() => load(meta.page)}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-surface hover:bg-sky/10 hover:text-sky transition-colors"
        >
          <RefreshCw size={13} /> Rifresko
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-4 bg-surface/50 rounded-2xl border border-black/5">
        <input
          placeholder="Entity (p.sh. Recipe)"
          value={filters.entity}
          onChange={e => setFilters(f => ({ ...f, entity: e.target.value }))}
          className="bg-white border border-black/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky/40"
        />
        <input
          placeholder="Veprimi (p.sh. Created)"
          value={filters.action}
          onChange={e => setFilters(f => ({ ...f, action: e.target.value }))}
          className="bg-white border border-black/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky/40"
        />
        <input type="date"
          value={filters.from}
          onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
          className="bg-white border border-black/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky/40"
        />
        <input type="date"
          value={filters.to}
          onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
          className="bg-white border border-black/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky/40"
        />
        <button
          onClick={() => load(1)}
          className="col-span-2 md:col-span-4 flex items-center justify-center gap-2 bg-[#0ea5e9] text-white rounded-xl py-2 text-xs font-bold hover:bg-sky/90 transition-colors"
        >
          <Filter size={13} /> Apliko Filtrat
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          <AlertCircle size={15} className="shrink-0" />{error}
          <button onClick={() => load(meta.page)} className="ml-auto text-xs font-bold hover:underline">Retry</button>
        </div>
      )}

      {/* Table */}
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
                <p className="text-xs mt-1">Veprimet do të shfaqen këtu sapo të ndodhin</p>
              </div>
            )
            : logs.map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface/30 transition-all border border-black/5 gap-4">
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

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/5">
          <span className="text-xs text-dark/40">
            Faqja {meta.page} nga {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={() => load(meta.page - 1)}
              className="p-2 rounded-xl border border-black/5 hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              disabled={meta.page >= totalPages}
              onClick={() => load(meta.page + 1)}
              className="p-2 rounded-xl border border-black/5 hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Confirmation Dialog ───────────────────────────────────────────────────────
function ConfirmDialog({ user, onConfirm, onCancel, loading }) {
  const deactivating = user?.isActive
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1 }}
        exit={{    scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full border border-black/5"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl ${deactivating ? 'bg-red-50' : 'bg-green-50'}`}>
            {deactivating
              ? <UserX size={20} className="text-red-500" />
              : <UserCheck size={20} className="text-green-600" />
            }
          </div>
          <button onClick={onCancel} className="text-dark/30 hover:text-dark transition-colors">
            <X size={18} />
          </button>
        </div>
        <h4 className="font-bold text-dark text-base mb-1">
          {deactivating ? 'Çaktivizo llogarinë?' : 'Aktivizo llogarinë?'}
        </h4>
        <p className="text-sm text-dark/60 mb-6">
          {deactivating
            ? <>Përdoruesi <span className="font-semibold text-dark">{user?.fullName}</span> nuk do të mund të hyjë në sistem.</>
            : <>Përdoruesi <span className="font-semibold text-dark">{user?.fullName}</span> do të fitojë qasje sërish në sistem.</>
          }
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-black/10 text-sm font-bold text-dark/70 hover:bg-surface transition-colors disabled:opacity-40"
          >
            Anulo
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-40 ${
              deactivating ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {loading ? 'Duke u ruajtur...' : (deactivating ? 'Çaktivizo' : 'Aktivizo')}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Role Badge ────────────────────────────────────────────────────────────────
function RoleBadge({ name }) {
  const cls =
    name === 'Admin'        ? 'bg-red-50 text-red-600'    :
    name === 'Trainer'      ? 'bg-purple-50 text-purple-600' :
    name === 'Nutritionist' ? 'bg-indigo-50 text-indigo-600' :
                              'bg-gray-100 text-gray-600'
  return <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${cls}`}>{name}</span>
}

// ── Users Tab ─────────────────────────────────────────────────────────────────
function UsersTab() {
  const [users,      setUsers]      = useState([])
  const [roles,      setRoles]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)
  const [filter,     setFilter]     = useState('all')
  const [actionUser, setActionUser] = useState(null)
  const [actionBusy, setActionBusy] = useState(false)
  const [roleTarget, setRoleTarget] = useState(null) // { user, roleId, assign: bool }
  const [roleBusy,   setRoleBusy]   = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [usersData, rolesData] = await Promise.all([adminApi.getUsers(), adminApi.getRoles()])
      setUsers(usersData ?? [])
      setRoles(rolesData ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleToggle = async () => {
    if (!actionUser) return
    setActionBusy(true)
    try {
      if (actionUser.isActive) await adminApi.deactivateUser(actionUser.id)
      else                      await adminApi.activateUser(actionUser.id)
      setUsers(prev => prev.map(u => u.id === actionUser.id ? { ...u, isActive: !u.isActive } : u))
    } catch (e) {
      setError(e.message)
    } finally {
      setActionBusy(false)
      setActionUser(null)
    }
  }

  const handleRoleChange = async () => {
    if (!roleTarget) return
    setRoleBusy(true)
    try {
      const { user, roleId, assign } = roleTarget
      if (assign) await adminApi.assignRoleToUser(user.id, roleId)
      else        await adminApi.removeRoleFromUser(user.id, roleId)
      // Reload to get fresh role data
      const fresh = await adminApi.getUsers()
      setUsers(fresh ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setRoleBusy(false)
      setRoleTarget(null)
    }
  }

  const visible = users.filter(u =>
    filter === 'active'   ? u.isActive  :
    filter === 'inactive' ? !u.isActive :
    true
  )

  return (
    <>
      <AnimatePresence>
        {actionUser && (
          <ConfirmDialog
            user={actionUser}
            onConfirm={handleToggle}
            onCancel={() => setActionUser(null)}
            loading={actionBusy}
          />
        )}
        {roleTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full border border-black/5"
            >
              <h4 className="font-bold text-dark text-base mb-2">
                {roleTarget.assign ? 'Cakto Rolin' : 'Hiq Rolin'}
              </h4>
              <p className="text-sm text-dark/60 mb-6">
                {roleTarget.assign
                  ? <>Do t&apos;i caktosh rolin <span className="font-semibold">{roles.find(r => r.id === roleTarget.roleId)?.name}</span> te <span className="font-semibold">{roleTarget.user.fullName}</span>?</>
                  : <>Do ta heqësh rolin <span className="font-semibold">{roles.find(r => r.id === roleTarget.roleId)?.name}</span> nga <span className="font-semibold">{roleTarget.user.fullName}</span>?</>
                }
              </p>
              <div className="flex gap-3">
                <button onClick={() => setRoleTarget(null)} disabled={roleBusy}
                  className="flex-1 py-2.5 rounded-xl border border-black/10 text-sm font-bold text-dark/70 disabled:opacity-40">
                  Anulo
                </button>
                <button onClick={handleRoleChange} disabled={roleBusy}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 ${roleTarget.assign ? 'bg-[#0ea5e9]' : 'bg-red-500'}`}>
                  {roleBusy ? 'Duke u ruajtur...' : (roleTarget.assign ? 'Cakto' : 'Hiq')}
                </button>
              </div>
            </motion.div>
          </div>
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
                className={`px-3 py-1.5 rounded-lg transition-all ${filter === val ? 'bg-white shadow text-sky' : 'text-dark/50 hover:text-dark'}`}>
                {lbl}
              </button>
            ))}
          </div>
          <button onClick={load} className="p-2 rounded-xl border border-black/5 hover:bg-surface transition-colors" title="Rifresko">
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
              <th className="pb-3">Rolet</th>
              <th className="pb-3">Statusi</th>
              <th className="pb-3 text-right">Veprimet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 text-sm">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={5} />)
              : visible.length === 0
                ? <tr><td colSpan={5} className="py-12 text-center text-dark/30 text-sm">Nuk u gjet asnjë përdorues</td></tr>
                : visible.map(user => {
                    const userRoleIds = new Set((user.roles ?? []).map(r => r.roleId))
                    return (
                      <tr key={user.id} className="hover:bg-surface/10 transition-colors">
                        <td className="py-4 font-bold text-dark">{user.fullName}</td>
                        <td className="py-4 text-dark/60 text-xs">{user.email}</td>
                        <td className="py-4">
                          <div className="flex flex-wrap gap-1">
                            {(user.roles ?? []).length === 0
                              ? <span className="text-xs text-dark/30">Pa rol</span>
                              : (user.roles ?? []).map(r => (
                                  <div key={r.roleId} className="flex items-center gap-0.5">
                                    <RoleBadge name={r.roleName} />
                                    <button
                                      onClick={() => setRoleTarget({ user, roleId: r.roleId, assign: false })}
                                      className="text-dark/30 hover:text-red-500 transition-colors ml-0.5"
                                      title="Hiq rolin"
                                    >
                                      <X size={10} />
                                    </button>
                                  </div>
                                ))
                            }
                            {roles.filter(r => !userRoleIds.has(r.id)).map(r => (
                              <button key={r.id}
                                onClick={() => setRoleTarget({ user, roleId: r.id, assign: true })}
                                className="px-1.5 py-0.5 rounded-md text-xs font-semibold border border-dashed border-black/15 text-dark/40 hover:border-sky/40 hover:text-sky transition-all"
                                title={`Cakto ${r.name}`}
                              >+ {r.name}</button>
                            ))}
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${user.isActive ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-400'}`}>
                            {user.isActive ? 'Aktiv' : 'Joaktiv'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => setActionUser(user)}
                            className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                              user.isActive ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                          >
                            {user.isActive ? <><UserX size={14} /> Deaktivizo</> : <><UserCheck size={14} /> Aktivizo</>}
                          </button>
                        </td>
                      </tr>
                    )
                  })
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

// ── Roles & Permissions Tab ───────────────────────────────────────────────────
function RolesTab() {
  const [roles,       setRoles]       = useState([])
  const [permissions, setPermissions] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [busy,        setBusy]        = useState({})   // { "roleId-permId": true }
  const [newRoleName, setNewRoleName] = useState('')
  const [creating,    setCreating]    = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting,    setDeleting]    = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [r, p] = await Promise.all([adminApi.getRoles(), adminApi.getPermissions()])
      setRoles(r ?? [])
      setPermissions(p ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Fetch full role details on demand to know exact permission set
  const [roleDetails, setRoleDetails] = useState({}) // { roleId: RoleDetailsDto }

  const loadRoleDetails = async (roleId) => {
    if (roleDetails[roleId]) return
    try {
      const d = await adminApi.getRoleDetails(roleId)
      setRoleDetails(prev => ({ ...prev, [roleId]: d }))
    } catch { /* ignore */ }
  }

  useEffect(() => {
    roles.forEach(r => loadRoleDetails(r.id))
  }, [roles]) // eslint-disable-line react-hooks/exhaustive-deps

  const togglePermission = async (roleId, permId, currentlyOn) => {
    const key = `${roleId}-${permId}`
    setBusy(b => ({ ...b, [key]: true }))
    try {
      if (currentlyOn) await adminApi.removePermission(roleId, permId)
      else             await adminApi.assignPermission(roleId, permId)
      // Refresh role details
      const d = await adminApi.getRoleDetails(roleId)
      setRoleDetails(prev => ({ ...prev, [roleId]: d }))
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(b => ({ ...b, [key]: false }))
    }
  }

  const handleCreate = async () => {
    if (!newRoleName.trim()) return
    setCreating(true)
    try {
      await adminApi.createRole({ name: newRoleName.trim(), description: null })
      setNewRoleName('')
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminApi.deleteRole(deleteTarget.id)
      setDeleteTarget(null)
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setDeleting(false)
    }
  }

  // Group permissions by resource prefix
  const grouped = permissions.reduce((acc, p) => {
    const [resource] = p.name.split('.')
    if (!acc[resource]) acc[resource] = []
    acc[resource].push(p)
    return acc
  }, {})

  if (loading) return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-48 bg-gray-50 rounded-2xl animate-pulse" />
      ))}
    </div>
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-heading font-bold text-dark text-lg">Menaxhimi i Roleve & Lejeve</h3>
          <p className="text-xs text-dark/50 mt-0.5">{roles.length} role • {permissions.length} leje të konfigurura</p>
        </div>
        <button onClick={load} className="p-2 rounded-xl border border-black/5 hover:bg-surface transition-colors" title="Rifresko">
          <RefreshCw size={14} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          <AlertCircle size={15} className="shrink-0" />{error}
          <button onClick={() => setError(null)} className="ml-auto"><X size={14} /></button>
        </div>
      )}

      {/* Create new role */}
      <div className="flex gap-2 mb-8">
        <input
          value={newRoleName}
          onChange={e => setNewRoleName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          placeholder="Emri i rolit të ri..."
          className="flex-1 bg-surface/50 border border-black/5 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-sky/40"
        />
        <button
          onClick={handleCreate}
          disabled={creating || !newRoleName.trim()}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0ea5e9] text-white rounded-xl text-sm font-bold hover:bg-sky/90 disabled:opacity-40 transition-all"
        >
          <Plus size={14} /> {creating ? 'Duke shtuar...' : 'Shto Rolin'}
        </button>
      </div>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full border border-black/5"
            >
              <h4 className="font-bold text-dark text-base mb-2">Fshi Rolin</h4>
              <p className="text-sm text-dark/60 mb-6">
                A je i sigurt që do të fshish rolin <span className="font-semibold text-dark">{deleteTarget.name}</span>? Ky veprim nuk mund të kthehet.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)} disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl border border-black/10 text-sm font-bold text-dark/70 disabled:opacity-40">
                  Anulo
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-40">
                  {deleting ? 'Duke fshirë...' : 'Fshi'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Role × Permission matrix */}
      <div className="space-y-6">
        {roles.map(role => {
          const detail = roleDetails[role.id]
          const assignedIds = new Set((detail?.permissions ?? []).map(p => p.id))

          return (
            <div key={role.id} className="border border-black/5 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 bg-surface/30">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-sky" />
                  <h4 className="font-bold text-dark text-sm">{role.name}</h4>
                  <span className="text-xs text-dark/40">{role.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-dark/40">{detail?.permissions?.length ?? role.permissionCount} leje</span>
                  <button onClick={() => setDeleteTarget(role)}
                    className="p-1.5 rounded-lg text-dark/30 hover:text-red-500 hover:bg-red-50 transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="p-5">
                {Object.entries(grouped).map(([resource, perms]) => (
                  <div key={resource} className="mb-4 last:mb-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-dark/40 mb-2">{resource}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {perms.map(perm => {
                        const on  = assignedIds.has(perm.id)
                        const key = `${role.id}-${perm.id}`
                        const action = perm.name.split('.')[1]
                        return (
                          <button
                            key={perm.id}
                            onClick={() => togglePermission(role.id, perm.id, on)}
                            disabled={!!busy[key]}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                              on
                                ? 'bg-sky/10 border-sky/30 text-sky'
                                : 'bg-white border-black/5 text-dark/40 hover:border-sky/20 hover:text-dark/60'
                            } disabled:opacity-50`}
                          >
                            <span className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 ${on ? 'bg-sky' : 'bg-black/5'}`}>
                              {on && <Check size={9} className="text-white" />}
                            </span>
                            {action}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SystemManagementDashboard() {
  const [activeTab, setActiveTab] = useState('users')
  const [settings,  setSettings]  = useState({
    siteName: 'EliteFit Studio',
    maintenanceMode: false,
    maxRegistrationLimit: '500',
  })

  return (
    <div className="p-4 md:p-10 bg-surface/30 min-h-screen">
      <header className="mb-8 mt-12 md:mt-0">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-dark">
          User & System Management ⚙️
        </h1>
        <p className="text-dark/60 mt-1">Menaxhoni përdoruesit, stafin, lejet dhe konfigurimet globale të sistemit.</p>
      </header>

      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-black/5 shadow-sm max-w-max">
        <TabButton id="users"    label="User Management"    icon={Users}      active={activeTab} setActive={setActiveTab} />
        <TabButton id="roles"    label="Roles & Permissions" icon={Shield}     active={activeTab} setActive={setActiveTab} />
        <TabButton id="logs"     label="Audit Logs"          icon={FileClock}  active={activeTab} setActive={setActiveTab} />
        <TabButton id="settings" label="Global Settings"     icon={Settings}   active={activeTab} setActive={setActiveTab} />
      </div>

      <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm min-h-100">
        <AnimatePresence mode="wait">

          {/* ── USERS ── */}
          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <UsersTab />
            </motion.div>
          )}

          {/* ── ROLES ── */}
          {activeTab === 'roles' && (
            <motion.div key="roles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <RolesTab />
            </motion.div>
          )}

          {/* ── AUDIT LOGS — real API ── */}
          {activeTab === 'logs' && (
            <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AuditLogsTab />
            </motion.div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h3 className="font-heading font-bold text-dark text-lg mb-2">Global Settings</h3>
              <p className="text-xs text-dark/50 mb-6">Modifiko konfigurimet kryesore të aplikacionit.</p>
              <div className="max-w-xl space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark/60 mb-2">Emri i Platformës</label>
                  <input type="text" value={settings.siteName}
                    onChange={e => setSettings(s => ({ ...s, siteName: e.target.value }))}
                    className="w-full bg-surface/50 border border-black/5 rounded-xl p-3 text-sm focus:outline-none focus:border-sky/50 font-medium" />
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                  <div className="flex gap-3 items-center">
                    <AlertCircle className="text-red-500" size={20} />
                    <div>
                      <h4 className="text-sm font-bold text-dark">Maintenance Mode</h4>
                      <p className="text-xs text-dark/50">Aplikacioni do të bëhet i padisponueshëm për klientët.</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={settings.maintenanceMode}
                    onChange={e => setSettings(s => ({ ...s, maintenanceMode: e.target.checked }))}
                    className="w-5 h-5 accent-red-500 cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark/60 mb-2">Limiti Maksimal i Regjistrimeve</label>
                  <input type="number" value={settings.maxRegistrationLimit}
                    onChange={e => setSettings(s => ({ ...s, maxRegistrationLimit: e.target.value }))}
                    className="w-full bg-surface/50 border border-black/5 rounded-xl p-3 text-sm focus:outline-none focus:border-sky/50 font-medium" />
                </div>
                <div className="pt-4 border-t border-black/5 flex justify-end">
                  <button className="flex items-center gap-2 bg-[#0ea5e9] text-white px-6 py-3 rounded-2xl font-bold hover:bg-sky/90 transition-all shadow-lg shadow-sky/20 text-sm">
                    <Save size={16} /> Ruaj Ndryshimet
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
