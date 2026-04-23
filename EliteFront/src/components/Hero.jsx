/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Zap, Play, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export const Hero = () => {
  const navigate = useNavigate();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-widest mb-8">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Premium Performance
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.85] tracking-tighter mb-8 text-brand-dark">
            TRAIN LIKE <br />
            <span className="text-brand-primary">A PRO</span> <br />
            EVERY DAY
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-brand-dark/60 max-w-lg mb-12 leading-relaxed">
            Experience the world's most personalized fitness platform. 
            Tailored workouts, nutrition, and elite coaching designed for your success.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5">
            <Button variant="primary" icon={ArrowUpRight} onClick={() => navigate('/signup')}>
              Start Your Journey
            </Button>
            <Button variant="secondary">
              <Play className="w-5 h-5 text-brand-primary fill-current mr-2" />
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl bg-white p-2">
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
              <img 
                src="https://picsum.photos/seed/fitness-elite/1200/900" 
                alt="Elite Athlete" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              <button className="absolute bottom-8 right-8 w-16 h-16 bg-brand-accent text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group">
                <Play className="w-7 h-7 fill-current group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-accent/10 blur-3xl rounded-full" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;