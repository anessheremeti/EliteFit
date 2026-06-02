import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  ArrowUpRight, 
  Calendar 
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

// Të dhënat simuluese për grafikun
const data = [
  { name: 'Mon', visits: 400, sales: 240 },
  { name: 'Tue', visits: 300, sales: 139 },
  { name: 'Wed', visits: 200, sales: 980 },
  { name: 'Thu', visits: 278, sales: 390 },
  { name: 'Fri', visits: 189, sales: 480 },
  { name: 'Sat', visits: 239, sales: 380 },
  { name: 'Sun', visits: 349, sales: 430 },
]

export default function DashboardView() {
  return (
    <div className="p-6 md:p-10 bg-surface/30 min-h-screen">
      {/* Header i Dashboard-it */}
      <header className="mb-8 mt-12 md:mt-0">
        <h1 className="text-2xl font-heading font-bold text-dark">Staff Overview</h1>
        <p className="text-dark/60">Mirëseerdhe prapë! Ja çka po ndodh në EliteFit sot.</p>
      </header>

      {/* Grid i Kartave të Statistikave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Members" value="1,284" icon={Users} change="+12%" color="bg-sky-400" />
        <StatCard title="Today's Check-ins" value="142" icon={Activity} change="+5%" color="bg-pink-500" />
        <StatCard title="Monthly Revenue" value="$12,450" icon={DollarSign} change="+8%" color="bg-stone-900" />
        <StatCard title="Active Trainers" value="12" icon={TrendingUp} change="0%" color="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grafiku i Performancës (Zë 2 kolona) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading font-bold text-dark">Member Activity</h3>
            <select className="text-xs border rounded-lg px-2 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                <Tooltip />
                <Area type="monotone" dataKey="visits" stroke="#ec4899" fillOpacity={1} fill="url(#colorVisits)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Klasat e Sotme (Zë 1 kolonë) */}
        <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
          <h3 className="font-heading font-bold text-dark mb-6 flex items-center gap-2">
            <Calendar size={18} className="text-pink" />
            Today's Classes
          </h3>
          <div className="space-y-4">
            <ClassItem time="08:00 AM" name="Crossfit Advanced" trainer="Arben L." color="bg-sky" />
            <ClassItem time="10:30 AM" name="Yoga Flow" trainer="Sara K." color="bg-pink" />
            <ClassItem time="05:00 PM" name="Body Pump" trainer="Driton M." color="bg-dark" />
            <ClassItem time="07:30 PM" name="Zumba Dance" trainer="Eri S." color="bg-pink" />
          </div>
          <button className="w-full mt-6 py-3 text-sm font-medium text-pink bg-pink/5 rounded-xl hover:bg-pink/10 transition-colors">
            View All Schedule
          </button>
        </div>
      </div>
    </div>
  )
}

// Komponenti i vogël për Kartat e Statistikave
function StatCard({ title, value, icon: Icon, change, color }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} text-white`}>
          <Icon size={20} />
        </div>
        <span className="flex items-center text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
          {change} <ArrowUpRight size={12} />
        </span>
      </div>
      <h4 className="text-dark/50 text-sm font-medium">{title}</h4>
      <p className="text-2xl font-bold text-dark mt-1">{value}</p>
    </motion.div>
  )
}

// Komponenti i vogël për Listën e Klasave
function ClassItem({ time, name, trainer, color }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface transition-colors border border-transparent hover:border-black/5">
      <div className={`w-2 h-10 rounded-full ${color}`} />
      <div className="flex-1">
        <h4 className="text-sm font-bold text-dark">{name}</h4>
        <p className="text-xs text-dark/50">{trainer}</p>
      </div>
      <span className="text-xs font-mono font-medium text-dark/70">{time}</span>
    </div>
  )
}