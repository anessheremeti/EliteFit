/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { Section } from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const Contact = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-32">
        
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            <MessageSquare size={14} /> Jemi këtu për ju
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-dark tracking-tighter">
            Le të <span className="text-brand-primary italic">bisedojmë.</span>
          </h1>
          <p className="text-brand-dark/50 text-lg mt-6 max-w-xl mx-auto font-sans">
            Keni një pyetje rreth programeve tona apo keni nevojë për ndihmë teknike? Na shkruani dhe ekipi ynë do t'ju përgjigjet brenda 24 orëve.
          </p>
        </div>

        <Section className="pt-0">
          <div className="grid lg:grid-cols-2 gap-16 bg-brand-surface rounded-[4rem] p-8 md:p-16 border border-brand-border">
            
            {/* Contact Info Side */}
            <div className="space-y-12">
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-bold text-brand-dark">Informacionet e Kontaktit</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm border border-brand-border">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-dark/30 mb-1">Na shkruani në</p>
                      <p className="text-lg font-bold text-brand-dark">support@elitefitpro.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm border border-brand-border">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-dark/30 mb-1">Na telefononi</p>
                      <p className="text-lg font-bold text-brand-dark">+383 49 123 456</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-primary shadow-sm border border-brand-border">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-brand-dark/30 mb-1">Zyra Qendrore</p>
                      <p className="text-lg font-bold text-brand-dark">Prishtinë, Kosovë</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-brand-primary/5 rounded-3xl border border-brand-primary/10 space-y-4">
                <div className="flex items-center gap-3 text-brand-primary">
                  <Clock size={20} />
                  <span className="font-bold text-sm uppercase tracking-wider">Orari i Punës</span>
                </div>
                <div className="grid grid-cols-2 text-sm font-sans text-brand-dark/60">
                  <span>E hënë - E premte:</span>
                  <span className="text-brand-dark font-medium">08:00 - 20:00</span>
                  <span>E shtunë:</span>
                  <span className="text-brand-dark font-medium">10:00 - 16:00</span>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-brand-dark/5 border border-brand-border">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 ml-1">Emri</label>
                    <input 
                      type="text" 
                      placeholder="Emri juaj"
                      className="w-full px-5 py-4 rounded-2xl bg-brand-surface border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all font-sans"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 ml-1">Email</label>
                    <input 
                      type="email" 
                      placeholder="email@shembull.com"
                      className="w-full px-5 py-4 rounded-2xl bg-brand-surface border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all font-sans"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 ml-1">Subjekti</label>
                  <select className="w-full px-5 py-4 rounded-2xl bg-brand-surface border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all font-sans appearance-none">
                    <option>Pyetje e Përgjithshme</option>
                    <option>Problem Teknik</option>
                    <option>Bashkëpunim</option>
                    <option>Tjetër</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-dark/40 ml-1">Mesazhi</label>
                  <textarea 
                    rows={4}
                    placeholder="Si mund t'ju ndihmojmë?"
                    className="w-full px-5 py-4 rounded-2xl bg-brand-surface border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all font-sans resize-none"
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 bg-brand-dark text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-brand-primary transition-colors shadow-lg"
                >
                  Dërgo Mesazhin <Send size={18} />
                </motion.button>
              </form>
            </div>

          </div>
        </Section>
      </div>
      <Footer />
    </>
  );
};

export default Contact;