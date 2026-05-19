import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  ShieldAlert, 
  FileClock, 
  Settings, 
  UserX, 
  UserCheck, 
  Shield, 
  Check, 
  Save, 
  Trash2, 
  PlusCircle,
  AlertCircle
} from 'lucide-react'

// Të dhënat simuluese (Mock Data)
const initialUsers = [
  { id: 1, fullName: 'Filan Fisteku', email: 'filan@elitefit.com', role: 'Member', isActive: true },
  { id: 2, fullName: 'Arben Leka', email: 'arben.l@elitefit.com', role: 'Trainer', isActive: true },
  { id: 3, fullName: 'Sara Kovaçi', email: 'sara.k@elitefit.com', role: 'Nutritionist', isActive: true },
  { id: 4, fullName: 'Valon Berisha', email: 'valon.b@elitefit.com', role: 'Member', isActive: false },
]

const initialRoles = [
  { id: 'trainer', name: 'Trainer', permissions: { addRecipes: false, deleteVideos: true, manageUsers: false } },
  { id: 'nutritionist', name: 'Nutritionist', permissions: { addRecipes: true, deleteVideos: false, manageUsers: false } },
  { id: 'admin', name: 'Admin', permissions: { addRecipes: true, deleteVideos: true, manageUsers: true } },
]

const initialLogs = [
  { id: 1, user: 'Arben Leka', action: 'Fshiu videon "HIIT Advanced Cardio"', time: 'Sot, 14:32', type: 'danger' },
  { id: 2, user: 'Sara Kovaçi', action: 'Shtoi një recetë të re: "Sallatë me Salmon"', time: 'Sot, 11:15', type: 'success' },
  { id: 3, user: 'System', action: 'Konfigurimi "Maintenance Mode" u ndryshua', time: 'Dje, 18:40', type: 'info' },
  { id: 4, user: 'Filan Fisteku', action: 'U regjistrua në klasën Morning Yoga', time: 'Dje, 09:00', type: 'info' },
]

export default function SystemManagementDashboard() {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState(initialUsers)
  const [roles, setRoles] = useState(initialRoles)
  const [settings, setSettings] = useState({
    siteName: 'EliteFit Studio',
    maintenanceMode: false,
    maxRegistrationLimit: '500',
    allowGuestBrowsing: true
  })

  // Funksioni për të ndryshuar statusin e përdoruesit (is_active = 0 / 1)
  const toggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u))
  }

  // Funksioni për të ndryshuar lejet (permissions) e roleve
  const togglePermission = (roleId, permissionKey) => {
    setRoles(roles.map(r => {
      if (r.id === roleId) {
        return {
          ...r,
          permissions: { ...r.permissions, [permissionKey]: !r.permissions[permissionKey] }
        }
      }
      return r
    }))
  }

  return (
    <div className="p-4 md:p-10 bg-surface/30 min-h-screen">
      {/* Headeri kryesor */}
      <header className="mb-8 mt-12 md:mt-0">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-dark">
          User & System Management ⚙️
        </h1>
        <p className="text-dark/60 mt-1">Menaxhoni përdoruesit, stafin, lejet dhe konfigurimet globale të sistemit.</p>
      </header>

      {/* Navigimi me Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-black/5 shadow-sm max-w-max">
        <TabButton id="users" label="User Management" icon={Users} active={activeTab} setActive={setActiveTab} />
        <TabButton id="roles" label="Roles & Permissions" icon={Shield} active={activeTab} setActive={setActiveTab} />
        <TabButton id="logs" label="Audit Logs" icon={FileClock} active={activeTab} setActive={setActiveTab} />
        <TabButton id="settings" label="Global Settings" icon={Settings} active={activeTab} setActive={setActiveTab} />
      </div>

      {/* Përmbajtja e Ndryshueshme bazuar në Tab-in Aktiv */}
      <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-bold text-dark text-lg">Lista e Përdoruesve</h3>
                <span className="text-xs font-medium text-dark/50">{users.length} përdorues gjithsej</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/5 text-dark/40 text-xs font-medium uppercase tracking-wider">
                      <th className="pb-3">Emri dhe Mbiemri</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Roli</th>
                      <th className="pb-3">Statusi</th>
                      <th className="pb-3 text-right">Veprimi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-sm">
                    {users.map(user => (
                      <tr key={user.id} className="group hover:bg-surface/10 transition-colors">
                        <td className="py-4 font-bold text-dark">{user.fullName}</td>
                        <td className="py-4 text-dark/60">{user.email}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${user.role === 'Admin' ? 'bg-red-50 text-red-600' : user.role === 'Trainer' || user.role === 'Nutritionist' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${user.isActive ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-400'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => toggleUserStatus(user.id)}
                            className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer transition-all ${user.isActive ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                          >
                            {user.isActive ? (
                              <>
                                <UserX size={14} /> Deaktivizo
                              </>
                            ) : (
                              <>
                                <UserCheck size={14} /> Aktivizo
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                      <PermissionToggle 
                        label="Mund të shtojë receta" 
                        allowed={role.permissions.addRecipes} 
                        onChange={() => togglePermission(role.id, 'addRecipes')} 
                      />
                      <PermissionToggle 
                        label="Mund të fshijë video" 
                        allowed={role.permissions.deleteVideos} 
                        onChange={() => togglePermission(role.id, 'deleteVideos')} 
                      />
                      <PermissionToggle 
                        label="Mund të menaxhojë përdoruesit" 
                        allowed={role.permissions.manageUsers} 
                        onChange={() => togglePermission(role.id, 'manageUsers')} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h3 className="font-heading font-bold text-dark text-lg mb-2">Audit Logs Viewer</h3>
              <p className="text-xs text-dark/50 mb-6 font-medium">Monitorimi i çdo ndryshimi apo veprimi të kryer në databazë.</p>

              <div className="space-y-3">
                {initialLogs.map(log => (
                  <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface/30 transition-all border border-black/5">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${log.type === 'danger' ? 'bg-red-500' : log.type === 'success' ? 'bg-green-500' : 'bg-sky'}`} />
                      <div>
                        <h4 className="text-sm font-bold text-dark">{log.action}</h4>
                        <p className="text-xs text-dark/50">Kryer nga: <span className="font-medium text-dark/70">{log.user}</span></p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-dark/40 bg-surface px-2 py-1 rounded-lg">
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h3 className="font-heading font-bold text-dark text-lg mb-2">Global Settings</h3>
              <p className="text-xs text-dark/50 mb-6">Modifiko konfigurimet kryesore të aplikacionit në tabelën `Settings`.</p>

              <div className="max-w-xl space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark/60 mb-2">Emri i Platformës</label>
                  <input 
                    type="text" 
                    value={settings.siteName} 
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full bg-surface/50 border border-black/5 rounded-xl p-3 text-sm focus:outline-none focus:border-sky/50 font-medium"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-2xl">
                  <div className="flex gap-3 items-center">
                    <AlertCircle className="text-red-500" size={20} />
                    <div>
                      <h4 className="text-sm font-bold text-dark">Maintenance Mode</h4>
                      <p className="text-xs text-dark/50">Nëse aktivizohet, aplikacioni do të bëhet i padisponueshëm për klientët.</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="w-5 h-5 accent-red-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark/60 mb-2">Limiti Maksimal i Regjistrimeve</label>
                  <input 
                    type="number" 
                    value={settings.maxRegistrationLimit} 
                    onChange={(e) => setSettings({ ...settings, maxRegistrationLimit: e.target.value })}
                    className="w-full bg-surface/50 border border-black/5 rounded-xl p-3 text-sm focus:outline-none focus:border-sky/50 font-medium"
                  />
                </div>

                <div className="pt-4 border-t border-black/5 flex justify-end">
                  <button className="flex items-center justify-center gap-2 bg-[#0ea5e9] cursor-pointer text-white px-6 py-3 rounded-2xl font-bold hover:bg-sky/90 transition-all shadow-lg shadow-sky/20 text-sm">
                    <Save size={16} />
                    Ruaj Ndryshimet
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

// Komponent Ndihmës: Tab Button
function TabButton({ id, label, icon: Icon, active, setActive }) {
  const isActive = active === id
  return (
    <button
      onClick={() => setActive(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${isActive ? 'bg-[#0ea5e9] text-white shadow-md shadow-sky/10' : 'text-dark/60 hover:bg-surface hover:text-dark'}`}
    >
      <Icon size={16} />
      {label}
    </button>
  )
}

// Komponent Ndihmës: Permission Toggle
function PermissionToggle({ label, allowed, onChange }) {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-black/5">
      <span className="text-xs font-medium text-dark/80">{label}</span>
      <input 
        type="checkbox" 
        checked={allowed} 
        onChange={onChange}
        className="w-4 h-4 accent-[#0ea5e9] cursor-pointer"
      />
    </div>
  )
}