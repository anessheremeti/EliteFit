/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Download, Mail, ExternalLink, Globe, FileText, ImageIcon, DownloadCloud } from "lucide-react";
import { Section, SectionHeader } from "../components/Layout";
import { Button } from "../components/Button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AssetCard = ({ title, type, description, icon: Icon }) => (
  <div className="bg-white rounded-[2rem] p-8 border border-brand-border card-shadow flex flex-col h-full group">
    <div className="w-14 h-14 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex-grow">
      <h3 className="text-xl font-bold mb-2 text-brand-dark">{title}</h3>
      <p className="text-brand-dark/40 text-sm mb-6">{description}</p>
    </div>
    <div className="flex gap-3">
      <Button variant="secondary" size="sm" className="w-full">
        {type}
      </Button>
      <Button variant="primary" size="sm" className="px-4!">
        <Download className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

export const PressKit = () => {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const factSheet = [
    { label: "Founded", value: "January 2024" },
    { label: "Headquarters", value: "San Francisco, CA" },
    { label: "Active Users", value: "500,000+" },
    { label: "Elite Trainers", value: "150+" },
    { label: "Workouts", value: "2,000+" },
    { label: "Founders", value: "Anes Sheremeti, Ensar Zeqiri,Jahir Qoqaj,Lendrit Zogaj" }
  ];

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-brand-surface pt-24">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-brand-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-brand-accent/5 blur-[120px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border text-brand-dark/40 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm"
          >
            Media Relations
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-brand-dark mb-8"
          >
            PRESS <span className="text-brand-primary italic">KIT</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-brand-dark/60 max-w-2xl mx-auto leading-relaxed"
          >
            Everything you need to tell the story of FitOn Pro—the world's most personalized fitness platform.
          </motion.p>
        </div>
      </section>

      {/* Brand Identity */}
      <Section id="brand-identity">
        <SectionHeader 
          title="Brand Assets" 
          subtitle="Please use these assets when featuring FitOn Pro in your publications. Do not modify or distort our brand identity."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AssetCard 
            title="Elite Logo Pack" 
            type="SVG / PNG" 
            description="Our primary logo in full color, black, and white variants."
            icon={FileText}
          />
          <AssetCard 
            title="UI Screenshots" 
            type="4K Resolution" 
            description="High-definition captures of the FitOn Pro dashboard and workout player."
            icon={ImageIcon}
          />
          <AssetCard 
            title="Brand Guidelines" 
            type="PDF" 
            description="Typography, color palettes, and voice & tone documentation."
            icon={Globe}
          />
        </div>
      </Section>

      {/* Company Fact Sheet */}
      <Section className="bg-white">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <SectionHeader 
              title="Quick Facts" 
              subtitle="The essential data points about our mission and growth."
            />
            <div className="space-y-4">
              {factSheet.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-4 border-b border-brand-border text-sm">
                  <span className="font-bold text-brand-dark/40 uppercase tracking-wider">{item.label}</span>
                  <span className="font-bold text-brand-dark">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 flex items-center gap-6">
              <Button variant="dark" size="sm">
                Download Full Fact Sheet (PDF)
              </Button>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl bg-brand-surface"
          >
            <img 
              src="https://picsum.photos/seed/company-culture/1000/1000" 
              alt="Company Culture" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply" />
          </motion.div>
        </div>
      </Section>

      {/* Media Gallery */}
      <Section>
        <SectionHeader 
          title="Media Gallery" 
          subtitle="Lifestyle and product photography shot by professional athletes."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 0.98 }}
              className={`relative overflow-hidden rounded-3xl bg-white border border-brand-border cursor-pointer aspect-square ${i === 1 || i === 6 ? 'md:col-span-2 md:row-span-2' : ''}`}
            >
              <img 
                src={`https://picsum.photos/seed/press-img-${i}/800/800`} 
                alt={`Media ${i}`} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center group">
                <DownloadCloud className="text-white w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Press Contact */}
      <Section className="bg-brand-dark overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <SectionHeader 
            title="Media Contact" 
            subtitle="Are you a member of the press? Reach out to our communications team for interviews, statements, or further information."
            centered
            className="text-white!"
          />
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] w-full max-w-sm">
              <Mail className="w-10 h-10 text-brand-primary mx-auto mb-4" />
              <h4 className="text-black font-bold text-xl mb-1">General Inquiries</h4>
              <p className="text-black text-sm mb-6">press@elitefit.com</p>
              <Button variant="outline" size="sm" className="w-full border-white/20! text-black! hover:bg-white! hover:text-brand-dark!">
                Copy Email
              </Button>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] w-full max-w-sm">
              <ExternalLink className="w-10 h-10 text-brand-accent mx-auto mb-4" />
              <h4 className="text-black font-bold text-xl mb-1">Expert Interviews</h4>
              <p className="text-black/40 text-sm mb-6">experts@elitefit.com</p>
              <Button variant="outline" size="sm" className="w-full border-white/20! text-black! hover:bg-white! hover:text-brand-dark!">
                Schedule Call
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
    <Footer />
    </>
  );
};
