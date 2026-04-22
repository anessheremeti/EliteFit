/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "framer-motion";
import { Target, Users, Shield, Zap, ArrowRight } from "lucide-react";
import { Section } from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const AboutUs = () => {
  const values = [
    {
      icon: Target,
      title: "Misioni Jonë",
      desc: "Të demokratizojmë fitnesin elitë duke ofruar teknologjinë dhe ekspertizën më të lartë për këdo, kudo."
    },
    {
      icon: Users,
      title: "Komuniteti",
      desc: "Ne besojmë se rritja ndodh bashkë. EliteFit nuk është thjesht një aplikacion, është një lëvizje."
    },
    {
      icon: Shield,
      title: "Integriteti",
      desc: "Çdo program trajnimi bazohet në shkencën e vërtetë të sportit, jo në trende të përkohshme."
    },
    {
      icon: Zap,
      title: "Inovacioni",
      desc: "Shtojmë kufijtë e asaj që është e mundur në fitnesin digjital përmes teknologjisë AI."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-brand-surface -z-10" />
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-display font-bold text-brand-dark tracking-tighter mb-8"
            >
              WE BUILD <br />
              <span className="text-brand-primary italic">CHAMPIONS.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-brand-dark/50 max-w-3xl mx-auto leading-relaxed"
            >
              EliteFit PRO lindi nga nevoja për të thyer barrierat mes trajnerëve të klasit botëror 
              dhe njerëzve të zakonshëm që kërkojnë rezultate të jashtëzakonshme.
            </motion.p>
          </div>
        </section>

        {/* Story Section */}
        <Section>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-display font-bold text-brand-dark">Historia Jonë</h2>
              <p className="text-brand-dark/60 leading-relaxed">
                E themeluar në vitin 2024, EliteFit filloi si një grup i vogël sportistësh dhe inxhinierësh 
                të apasionuar pas performancës njerëzore. Sot, ne jemi shtëpia e qindra trajnerëve 
                të certifikuar dhe mijëra anëtarëve që po transformojnë jetën e tyre.
              </p>
              <p className="text-brand-dark/60 leading-relaxed">
                Nuk ka të bëjë vetëm me ngritjen e peshave apo vrapimin; ka të bëjë me disiplinën, 
                shëndetin mendor dhe arritjen e versionit tënd më të mirë.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&h=800&auto=format&fit=crop" 
                alt="Gym culture"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          </div>
        </Section>

        {/* Core Values Grid */}
        <Section className="bg-brand-surface">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-brand-dark mb-4">Vlerat Tona</h2>
            <div className="w-20 h-1 bg-brand-primary mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-white rounded-[2.5rem] border border-brand-border hover:shadow-xl transition-all group text-center"
              >
                <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mx-auto mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <v.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{v.title}</h3>
                <p className="text-brand-dark/50 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* CTA Section */}
        <Section>
          <div className="bg-brand-dark rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 blur-[100px] rounded-full" />
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 relative z-10">
              Gati për të filluar <br /> kapitullin tënd?
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-brand-primary text-white font-bold rounded-full inline-flex items-center gap-3 relative z-10"
            >
              Bashkohu me Ne <ArrowRight size={20} />
            </motion.button>
          </div>
        </Section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;