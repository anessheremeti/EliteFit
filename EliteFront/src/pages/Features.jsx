/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Zap, 
  Target, 
  Utensils, 
  Activity, 
  Smartphone, 
  Users, 
  Trophy, 
  Flame,
  ArrowRight
} from "lucide-react";
import { Section, SectionHeader } from "../components/Layout";
import { Button } from "../components/Button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export const Features = () => {
  const featureList = [
    {
      title: "Adaptive Workouts",
      desc: "Our AI adjusts your plan in real-time based on your performance, recovery state, and feedback after every session.",
      icon: Zap,
      accent: "bg-brand-primary/10 text-brand-primary",
      image: "fitness-pro-1"
    },
    {
      title: "Precision Nutrition",
      desc: "Get a customized meal plan that syncs with your training intensity, ensuring you have the right fuel for every workout.",
      icon: Utensils,
      accent: "bg-brand-accent/10 text-brand-accent",
      image: "nutrition-pro-1"
    },
    {
      title: "Vitals Sync",
      desc: "Connect your Apple Watch, Oura, or Garmin to track heart rate, sleep quality, and strain for a 360° view of your health.",
      icon: Activity,
      accent: "bg-purple-500/10 text-purple-500",
      image: "wearable-pro-1"
    }
  ];

  const gridFeatures = [
    { title: "Elite Coaching", desc: "Access 24/7 chat support from certified personal trainers.", icon: Users },
    { title: "Weekly Challenges", desc: "Compete with the community for exclusive digital trophies.", icon: Trophy },
    { title: "Calorie Tracking", desc: "Simple photo-based macro logging powered by AI vision.", icon: Flame },
    { title: "Offline Mode", desc: "Download high-definition workout videos for any environment.", icon: Smartphone }
  ];

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-brand-surface pt-24">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[5%] right-[0%] w-[50%] h-[50%] bg-brand-primary/5 blur-[120px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border text-brand-dark/40 text-[10px] font-bold uppercase tracking-widest mb-8 shadow-sm"
          >
            Capabilities
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-brand-dark leading-[0.9] mb-8"
          >
            THE FUTURE OF <br />
            <span className="text-brand-primary italic">PERFORMANCE</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-brand-dark/50 max-w-2xl leading-relaxed"
          >
            FitOn Pro combines cutting-edge biometrics with world-class coaching to deliver 
            an experience tailored exclusively for your body and your goals.
          </motion.p>
        </div>
      </section>

      {/* Main Features - alternating layout */}
      {featureList.map((feature, idx) => (
        <Section key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-brand-surface"}>
          <div className={`flex flex-col lg:items-center gap-16 ${idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
            <motion.div 
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className={`w-16 h-16 rounded-2xl ${feature.accent} flex items-center justify-center mb-8 shadow-sm`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-dark mb-6 tracking-tight">
                {feature.title}
              </h2>
              <p className="text-brand-dark/60 text-lg leading-relaxed mb-10 max-w-xl">
                {feature.desc}
              </p>
              <Button variant="secondary" size="md">
                Learn More <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-brand-surface/50">
                <img 
                  src={`https://picsum.photos/seed/${feature.image}/1200/900`} 
                  alt={feature.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </Section>
      ))}

      {/* Feature Grid */}
      <Section className="bg-brand-dark text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/10 blur-[150px] rounded-full pointer-events-none" />
        <SectionHeader 
          title="Everything Else You Get" 
          subtitle="Our ecosystem is designed to remove all friction from your fitness journey."
          centered
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {gridFeatures.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary mb-6">
                <f.icon className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold mb-3">{f.title}</h4>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="max-w-4xl mx-auto text-center bg-white rounded-[3.5rem] p-12 md:p-24 shadow-xl border border-brand-border">
          <SectionHeader 
            title="Experience Elite" 
            subtitle="Ready to unlock your full potential? Join thousands of athletes who settled for more."
            centered
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
            <Button variant="primary" size="lg">
              Start Your Free Trial
            </Button>
            <Button variant="secondary" size="lg">
              Talk to a Coach
            </Button>
          </div>
        </div>
      </Section>
    </div>
    <Footer />
    </>
  );
};
export default Features;