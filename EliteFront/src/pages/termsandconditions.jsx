/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { 
  Gavel, 
  Scale, 
  Ban, 
  CreditCard, 
  Copyright, 
  AlertTriangle, 
  FileCheck, 
  UserCheck 
} from "lucide-react";
import { Section } from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const TermsConditions = () => {
  const lastUpdated = "22 Prill, 2026";

  const terms = [
    {
      icon: UserCheck,
      title: "1. Pranimi i Kushteve",
      content: "Duke krijuar një llogari në EliteFit Pro, ju pranoni të jeni të lidhur ligjërisht nga këto kushte. Nëse nuk pajtoheni me ndonjë pjesë të tyre, ju lutemi mos e përdorni platformën."
    },
    {
      icon: CreditCard,
      title: "2. Abonimet dhe Pagesat",
      content: "Planet tona PRO faturuhen në baza mujore ose vjetore. Anulimet mund të bëhen në çdo kohë, por rimbursimet për periudhat e papërdorura nuk ofrohen, përveç rasteve kur kërkohet me ligj."
    },
    {
      icon: Copyright,
      title: "3. Pronësia Intelektuale",
      content: "Të gjitha planet e stërvitjes, videot, dizajni dhe kodi i aplikacionit janë pronë ekskluzive e EliteFit Pro. Ndalohet rreptësisht riprodhimi apo shpërndarja e tyre pa leje paraprake."
    },
    {
      icon: Ban,
      title: "4. Sjellja e Ndaluar",
      content: "Përdoruesit nuk lejohen të ngarkojnë përmbajtje fyese në komunitet, të përdorin skripte automatike për të mbledhur të dhëna, apo të tentojnë të thyejnë sigurinë e sistemit tonë."
    },
    {
      icon: AlertTriangle,
      title: "5. Limiti i Përgjegjësisë",
      content: "EliteFit Pro nuk mban përgjegjësi për lëndimet fizike që mund të ndodhin gjatë stërvitjes. Ju rekomandojmë të konsultoheni me një mjek para se të filloni çdo program të ri intensiv."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-32">
        
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-brand-border pb-12">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-dark text-white text-[10px] font-bold uppercase tracking-widest mb-6"
              >
                <Gavel size={14} /> Marrëveshja Ligjore
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-dark tracking-tighter">
                Kushtet e <span className="text-brand-primary italic">Përdorimit.</span>
              </h1>
            </div>
            <div className="text-brand-dark/40 text-sm font-sans">
              Versioni 2.4 — Përditësuar: <span className="font-bold">{lastUpdated}</span>
            </div>
          </div>
        </div>

        <Section className="pt-0">
          <div className="max-w-4xl mx-auto">
            
            {/* Intro Note */}
            <div className="p-8 bg-brand-surface rounded-[2.5rem] border border-brand-border mb-16 flex items-start gap-6">
                <Scale className="text-brand-primary shrink-0" size={32} />
                <p className="text-brand-dark/60 italic font-sans leading-relaxed">
                  "Ju lutemi lexoni me kujdes këto kushte. Ato përmbajnë informacione të rëndësishme mbi të drejtat tuaja, detyrimet dhe mbrojtjen ligjore që ofron EliteFit Pro."
                </p>
            </div>

            {/* Terms List */}
            <div className="space-y-12">
              {terms.map((term, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-white border border-brand-border rounded-2xl flex items-center justify-center text-brand-dark group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all duration-300 shrink-0">
                      <term.icon size={22} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-display font-bold text-brand-dark">{term.title}</h3>
                      <p className="text-brand-dark/50 leading-relaxed font-sans text-lg">
                        {term.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Final Confirmation */}
            <div className="mt-20 p-12 bg-brand-dark rounded-[3rem] text-center space-y-6">
              <FileCheck size={48} className="text-brand-primary mx-auto" />
              <h4 className="text-2xl font-display font-bold text-white">Pyetje rreth kushteve?</h4>
              <p className="text-white/40 font-sans max-w-md mx-auto">
                Nëse keni nevojë për sqarime shtesë mbi pikat e mësipërme, mos hezitoni të kontaktoni ekipin tonë ligjor.
              </p>
              <button className="px-8 py-4 bg-brand-primary text-white font-bold rounded-full hover:scale-105 transition-transform">
                Na Kontaktoni
              </button>
            </div>
          </div>
        </Section>
      </div>
      <Footer />
    </>
  );
};

export default TermsConditions;