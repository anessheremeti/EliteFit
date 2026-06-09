import React from 'react'

export default function TabButton({ id, label, icon: Icon, active, setActive }) {
  return (
    <button 
      onClick={() => setActive(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
        active === id 
          ? 'bg-[#0ea5e9] text-white shadow-md shadow-sky/10' 
          : 'text-dark/60 hover:bg-surface hover:text-dark'
      }`}
    >
      <Icon size={16} />{label}
    </button>
  )
}