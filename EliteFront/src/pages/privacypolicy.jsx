/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { ShieldCheck, Eye, Lock, Database, UserCheck, FileText } from "lucide-react";
import { Section } from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const PrivacyPolicy = () => {
  const lastUpdated = "22 Prill, 2026";

  const sections = [
    {
      icon: Eye,
      title: "Çfarë të dhënash mbledhim?",
      content: "Ne mbledhim informacionin që ju jepni kur krijoni një llogari, si emrin tuaj, adresën e emailit dhe të dhënat bazë të fitnesit (mosha, pesha, lartësia) për të personalizuar planet tuaja të stërvitjes."
    },
    {
      icon: Database,
      title: "Si i përdorim të dhënat tuaja?",
      content: "Të dhënat tuaja përdoren ekskluzivisht për të përmirësuar përvojën tuaj në aplikacion, për të gjeneruar raporte progresi dhe për t'ju dërguar njoftime të rëndësishme rreth llogarisë suaj."
    },
    {
      icon: Lock,
      title: "Mbrojtja e informacionit",
      content: "Ne përdorim enkriptim të nivelit bankar (SSL) për të siguruar që të dhënat tuaja të mbeten private. Asnjë informacion personal nuk u shitet apo ndahet me palë të treta për qëllime marketingu."
    },
    {
      icon: UserCheck,
      title: "Të drejtat tuaja",
      content: "Ju keni të drejtë të kërkoni një kopje të të dhënave tuaja, t'i korrigjoni ato ose të kërkoni fshirjen e plotë të llogarisë dhe të gjithë informacionit të ndërlidhur në çdo kohë."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-32">
        
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            <ShieldCheck size={14} /> Siguria juaj është prioritet
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-dark tracking-tighter">
            Politika e <span className="text-brand-primary italic">Privatësisë.</span>
          </h1>
          <p className="text-brand-dark/50 text-sm mt-4 font-sans">
            Përditësuar së fundmi: <span className="font-bold text-brand-dark">{lastUpdated}</span>
          </p>
        </div>

        <Section className="pt-0">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Sidebar / Quick Links */}
            <div className="lg:col-span-1 space-y-4 h-fit lg:sticky lg:top-32">
              <div className="p-8 bg-brand-surface rounded-[2.5rem] border border-brand-border">
                <h3 className="font-display font-bold text-brand-dark mb-6 flex items-center gap-2">
                  <FileText size={18} className="text-brand-primary" /> Përmbledhja
                </h3>
                <nav className="space-y-4">
                  {sections.map((s, i) => (
                    <a 
                      key={i} 
                      href={`#section-${i}`}
                      className="block text-sm font-sans text-brand-dark/50 hover:text-brand-primary transition-colors font-medium"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content Side */}
            <div className="lg:col-span-2 space-y-16">
              {sections.map((section, index) => (
                <motion.div 
                  key={index}
                  id={`section-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                      <section.icon size={24} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-brand-dark">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-brand-dark/60 text-lg leading-relaxed font-sans">
                    {section.content}
                  </p>
                  <div className="h-[1px] w-full bg-brand-border" />
                </motion.div>
              ))}

              {/* Extra Legal Text */}
              <div className="p-8 bg-brand-dark rounded-[3rem] text-white/50 text-sm leading-relaxed font-sans">
                <p>
                  Duke përdorur EliteFit Pro, ju pranoni kushtet e përshkruara në këtë dokument. Nëse kemi ndryshime të rëndësishme në mënyrën se si i trajtojmë të dhënat tuaja, ne do t'ju njoftojmë përmes emailit ose një njoftimi brenda aplikacionit. Për çdo pyetje rreth privatësisë, mund të na kontaktoni në <span className="text-brand-primary font-bold">privacy@elitefitpro.com</span>.
                </p>
              </div>
            </div>

          </div>
        </Section>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;