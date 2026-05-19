import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BellRing, 
  Zap, 
  Send, 
  Trash2, 
  Plus, 
  MessageSquare, 
  AlertCircle,
  CheckCircle2,
  Users
} from 'lucide-react'

// Të dhënat simuluese (Mock Data)
const initialTips = [
  { id: 1, text: 'Pini të paktën 2 litra ujë çdo ditë për të mbajtur trupin të hidratuar.', category: 'Nutrition', active: true },
  { id: 2, text: 'Mos harroni nxehjen (warm-up) para çdo stërvitjeje për të shmangur lëndimet.', category: 'Workout', active: true },
  { id: 3, text: 'Gjumi 7-8 orë është thelbësor për rikuperimin e muskujve.', category: 'Lifestyle', active: false },
]

const initialHistory = [
  { id: 1, title: 'Sfidë e Re: Summer Body 🏖️', date: 'Sot, 10:00', audience: 'Të gjithë përdoruesit', type: 'info' },
  { id: 2, title: 'Mirëmbajtje e Sistemit', date: 'Dje, 18:30', audience: 'Përdoruesit Aktivë', type: 'warning' },
]

export default function CommunicationDashboard() {
  const [activeTab, setActiveTab] = useState('tips')

  return (
    <div className="p-4 md:p-10 bg-surface/30 min-h-screen">
      {/* Headeri kryesor */}
      <header className="mb-8 mt-12 md:mt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-dark">
            Engagement & Comm 📢
          </h1>
          <p className="text-dark/60 mt-1">Dërgoni njoftime masive dhe menaxhoni këshillat e shpejta për përdoruesit.</p>
        </div>
      </header>

      {/* Navigimi me Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-black/5 shadow-sm max-w-max">
        <TabButton id="tips" label="QuickFix Tips" icon={Zap} active={activeTab} setActive={setActiveTab} />
        <TabButton id="notifications" label="Bulk Notifications" icon={BellRing} active={activeTab} setActive={setActiveTab} />
      </div>

      {/* Përmbajtja e Ndryshueshme */}
      <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: QUICKFIX TIPS MANAGER */}
          {activeTab === 'tips' && (
            <motion.div key="tips" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Forma për Këshillë të Re */}
                <div className="lg:col-span-1 bg-yellow-50/50 p-5 rounded-2xl border border-yellow-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="text-yellow-500" size={20} />
                    <h3 className="font-heading font-bold text-dark text-md">Shto Këshillë</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-dark/60 mb-1">Kategoria</label>
                      <select className="w-full bg-white border border-black/5 rounded-xl p-2.5 text-sm focus:outline-none focus:border-yellow-400">
                        <option>Nutrition</option>
                        <option>Workout</option>
                        <option>Lifestyle</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-dark/60 mb-1">Teksti i Këshillës</label>
                      <textarea 
                        rows="4" 
                        placeholder="Shkruaj një këshillë të shkurtër e të vlefshme..." 
                        className="w-full bg-white border border-black/5 rounded-xl p-2.5 text-sm focus:outline-none focus:border-yellow-400 resize-none"
                      ></textarea>
                    </div>
                    <button className="w-full bg-yellow-400 text-dark rounded-xl py-3 text-sm font-bold hover:bg-yellow-500 transition-colors cursor-pointer flex justify-center items-center gap-2">
                      <Plus size={16} /> Ruaj Këshillën
                    </button>
                  </div>
                </div>

                {/* Lista e Këshillave Ekzistuese */}
                <div className="lg:col-span-2">
                  <h3 className="font-heading font-bold text-dark text-md mb-4">Këshillat Aktive</h3>
                  <div className="space-y-3">
                    {initialTips.map(tip => (
                      <div key={tip.id} className="flex items-start justify-between p-4 border border-black/5 rounded-2xl hover:bg-surface/30 transition-colors gap-4 group">
                        <div className="flex gap-3 items-start">
                          <div className={`p-2 rounded-xl mt-0.5 ${
                            tip.category === 'Nutrition' ? 'bg-green-50 text-green-500' :
                            tip.category === 'Workout' ? 'bg-orange-50 text-orange-500' :
                            'bg-purple-50 text-purple-500'
                          }`}>
                            <Zap size={16} />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-dark/40 uppercase tracking-wider">{tip.category}</span>
                            <p className="text-sm font-medium text-dark mt-0.5 leading-relaxed">{tip.text}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${tip.active ? 'bg-green-50 text-green-500' : 'bg-surface text-dark/40'}`}>
                            {tip.active ? 'Shfaqet' : 'Fshehur'}
                          </span>
                          <button className="text-dark/20 hover:text-red-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: BULK NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Dërgimi i Njoftimit të Ri */}
                <div>
                  <h3 className="font-heading font-bold text-dark text-lg mb-6 flex items-center gap-2">
                    <Send className="text-sky" size={20} /> Dërgo Njoftim Masiv
                  </h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-dark/60 mb-2 uppercase tracking-wider">Titulli i Njoftimit</label>
                      <input 
                        type="text" 
                        placeholder="psh. Oferta e Fundjavës 🚀" 
                        className="w-full bg-surface/50 border border-black/5 rounded-xl p-3 text-sm focus:outline-none focus:border-sky/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-dark/60 mb-2 uppercase tracking-wider">Mesazhi</label>
                      <textarea 
                        rows="4" 
                        placeholder="Shkruaj përmbajtjen e njoftimit..." 
                        className="w-full bg-surface/50 border border-black/5 rounded-xl p-3 text-sm focus:outline-none focus:border-sky/50 resize-none"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-dark/60 mb-2 uppercase tracking-wider">Tipi</label>
                        <select className="w-full bg-surface/50 border border-black/5 rounded-xl p-3 text-sm focus:outline-none focus:border-sky/50">
                          <option value="info">Info (Blu)</option>
                          <option value="success">Sukses (E Gjelbër)</option>
                          <option value="warning">Kujdes (E Kuqe)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-dark/60 mb-2 uppercase tracking-wider">Audienca</label>
                        <select className="w-full bg-surface/50 border border-black/5 rounded-xl p-3 text-sm focus:outline-none focus:border-sky/50">
                          <option>Të gjithë përdoruesit</option>
                          <option>Vetëm Aktivët (PRO)</option>
                          <option>Vetëm Jo-aktivët</option>
                        </select>
                      </div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 bg-[#0ea5e9] cursor-pointer text-white px-6 py-3.5 rounded-xl font-bold hover:bg-sky/90 transition-all shadow-lg shadow-sky/20">
                      <BellRing size={18} />
                      Dërgo Tani ("Push Notification")
                    </button>
                  </div>
                </div>

                {/* Historiku i Njoftimeve */}
                <div className="bg-surface/20 p-6 rounded-3xl border border-black/5">
                  <h3 className="font-heading font-bold text-dark text-md mb-6 flex items-center gap-2">
                    <MessageSquare className="text-dark/40" size={18} /> Historiku i Dërgesave
                  </h3>
                  
                  <div className="space-y-4">
                    {initialHistory.map(log => (
                      <div key={log.id} className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            {log.type === 'info' ? <CheckCircle2 size={16} className="text-sky" /> : <AlertCircle size={16} className="text-red-500" />}
                            <h4 className="font-bold text-sm text-dark">{log.title}</h4>
                          </div>
                          <span className="text-[10px] text-dark/40 font-medium">{log.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-black/5">
                          <Users size={12} className="text-dark/40" />
                          <span className="text-[11px] font-medium text-dark/60">Dërguar te: <strong className="text-dark/80">{log.audience}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
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