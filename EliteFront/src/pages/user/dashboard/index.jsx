import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Flame, 
  Dumbbell, 
  Trophy, 
  Timer, 
  ArrowUpRight, 
  PlayCircle,
  Loader2
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
import { getCalorieTracking } from '../../../api/user/personalization/personalization'

export default function UserDashboard() {
  const data = localStorage.getItem('elitefit_user')
  const user = data ? JSON.parse(data) : null

  const [calorieData, setCalorieData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      // Sigurohemi që po marrim fushën e saktë të ID-së nga localStorage
      const currentUserId = user.id || user.Id

      if (!currentUserId) {
        console.warn("Përdoruesi nuk ka ID të vlefshme në localStorage.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const responseData = await getCalorieTracking(currentUserId)
        const actualData = responseData?.data || responseData
        setCalorieData(actualData)
        
      } catch (err) {
        console.warn("Backend-i ktheu gabim (Ndoshta Onboarding nuk është kryer):", err.message)
        
        // Fallback i sigurt
        setCalorieData({
          dailyCalorieTarget: 0,
          consumedCalories: 0,
          totalWorkouts: 0,
          totalTrainingHours: 0,
          currentStreak: 0,
          weeklyOverview: []
        })
        
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-2">
        <Loader2 className="animate-spin text-[#0ea5e9]" size={32} />
        <p className="text-sm text-dark/40 font-medium">Duke sinkronizuar profilin tënd...</p>
      </div>
    )
  }

  // Marrim VETËM të dhënat e grafikut nga DB, nëse s'ka kthejmë array të zbrazët
  const chartData = calorieData?.weeklyOverview || []

  return (
    <div className="p-4 md:p-10 bg-surface/30 min-h-screen">
      {/* Headeri i Mirëseardhjes */}
      <header className="mb-8 mt-12 md:mt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-dark">
            Përshëndetje, {user?.fullName?.split(' ')[0] || user?.FullName?.split(' ')[0] || 'Member'}! 👋
          </h1>
          <p className="text-dark/60 mt-1">Gati për t'i thyer limitet sot?</p>
        </div>
       
      </header>

      {/* Grid i Kartave të Progresit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <UserStatCard 
          title="Calories Target" 
          value={calorieData?.dailyCalorieTarget?.toLocaleString() || "0"} 
          unit="kcal"
          icon={Flame} 
          change={calorieData?.calorieChangePercentage ? `${calorieData.calorieChangePercentage}%` : "0%"} 
          color="text-orange-500" 
          bgColor="bg-orange-50" 
        />
        <UserStatCard 
          title="Workouts" 
          value={calorieData?.totalWorkouts || "0"} 
          unit="this month"
          icon={Dumbbell} 
          change={calorieData?.workoutChange ? `+${calorieData.workoutChange}` : "0"} 
          color="text-sky" 
          bgColor="bg-sky/10" 
        />
        <UserStatCard 
          title="Training Time" 
          value={calorieData?.totalTrainingHours || "0"} 
          unit="hours"
          icon={Timer} 
          change={calorieData?.timeChange ? `+${calorieData.timeChange}h` : "0h"} 
          color="text-purple-500" 
          bgColor="bg-purple-50" 
        />
        <UserStatCard 
          title="Current Streak" 
          value={calorieData?.currentStreak || "0"} 
          unit="days"
          icon={Trophy} 
          change={calorieData?.currentStreak > 0 ? "Active!" : "-"} 
          color="text-yellow-600" 
          bgColor="bg-yellow-50" 
        />
      </div>

      {/* Grafiku i Aktivitetit Javor (Tani merr gjerësinë e plotë) */}
      <div className="w-full bg-white p-6 rounded-3xl border border-black/5 shadow-sm overflow-hidden">
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
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
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
          ) : (
            <div className="w-full h-full flex items-center justify-center text-dark/40 text-sm">
              Nuk ka të dhëna për këtë javë.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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
        {change && change !== "0" && change !== "0%" && change !== "0h" && (
          <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg flex items-center gap-1">
            {change} <ArrowUpRight size={10} />
          </span>
        )}
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