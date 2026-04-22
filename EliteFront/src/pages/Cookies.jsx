import { motion } from "framer-motion";
import { Cookie, ShieldCheck, Eye, MousePointer2, Settings } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Cookies = () => {
  const sections = [
    {
      icon: Cookie,
      title: "Çfarë janë Cookies?",
      content: "Cookies janë skedarë të vegjël teksti që ruhen në pajisjen tuaj kur vizitoni faqen tonë. Ato na ndihmojnë të identifikojmë pajisjen tuaj dhe të përmirësojmë përvojën tuaj të përdorimit."
    },
    {
      icon: Eye,
      title: "Si i përdorim ato?",
      content: "Ne përdorim cookies për të mbajtur mend preferencat tuaja, për të analizuar trafikun e faqes dhe për të ofruar reklama që përshtaten me interesat tuaja."
    },
    {
      icon: Settings,
      title: "Menaxhimi i Cookies",
      content: "Ju mund të kontrolloni dhe menaxhoni cookies përmes cilësimeve të shfletuesit tuaj. Kini parasysh se heqja e tyre mund të ndikojë në funksionalitetin e platformës."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-32">
        <div className="max-w-4xl mx-auto px-6 pb-20">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-brand-border text-brand-primary text-xs font-bold uppercase tracking-widest mb-6">
              <ShieldCheck size={14} /> Privatësia juaj
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-brand-dark mb-6">
              Politika e <span className="text-brand-primary italic">Cookies.</span>
            </h1>
            <p className="text-brand-dark/50 text-lg max-w-2xl mx-auto">
              Ky dokument shpjegon se si EliteFit Pro përdor cookies dhe teknologjitë e ngjashme për t'ju ofruar një shërbim sa më cilësor.
            </p>
          </motion.div>

          {/* Content Cards */}
          <div className="grid gap-8">
            {sections.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-brand-surface rounded-[2rem] border border-brand-border hover:border-brand-primary/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm shrink-0">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-brand-dark mb-3">{item.title}</h3>
                    <p className="text-brand-dark/60 leading-relaxed font-sans">
                      {item.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Simple Table for Technical Users */}
          <div className="mt-16 overflow-hidden rounded-[2rem] border border-brand-border">
            <table className="w-full text-left border-collapse bg-white">
              <thead className="bg-brand-surface border-b border-brand-border">
                <tr>
                  <th className="p-5 font-display font-bold text-brand-dark">Lloji</th>
                  <th className="p-5 font-display font-bold text-brand-dark">Qëllimi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                <tr>
                  <td className="p-5 text-sm font-bold text-brand-dark">Esenciale</td>
                  <td className="p-5 text-sm text-brand-dark/60">Të domosdoshme për login dhe sigurinë.</td>
                </tr>
                <tr>
                  <td className="p-5 text-sm font-bold text-brand-dark">Analitike</td>
                  <td className="p-5 text-sm text-brand-dark/60">Për të kuptuar si përdoret faqja (Google Analytics).</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action CTA */}
          <div className="mt-16 p-10 bg-brand-dark rounded-[2.5rem] text-center">
            <MousePointer2 size={40} className="text-brand-primary mx-auto mb-6" />
            <h2 className="text-2xl font-display font-bold text-white mb-4">Dëshironi të ndryshoni cilësimet?</h2>
            <p className="text-white/40 mb-8 max-w-md mx-auto">Ju mund të resetoni të gjitha preferencat tuaja direkt nga ky buton.</p>
            <button className="px-8 py-4 bg-brand-primary text-white font-bold rounded-full hover:scale-105 transition-transform">
              Reset Cookies
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cookies;