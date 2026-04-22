/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { Heart, Rocket, Users, Briefcase, Quote, ArrowRight } from "lucide-react";
import { Section } from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const Careers = () => {
  const stats = [
    { label: "Përdorues Aktivë", value: "50k+" },
    { label: "Trajnerë Elitë", value: "200+" },
    { label: "Jetë të Ndryshuara", value: "10k+" },
    { label: "Vendi i Punës", value: "Remote" },
  ];

  const testimonials = [
    {
      name: "Arben Meta",
      role: "Lead Software Engineer",
      content: "Të shohësh kodin tënd duke u shndërruar në një mjet që ndihmon dikë të rimarrë kontrollin e shëndetit të tij është ndjenja më e mirë profesionale që kam pasur.",
      image: "https://i.pravatar.cc/150?img=11"
    },
    {
      name: "Elisa Dritë",
      role: "Product Designer",
      content: "Në EliteFit, ne nuk dizajnojmë thjesht butona; ne dizajnojmë rrugëtimin e dikujt drejt vetëbesimit. Çdo pixel ka një qëllim human.",
      image: "https://i.pravatar.cc/150?img=5"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-32">
        
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mx-auto mb-8"
          >
            <Rocket size={32} />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-dark tracking-tighter mb-6">
            Puno për diçka <br /> <span className="text-brand-primary italic">që ka rëndësi.</span>
          </h1>
          <p className="text-brand-dark/50 text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Bashkohu me ekipin që po riformëson industrinë e fitnesit. Ne nuk ndërtojmë thjesht një aplikacion, ne ndërtojmë të ardhmen e mirëqenies njerëzore.
          </p>
        </div>

        {/* Stats Grid */}
        <Section className="bg-brand-surface border-y border-brand-border">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="text-4xl font-display font-bold text-brand-dark">{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-widest text-brand-primary">{stat.label}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Impact Section - Si ka ndikuar te njerëzit */}
        <Section>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-display font-bold text-brand-dark">Impakti Jonë Real</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex-shrink-0 flex items-center justify-center text-red-500">
                    <Heart fill="currentColor" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Shëndeti Mendor</h4>
                    <p className="text-sm text-brand-dark/50 font-sans">Mbi 70% e përdoruesve tanë raportojnë ulje të stresit pas muajit të parë.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex-shrink-0 flex items-center justify-center text-blue-500">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">Komuniteti</h4>
                    <p className="text-sm text-brand-dark/50 font-sans">Kemi krijuar lidhje mes mijëra njerëzve që motivojnë njëri-tjetrin çdo ditë.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonials te punonjesve */}
            <div className="bg-brand-dark rounded-[3rem] p-10 space-y-10 relative overflow-hidden">
              <Quote className="absolute top-10 right-10 text-white/5 w-20 h-20" />
              {testimonials.map((t, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="relative z-10 space-y-4"
                >
                  <p className="text-white/80 italic font-sans leading-relaxed">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <img src={t.image} className="w-10 h-10 rounded-full border border-white/20" alt={t.name} />
                    <div>
                      <div className="text-white font-bold text-sm">{t.name}</div>
                      <div className="text-brand-primary text-[10px] uppercase font-bold">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Call to Action */}
        <Section className="pb-32">
          <div className="bg-brand-primary rounded-[4rem] p-12 md:p-20 text-center text-white relative overflow-hidden group">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-24 -right-24 w-64 h-64 border-8 border-white/10 rounded-full" 
            />
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 relative z-10">
              Gati për të bërë <br /> ndryshimin?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-10 font-sans text-lg">
              Ne jemi gjithmonë në kërkim të inxhinierëve, dizajnerëve dhe trajnerëve që duan të lënë gjurmë.
            </p>
            <button className="bg-white text-brand-primary px-10 py-5 rounded-full font-bold inline-flex items-center gap-3 hover:bg-brand-dark hover:text-white transition-all shadow-xl">
              Shih Pozicionet e Hapura <ArrowRight size={20} />
            </button>
          </div>
        </Section>

      </div>
      <Footer />
    </>
  );
};

export default Careers;