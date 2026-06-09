import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlaySquare, UtensilsCrossed, LayoutList, Award, Plus } from 'lucide-react'

// Importojmë Komponentët
import { TabButton } from './Tabs/SharedUI'
import WorkoutsTab from './Tabs/WorkoutsTab'
import RecipesTab from './Tabs/RecipesTab'
import CategoriesTab from './Tabs/CategoriesTab'
import BadgesTab from './Tabs/BadgesTab'

export default function ContentManagementDashboard() {
  const [activeTab, setActiveTab] = useState('workouts')
  
  // Mban ID e modalit të hapur (p.sh. 'workout', 'recipe', etj.)
  const [activeModal, setActiveModal] = useState(null)

  // Funksioni që thërret butoni "Krijo të re" nga koka e faqes
  const openModalForActiveTab = () => {
    if (activeTab === 'workouts')   setActiveModal('workout')
    if (activeTab === 'recipes')    setActiveModal('recipe')
    if (activeTab === 'categories') setActiveModal('category')
    if (activeTab === 'badges')     setActiveModal('badge')
  }

  return (
    <div className="p-4 md:p-10 bg-[#f8fafc]/30 min-h-screen relative">
      <header className="mb-8 mt-12 md:mt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Content Management </h1>
          <p className="text-slate-500 mt-1">Menaxhoni videot, recetat, kategoritë dhe medaljet e platformës.</p>
        </div>
        <button onClick={openModalForActiveTab}
          className="flex items-center justify-center gap-2 bg-[#0ea5e9] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#0284c7] transition-all shadow-lg shadow-sky-500/20 cursor-pointer">
          <Plus size={20} /> Krijo të re
        </button>
      </header>

      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-black/5 shadow-sm max-w-max">
        <TabButton id="workouts"   label="Workout Manager"  icon={PlaySquare}      active={activeTab} setActive={setActiveTab} />
        <TabButton id="recipes"    label="Recipe Manager"   icon={UtensilsCrossed} active={activeTab} setActive={setActiveTab} />
        <TabButton id="categories" label="Categories & Goals" icon={LayoutList}      active={activeTab} setActive={setActiveTab} />
        <TabButton id="badges"     label="Badge Creator"    icon={Award}           active={activeTab} setActive={setActiveTab} />
      </div>

      <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm min-h-125">
        <AnimatePresence mode="wait">
          {activeTab === 'workouts' && (
            <motion.div key="workouts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <WorkoutsTab 
                isModalOpen={activeModal === 'workout'} 
                onClose={() => setActiveModal(null)} 
                onOpenModal={() => setActiveModal('workout')} 
              />
            </motion.div>
          )}

          {activeTab === 'recipes' && (
            <motion.div key="recipes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <RecipesTab 
                isModalOpen={activeModal === 'recipe'} 
                onClose={() => setActiveModal(null)} 
                onOpenModal={() => setActiveModal('recipe')} 
              />
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div key="categories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <CategoriesTab 
                isModalOpen={activeModal === 'category'} 
                onClose={() => setActiveModal(null)} 
                onOpenModal={() => setActiveModal('category')} 
              />
            </motion.div>
          )}

          {activeTab === 'badges' && (
            <motion.div key="badges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <BadgesTab 
                isModalOpen={activeModal === 'badge'} 
                onClose={() => setActiveModal(null)} 
                onOpenModal={() => setActiveModal('badge')} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}