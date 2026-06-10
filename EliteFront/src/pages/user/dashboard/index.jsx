import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Flame, 
  Dumbbell, 
  Trophy, 
  Timer, 
  ArrowUpRight, 
  Loader2,
  FileText,
  FileSpreadsheet,
  Medal,
  Lightbulb,
  CheckCircle2
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

// Importet nga shtresa e API-ve sipas strukturës tënde të folderave
import { getCalorieTracking } from '../../../api/user/personalization/personalization'
import { exportWorkoutHistoryExcel, exportWorkoutHistoryPdf } from '../../../api/user/reports/report'
import { getUserBadges, getUserStreak, getQuickFixTips } from '../../../api/user/dashboard/dashboard'

// =========================================================================
// FUNKSION NDIHMËS: Nxjerr ID-në nga JWT pa e ekspozuar në localStorage
// =========================================================================
function getUserIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    const payload = JSON.parse(jsonPayload);
    
    // Kërkon çelësat standardë të ID-së në një token .NET
    return payload.id || payload.sub || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  } catch (error) {
    console.error("Gabim gjatë dekodimit të token-it:", error);
    return null;
  }
}

export default function UserDashboard() {
  const data = localStorage.getItem('elitefit_user')
  const user = data ? JSON.parse(data) : null

  // States për të dhënat dinamike
  const [calorieData, setCalorieData] = useState(null)
  const [badges, setBadges] = useState([])
  const [streakInfo, setStreakInfo] = useState(null)
  const [tips, setTips] = useState([])
  
  // States për ngarkimet dhe shkarkimet
  const [loading, setLoading] = useState(true)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [excelLoading, setExcelLoading] = useState(false)

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      // Lexo ID-në direkt nga Token-i i sigurt
      const currentUserId = getUserIdFromToken()

      if (!currentUserId) {
        console.warn("Përdoruesi nuk ka një ID të vlefshme në Token ose nuk është i loguar.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Ekzekutojmë thirrjet paralelisht që dashboard-i të ngarkohet sa më shpejt
        const [calorieRes, badgesRes, streakRes, tipsRes] = await Promise.allSettled([
          getCalorieTracking(currentUserId),
          getUserBadges(currentUserId),
          getUserStreak(currentUserId),
          getQuickFixTips()
        ])

        // 1. Përpunimi i të dhënave të kalorive
        if (calorieRes.status === 'fulfilled') {
          setCalorieData(calorieRes.value?.data || calorieRes.value)
        } else {
          console.warn("Gabim në marrjen e kalorive:", calorieRes.reason);
          setCalorieData({
            dailyTargetCalories: 0,
            dailyCalorieTarget: 0,
            consumedCalories: 0,
            totalWorkouts: 0,
            totalTrainingHours: 0,
            currentStreak: 0,
            weeklyOverview: []
          })
        }

        // 2. Përpunimi i Medaljeve (Badges)
        if (badgesRes.status === 'fulfilled') {
          setBadges(badgesRes.value?.data || badgesRes.value || [])
        } else {
          // Fallback Statik nëse s'ka të dhëna nga backend
          setBadges([
            { id: 1, name: "Mirëseerdhe", description: "Krijimi i profilit fillestar", icon: "Trophy" },
            { id: 2, name: "Stërvitja e Parë", description: "Përfundo stërvitjen tënde të parë", icon: "Dumbbell" }
          ])
        }

        // 3. Përpunimi i Serisë Aktive (Streak)
        if (streakRes.status === 'fulfilled') {
          setStreakInfo(streakRes.value?.data || streakRes.value)
        }

        // 4. Përpunimi i Këshillave (QuickFix Tips)
        if (tipsRes.status === 'fulfilled') {
          setTips(tipsRes.value?.data || tipsRes.value || [])
        } else {
          // Fallback Statik për këshilla
          setTips([
            { id: 1, tipContent: "Qëndro i hidratuar! Pi të paktën 2.5L ujë sot për performancë maksimale." },
            { id: 2, tipContent: "Gjumi i rregullt prej 7-8 orësh rrit rikuperimin e muskujve me 30%." }
          ])
        }

      } catch (globalErr) {
        console.error("Gabim kritik gjatë sinkronizimit të të dhënave:", globalErr)
      } finally {
        setLoading(false)
      }
    }

    fetchAllDashboardData()
  }, [])

  // Menaxhimi i shkarkimit të skedarit PDF
const handleDownloadPdf = async () => {
    try {
      setPdfLoading(true);
      const userId = getUserIdFromToken(); // Merr ID-në e saktë
      
      console.log("ID e nxjerrë nga tokeni është:", userId); // Hapi DevTools (F12) për të parë nëse është null/undefined
      // Shto userId në parametra
      const data = await exportWorkoutHistoryPdf({ 
        userId: userId, 
        categoryId: null, 
        fromDate: null, 
        toDate: null 
      });
      
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Raporti_EliteFit_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Dështoi shkarkimi i PDF-së:", err);
      alert("Ndodhi një gabim gjatë shkarkimit. Sigurohu që ke të dhëna për të eksportuar.");
    } finally {
      setPdfLoading(false);
    }
  };

  // Menaxhimi i shkarkimit të skedarit Excel
// Menaxhimi i shkarkimit të skedarit Excel
const handleDownloadExcel = async () => {
  try {
    setExcelLoading(true)
    
    // 1. MERR ID-NË E PËRDORUESIT NGA TOKEN-I (Kjo mungonte!)
    const userId = getUserIdFromToken(); 
    console.log("ID e nxjerrë për Excel është:", userId);

    // 2. SHTO userId TE PARAMETRAT (Kjo mungonte dhe shkaktonte error 400)
    const data = await exportWorkoutHistoryExcel({ 
      userId: userId, // <--- SHTO KËTË RRESHT
      categoryId: null, 
      fromDate: null, 
      toDate: null 
    })
    
    // data është direkt Blobi sepse axiosClient e filtron me interceptor
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Raporti_EliteFit_${new Date().toISOString().split('T')[0]}.xlsx`)
    
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error("Dështoi shkarkimi i Excel-it:", err)
    alert("Ndodhi një gabim gjatë shkarkimit të Excel-it.")
  } finally {
    setExcelLoading(false)
  }
}
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-2">
        <Loader2 className="animate-spin text-[#0ea5e9]" size={32} />
        <p className="text-sm text-dark/40 font-medium">Duke sinkronizuar profilin tënd...</p>
      </div>
    )
  }

  const chartData = calorieData?.weeklyOverview || []

  return (
    <div className="p-4 md:p-10 bg-surface/30 min-h-screen">
      {/* Headeri i Mirëseardhjes + Butonat e Shkarkimit */}
      <header className="mb-8 mt-12 md:mt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-dark">
            Përshëndetje, {user?.fullName?.split(' ')[0] || user?.FullName?.split(' ')[0] || 'Member'}! 👋
          </h1>
          <p className="text-dark/60 mt-1">Gati për t'i thyer limitet sot?</p>
        </div>

        {/* Aksionet e Eksportit nga ReportsController */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl text-sm font-semibold border border-red-200/40 transition-all disabled:opacity-50"
          >
            {pdfLoading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
            Eksporto PDF
          </button>
          <button 
            onClick={handleDownloadExcel}
            disabled={excelLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-2xl text-sm font-semibold border border-green-200/40 transition-all disabled:opacity-50"
          >
            {excelLoading ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
            Eksporto Excel
          </button>
        </div>
      </header>

      {/* Grid i Kartave të Progresit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <UserStatCard 
          title="Calories Target" 
          value={calorieData?.dailyTargetCalories?.toLocaleString() || calorieData?.dailyCalorieTarget?.toLocaleString() || "0"} 
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
          value={streakInfo?.currentStreak || calorieData?.currentStreak || "0"} 
          unit="ditë rresht"
          icon={Trophy} 
          change={(streakInfo?.currentStreak || calorieData?.currentStreak) > 0 ? "Aktive! 🔥" : "-"} 
          color="text-yellow-600" 
          bgColor="bg-yellow-50" 
        />
      </div>

      {/* Seksioni i Grafikut dhe Këshillave të Shpejta */}
     

      {/* Seksioni i Medaljeve (Badges Component) */}
      <div className="w-full bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Medal size={22} className="text-yellow-600" />
          <div>
            <h3 className="font-heading font-bold text-dark text-lg">Medaljet e Mia (Badges)</h3>
            <p className="text-xs text-dark/50">Arritjet tuaja gjatë rrugëtimit në EliteFit</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, idx) => (
            <motion.div
              key={badge.id || idx}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-white to-surface border border-black/5 flex items-center gap-3"
            >
              <div className="p-3 rounded-xl bg-yellow-50 text-yellow-600">
                <Trophy size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-dark">{badge.name || badge.Name}</h4>
                <p className="text-[11px] text-dark/50 mt-0.5">{badge.description || badge.Description}</p>
              </div>
            </motion.div>
          ))}
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