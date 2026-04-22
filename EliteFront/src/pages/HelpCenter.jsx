/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { Search, Book, CreditCard, User, ShieldCheck, MessageCircle, ArrowRight } from "lucide-react";
import { Section } from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const HelpCenter = () => {
  const categories = [
    {
      icon: User,
      title: "Llogaria Ime",
      desc: "Menaxhoni profilin, fjalëkalimin dhe të dhënat tuaja personale.",
    },
    {
      icon: CreditCard,
      title: "Pagesat & Abonimet",
      desc: "Informacione mbi planet PRO, faturat dhe metodat e pagesës.",
    },
    {
      icon: Book,
      title: "Udhëzuesit e Trajnimit",
      desc: "Si të përdorni planet tona dhe të ndiqni progresin tuaj.",
    },
    {
      icon: ShieldCheck,
      title: "Privatësia & Siguria",
      desc: "Si i mbrojmë ne të dhënat tuaja dhe politikat tona të sigurisë.",
    }
  ];

  const faqs = [
    {
      q: "Si mund ta anuloj pajtimin tim PRO?",
      a: "Ju mund ta anuloni pajtimin tuaj në çdo kohë përmes cilësimeve të llogarisë në seksionin 'Billing'. Qasja juaj do të mbetet aktive deri në fund të ciklit aktual të faturimit."
    },
    {
      q: "A mund të përdor EliteFit në shumë pajisje?",
      a: "Po! Llogaria juaj EliteFit sinkronizohet automatikisht në të gjitha pajisjet ku jeni i kyçur, përfshirë uebin dhe aplikacionin mobil."
    },
    {
      q: "Çfarë ndodh nëse harroj fjalëkalimin?",
      a: "Klikoni te 'Forgot Password' në faqen e kyçjes dhe ne do t'ju dërgojmë një link për rivendosjen e fjalëkalimit në emailin tuaj të regjistruar."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-32">
        
        {/* Hero Search Section */}
        <div className="bg-brand-surface border-b border-brand-border py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-display font-bold text-brand-dark mb-8"
            >
              Si mund t'ju <span className="text-brand-primary italic">ndihmojmë?</span>
            </motion.h1>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-dark/30" size={20} />
              <input 
                type="text" 
                placeholder="Kërko për artikuj, udhëzues ose pyetje..." 
                className="w-full pl-14 pr-6 py-5 rounded-2xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white shadow-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Support Categories */}
        <Section>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 bg-white border border-brand-border rounded-[2rem] hover:border-brand-primary transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 bg-brand-surface rounded-xl flex items-center justify-center text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <cat.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-brand-dark mb-2">{cat.title}</h3>
                <p className="text-sm text-brand-dark/50 leading-relaxed font-sans">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Popular FAQs */}
        <Section className="pt-0">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-brand-dark mb-10 text-center">Pyetjet më të Shpeshta</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="p-6 bg-brand-surface rounded-2xl border border-brand-border">
                  <h4 className="font-bold text-brand-dark mb-2">{faq.q}</h4>
                  <p className="text-sm text-brand-dark/60 font-sans leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Contact Support CTA */}
        <Section>
          <div className="bg-brand-dark rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden">
            <div className="relative z-10">
              <MessageCircle className="w-12 h-12 text-brand-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Akoma keni nevojë për ndihmë?</h2>
              <p className="text-white/50 mb-10 font-sans">Ekipi ynë i mbështetjes është në dispozicion 24/7 për t'ju ndihmuar me çdo gjë.</p>
              <button className="px-10 py-4 bg-brand-primary text-white font-bold rounded-full inline-flex items-center gap-3 hover:scale-105 transition-transform">
                Na Kontaktoni <ArrowRight size={18} />
              </button>
            </div>
            {/* Background Shape */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full" />
          </div>
        </Section>

      </div>
      <Footer />
    </>
  );
};

export default HelpCenter;