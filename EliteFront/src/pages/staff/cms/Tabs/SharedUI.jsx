import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle } from 'lucide-react'

export function TabButton({ id, label, icon: Icon, active, setActive }) {
  return (
    <button onClick={() => setActive(id)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
        active === id ? 'bg-[#0ea5e9] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}>
      <Icon size={16} />{label}
    </button>
  )
}

export function FieldLabel({ children }) {
  return <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">{children}</label>
}

export function FieldInput({ ...props }) {
  return (
    <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0ea5e9] focus:bg-white transition-all font-medium" {...props} />
  )
}

export function ErrorBanner({ msg, onRetry }) {
  return (
    <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
      <AlertCircle size={15} className="shrink-0" />{msg}
      {onRetry && <button onClick={onRetry} className="ml-auto text-xs font-bold hover:underline">Retry</button>}
    </div>
  )
}

// ModalWrapper ri-përdor dizajnin dhe animacionin e modalit për çdo Tab
export function ModalWrapper({ isOpen, onClose, title, error, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}>
          <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
            className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100"
            onClick={e => e.stopPropagation()}>

            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading font-bold text-slate-900 text-lg">{title}</h3>
              <button onClick={onClose}
                className="p-1.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs">
                <AlertCircle size={14} className="shrink-0" />{error}
              </div>
            )}

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}