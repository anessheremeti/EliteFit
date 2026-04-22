/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { Smartphone, BellRing, Apple, PlayCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const MobileAppComingSoon = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex flex-col pt-32">
        <main className="flex-grow flex items-center">
          <div className="max-w-7xl mx-auto px-6 py-20 w-full relative">
            
            {/* Dekorime Sfondi */}
            <div className="absolute top-0 right-10 w-96 h-96 bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-brand-accent/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Pjesa e Tekstit */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8 text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest mx-auto lg:mx-0">
                  <Smartphone size={14} /> Përvojë Elitë në Xhepin Tuaj
                </div>
                
                <h1 className="text-6xl md:text-8xl font-display font-bold text-brand-dark tracking-tighter leading-[0.9]">
                  COOMING <span className="text-brand-primary italic">SOON</span>
                </h1>
                
                <p className="text-lg text-brand-dark/50 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                  Ne po ndërtojmë trajnerin tuaj personal inteligjent. Fitnesi elitë, i personalizuar dhe i aksesueshëm kudo, së shpejti në pajisjen tuaj mobile.
                </p>

                {/* Butonat e Store-ve (Disabled) */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6 opacity-60">
                  <div className="flex items-center gap-3 bg-brand-dark text-white px-6 py-3 rounded-2xl cursor-not-allowed border border-white/10 w-full sm:w-auto justify-center">
                    <Apple size={24} className="text-white/70" />
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-[10px] text-white/50 uppercase tracking-wider">Shkarko në</span>
                      <span className="font-bold text-base">App Store</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-brand-dark text-white px-6 py-3 rounded-2xl cursor-not-allowed border border-white/10 w-full sm:w-auto justify-center">
                    <PlayCircle size={24} className="text-white/70" />
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-[10px] text-white/50 uppercase tracking-wider">Shkarko në</span>
                      <span className="font-bold text-base">Google Play</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Pjesa e Ilustrimit/Mokup-it */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
                className="relative flex justify-center items-center h-full"
              >
                {/* Mokup i thjeshtë i telefonit */}
                <div className="relative w-[300px] h-[600px] bg-brand-dark rounded-[3rem] border-[14px] border-brand-dark shadow-2xl overflow-hidden p-1 flex flex-col">
                  {/* Notch-i */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-brand-dark rounded-b-xl z-20" />
                  
                  {/* Sfondi brenda telefonit */}
                  <div className="flex-grow bg-white rounded-[2.5rem] relative p-6 pt-10 flex flex-col items-center justify-center text-center">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.6, delay: 1, repeat: Infinity, repeatDelay: 5 }}
                      className="w-16 h-16 bg-brand-primary/10 rounded-3xl flex items-center justify-center text-brand-primary mb-6"
                    >
                      <BellRing size={32} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-brand-dark mb-3">EliteFit Pro</h3>
                    <p className="text-brand-dark/50 text-xs font-sans">
                      Aplikacioni juaj po finalizohet.
                    </p>
                    {/* Progress Bar e thjeshtë */}
                    <div className="w-full h-1.5 bg-brand-surface rounded-full mt-6 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '85%' }}
                            transition={{ duration: 2, delay: 0.5 }}
                            className="h-full bg-brand-primary rounded-full"
                        />
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default MobileAppComingSoon;