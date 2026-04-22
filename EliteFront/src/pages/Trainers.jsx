/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
// Përdorim vetëm ikona bazë që nuk ndryshojnë emrat
import { Star, Globe, Mail, Link2 } from "lucide-react";
import { Section } from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const Trainers = () => {
  const individualTrainers = [
    {
      name: "John Doe",
      role: "Head of Strength",
      bio: "Specializing in high-performance conditioning and professional athlete preparation.",
      specialty: "Strength",
      image: "1"
    },
    {
      name: "Jane Smith",
      role: "Yoga & Recovery",
      bio: "Focusing on mobility, mindfulness, and long-term injury prevention strategies.",
      specialty: "Mobility",
      image: "2"
    },
    {
      name: "Michael Vance",
      role: "HIIT Specialist",
      bio: "Expert in metabolic conditioning and efficient fat loss through interval training.",
      specialty: "Fat Loss",
      image: "3"
    },
    {
      name: "Sarah Miller",
      role: "Performance Nutrition",
      bio: "Combining sports science with practical nutrition for peak physical output.",
      specialty: "Nutrition",
      image: "4"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-32">
        
        {/* Header i Thjeshtë */}
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-brand-border text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            <Star className="w-3 h-3 fill-current" /> Expert Faculty
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-brand-dark tracking-tight mb-4">
            Meet Our Trainers
          </h1>
          <p className="text-brand-dark/50 text-lg max-w-2xl mx-auto">
            Our team of world-class professionals is dedicated to your transformation.
          </p>
        </div>

        {/* Grid i Trajnerëve */}
        <Section className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {individualTrainers.map((trainer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Foto Profili */}
                <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-brand-primary/10 group-hover:border-brand-primary transition-colors duration-500" />
                  <div className="absolute inset-2 rounded-full overflow-hidden bg-brand-surface">
                    <img 
                      src={`https://i.pravatar.cc/300?img=${trainer.image}`} 
                      alt={trainer.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/5 px-2 py-1 rounded">
                    {trainer.specialty}
                  </span>
                  <h3 className="text-2xl font-bold text-brand-dark">
                    {trainer.name}
                  </h3>
                  <p className="text-brand-primary font-medium text-sm">
                    {trainer.role}
                  </p>
                  <p className="text-brand-dark/50 text-sm leading-relaxed max-w-[240px]">
                    {trainer.bio}
                  </p>
                </div>

                {/* Ikonat e reja që nuk bëjnë error */}
                <div className="flex items-center gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Globe className="w-4 h-4 text-brand-dark/40 hover:text-brand-primary cursor-pointer" />
                  <Mail className="w-4 h-4 text-brand-dark/40 hover:text-brand-primary cursor-pointer" />
                  <Link2 className="w-4 h-4 text-brand-dark/40 hover:text-brand-primary cursor-pointer" />
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      </div>
      <Footer />
    </>
  );
};

export default Trainers;