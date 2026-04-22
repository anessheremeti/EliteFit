/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { Users2, Trophy, Flame, Heart, Zap, MessageCircle, Star } from "lucide-react";
import { Section } from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const Community = () => {
  const communityValues = [
    {
      icon: Heart,
      title: "Mbështetje Radikale",
      desc: "Këtu nuk ka gjykime. Secili fillon nga një pikë e ndryshme, por të gjithë motivojmë njëri-tjetrin drejt finishit."
    },
    {
      icon: Trophy,
      title: "Përgjegjshmëri Kolektive",
      desc: "Kur ti dështon të zgjohesh, komuniteti është ai që të shtyn përpara. Sfidat tona bëhen më të lehta kur ndahen."
    },
    {
      icon: Zap,
      title: "Gara e Shëndetshme",
      desc: "Ne sfidojmë veten dhe shokët tanë. Tabelat e liderëve tanë nuk janë për t'u mburrur, por për të frymëzuar."
    }
  ];

  const highlights = [
    {
      title: "Sfidat e Grupit",
      count: "12+ Sfidat Aktive",
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-50"
    },
    {
      title: "Anëtarë Globalë",
      count: "25,000+",
      icon: Users2,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Histori Suksesi",
      count: "5,000+ Transformime",
      icon: Star,
      color: "text-yellow-500",
      bg: "bg-yellow-50"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-32">
        
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Users2 size={16} /> Më shumë se një aplikacion
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-display font-bold text-brand-dark tracking-tighter mb-8 leading-[0.9]">
            FUQIA E <br /> <span className="text-brand-primary italic">BASHKËPUNIMIT.</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-dark/50 max-w-2xl mx-auto font-sans leading-relaxed">
            EliteFit Community nuk është thjesht një grup njerëzish që stërviten. Është një ekosistem vlerash ku suksesi i njërit është motivim për të gjithë.
          </p>
        </div>

        {/* Community Highlights */}
        <Section className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${item.bg} p-8 rounded-[2.5rem] border border-black/5 flex flex-col items-center text-center group hover:scale-[1.02] transition-transform`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center ${item.color} shadow-sm mb-6`}>
                  <item.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-brand-dark mb-1">{item.count}</h3>
                <p className="text-brand-dark/40 font-bold uppercase text-[10px] tracking-widest">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Our Values - Vlerat e Komunitetit */}
        <Section className="bg-brand-dark text-white rounded-[4rem] mx-4 md:mx-8 my-20">
          <div className="grid lg:grid-cols-2 gap-20 items-center px-4 md:px-12 py-20">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                Vlerat që na <br /> <span className="text-brand-primary">mbajnë bashkë.</span>
              </h2>
              <p className="text-white/50 text-lg font-sans">
                Ne besojmë se teknologjia duhet t'i afrojë njerëzit, jo t'i izolojë ata. Komuniteti jonë bazohet në tre shtylla kryesore.
              </p>
              <button className="px-8 py-4 bg-brand-primary text-white font-bold rounded-full inline-flex items-center gap-3 hover:bg-white hover:text-brand-primary transition-all">
                Bashkohu në Discord <MessageCircle size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              {communityValues.map((value, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm"
                >
                  <div className="flex gap-6">
                    <div className="text-brand-primary">
                      <value.icon size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{value.title}</h4>
                      <p className="text-white/40 text-sm leading-relaxed font-sans">{value.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Global Challenge Teaser */}
        <Section>
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-display font-bold text-brand-dark tracking-tight">Sfidat e Radhës</h2>
              <p className="text-brand-dark/50 max-w-xl mx-auto font-sans">
                Mos u stërvit vetëm. Bashkohu me mijëra të tjerë në sfidat tona mujore dhe fito shpërblime ekskluzive.
              </p>
            </div>
            
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-brand-primary rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative bg-white border border-brand-border rounded-[3rem] p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-left space-y-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full uppercase tracking-widest">Live Now</span>
                  <h3 className="text-3xl font-bold text-brand-dark italic">"The Iron Rebirth"</h3>
                  <p className="text-brand-dark/40 font-sans">Sfidë 4-javore për forcë dhe disiplinë mentale.</p>
                </div>
                <div className="flex -space-x-4">
                  {[1,2,3,4,5].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-12 h-12 rounded-full border-4 border-white" alt="user" />
                  ))}
                  <div className="w-12 h-12 rounded-full bg-brand-surface border-4 border-white flex items-center justify-center text-[10px] font-bold text-brand-dark">
                    +1k
                  </div>
                </div>
                <button className="px-10 py-5 bg-brand-dark text-white font-bold rounded-full hover:bg-brand-primary transition-all">
                  Merr Pjesë
                </button>
              </div>
            </div>
          </div>
        </Section>

      </div>
      <Footer />
    </>
  );
};

export default Community;