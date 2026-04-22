/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { Dumbbell, Zap, Heart, StretchHorizontal, Timer } from "lucide-react";
import { Section } from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const Workouts = () => {
  const workoutTypes = [
    {
      id: 1,
      title: "Bodybuilding & Strength",
      desc: "Fokusuar në hipertrofinë muskulare dhe rritjen e forcës përmes peshave të rënda dhe progresit sistematik.",
      icon: Dumbbell,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
      features: ["Hipertrofi", "Forcë Maksimale", "Powerlifting"]
    },
    {
      id: 2,
      title: "HIIT & Cardio Burn",
      desc: "Ushtrime me intensitet të lartë që djegin kalori në kohë rekord dhe përmirësojnë shëndetin kardiovaskular.",
      icon: Zap,
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
      features: ["Djegie Dhjami", "Endurance", "Agility"]
    },
    {
      id: 3,
      title: "Yoga & Flexibility",
      desc: "Përmirësoni lëvizshmërinë, ekuilibrin dhe qetësinë mendore përmes teknikave të avancuara të vinyasa dhe stretching.",
      icon: StretchHorizontal,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop",
      features: ["Mobility", "Balance", "Recovery"]
    },
    {
      id: 4,
      title: "Functional Training",
      desc: "Lëvizje që përgatitin trupin tuaj për aktivitetet e përditshme, duke forcuar bërthamën (core) dhe stabilitetin.",
      icon: Heart,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop",
      features: ["Core Strength", "Stability", "Longevity"]
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-32">
        
        {/* Intro Header */}
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-brand-dark tracking-tight mb-6"
          >
            DISIPLINAT <span className="text-brand-primary">TONA.</span>
          </motion.h1>
          <p className="text-brand-dark/50 text-lg max-w-2xl mx-auto font-sans">
            Zgjidhni stilin e trajnimit që i përshtatet qëllimeve tuaja. Nga forca tek fleksibiliteti, ne mbulojmë çdo aspekt të performancës njerëzore.
          </p>
        </div>

        {/* Workout Types List */}
        <Section className="pt-0">
          <div className="grid grid-cols-1 gap-24">
            {workoutTypes.map((type, i) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={`flex flex-col lg:items-center gap-12 ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Image Part */}
                <div className="flex-1 w-full">
                  <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden shadow-xl border border-brand-border bg-brand-surface">
                    <img 
                      src={type.image} 
                      alt={type.title}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Text Part */}
                <div className="flex-1 space-y-6">
                  <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary">
                    <type.icon size={28} />
                  </div>
                  <h2 className="text-4xl font-display font-bold text-brand-dark">
                    {type.title}
                  </h2>
                  <p className="text-brand-dark/60 text-lg leading-relaxed max-w-xl font-sans">
                    {type.desc}
                  </p>
                  
                  {/* Features Tags */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    {type.features.map((feature) => (
                      <span 
                        key={feature}
                        className="px-4 py-2 bg-brand-surface border border-brand-border rounded-full text-[10px] font-bold text-brand-dark/70 uppercase tracking-widest"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Simple Info Section */}
        <Section className="bg-brand-dark text-white text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <Timer className="w-12 h-12 text-brand-primary mx-auto" />
            <h2 className="text-3xl md:text-5xl font-display font-bold">Planifikim me Precision.</h2>
            <p className="text-white/50 text-lg font-sans">
              Secila prej këtyre disiplinave vjen me një plan dritësor të personalizuar, duke siguruar që asnjë minutë e stërvitjes suaj të mos shkojë dëm.
            </p>
          </div>
        </Section>

      </div>
      <Footer />
    </>
  );
};

export default Workouts;