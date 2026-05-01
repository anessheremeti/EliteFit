import React from 'react'
import { motion } from 'framer-motion'
import { 
  Flame, 
  Dumbbell, 
  Trophy, 
  Timer, 
  ArrowUpRight, 
  CheckCircle2, 
  PlayCircle 
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

// Të dhënat simuluese për progresin (psh. pesha ose kaloritë javore)
const performanceData = [
  { day: 'Mon', calories: 450 },
  { day: 'Tue', calories: 520 },
  { day: 'Wed', calories: 300 },
  { day: 'Thu', calories: 700 },
  { day: 'Fri', calories: 600 },
  { day: 'Sat', calories: 850 },
  { day: 'Sun', calories: 400 },
]

export default function UserDashboard() {
  const data = localStorage.getItem('elitefit_user')
  const user = data ? JSON.parse(data) : null

  return (
    <div className="p-4 md:p-10 bg-surface/30 min-h-screen">
      {/* Headeri i Mirëseardhjes */}
      <header className="mb-8 mt-12 md:mt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-dark">
            Përshëndetje, {user?.fullName?.split(' ')[0] || 'Champion'}! 👋
          </h1>
          <p className="text-dark/60 mt-1">Gati për t'i thyer limitet sot?</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#0ea5e9] cursor-pointer text-white px-6 py-3 rounded-2xl font-bold hover:bg-sky/90 transition-all shadow-lg shadow-sky/20">
          <PlayCircle size={20} />
          Start Today's Workout
        </button>
      </header>

      {/* Grid i Kartave të Progresit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <UserStatCard 
          title="Calories Burned" 
          value="2,450" 
          unit="kcal"
          icon={Flame} 
          change="+15%" 
          color="text-orange-500" 
          bgColor="bg-orange-50" 
        />
        <UserStatCard 
          title="Workouts" 
          value="12" 
          unit="this month"
          icon={Dumbbell} 
          change="+2" 
          color="text-sky" 
          bgColor="bg-sky/10" 
        />
        <UserStatCard 
          title="Training Time" 
          value="18.5" 
          unit="hours"
          icon={Timer} 
          change="+4h" 
          color="text-purple-500" 
          bgColor="bg-purple-50" 
        />
        <UserStatCard 
          title="Current Streak" 
          value="5" 
          unit="days"
          icon={Trophy} 
          change="New PR!" 
          color="text-yellow-600" 
          bgColor="bg-yellow-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grafiku i Aktivitetit Javor */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-black/5 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-heading font-bold text-dark text-lg">Activity Overview</h3>
              <p className="text-xs text-dark/50">Calories burned per day</p>
            </div>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-sky"></span>
              <span className="text-xs font-medium text-dark/60">This Week</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorSky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8'}} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 12, fill: '#94a3b8'}} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#0ea5e9" 
                  fillOpacity={1} 
                  fill="url(#colorSky)" 
                  strokeWidth={3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Klasat e Rezervuara / Plani */}
        <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
          <h3 className="font-heading font-bold text-dark text-lg mb-6 flex items-center gap-2">
            My Schedule
          </h3>
          <div className="space-y-4">
            <UserScheduleItem 
              title="Morning Yoga" 
              time="08:00 - 09:00" 
              trainer="Sara K." 
              status="Booked"
            />
            <UserScheduleItem 
              title="Personal Training" 
              time="16:30 - 17:30" 
              trainer="Arben L." 
              status="Confirmed"
            />
            <UserScheduleItem 
              title="HIIT Class" 
              time="19:00 - 20:00" 
              trainer="Eri S." 
              status="Pending"
            />
          </div>
          
          <div className="mt-8 p-4 bg-dark rounded-2xl text-white">
            <p className="text-xs text-white/60 mb-1">Current Membership</p>
            <div className="flex justify-between items-end">
              <h4 className="font-bold">Elite PRO Member</h4>
              <span className="text-[10px] bg-white/20 px-2 py-1 rounded-lg">Active</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-sky w-[75%] h-full"></div>
            </div>
            <p className="text-[10px] mt-2 text-white/40">22 days remaining</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Komponenti për Kartat e Statistikave
function UserStatCard({ title, value, unit, icon: Icon, change, color, bgColor }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${bgColor} ${color}`}>
          <Icon size={24} />
        </div>
        <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg flex items-center gap-1">
          {change} <ArrowUpRight size={10} />
        </span>
      </div>
      <div>
        <p className="text-dark/40 text-xs font-medium uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold text-dark">{value}</span>
          <span className="text-xs text-dark/40 font-medium">{unit}</span>
        </div>
      </div>
    </motion.div>
  )
}

// Komponenti për Itemet e Oraret
function UserScheduleItem({ title, time, trainer, status }) {
  return (
    <div className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-surface transition-all border border-transparent hover:border-black/5">
      <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-dark/30 group-hover:bg-white group-hover:text-sky transition-colors">
        <CheckCircle2 size={20} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-dark">{title}</h4>
        <p className="text-[11px] text-dark/50">{time} • {trainer}</p>
      </div>
      <span className="text-[10px] font-bold text-sky bg-sky/5 px-2 py-1 rounded-lg">
        {status}
      </span>
    </div>
  )
}