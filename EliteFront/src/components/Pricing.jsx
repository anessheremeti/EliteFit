/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Section, SectionHeader } from "./Layout";
import { Button } from "./Button";

export const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const navigate = useNavigate();

  const plans = [
    { 
      name: "Free", 
      price: { monthly: 0, annual: 0 },
      desc: "Perfect for starting your fitness journey", 
      features: ["Basic Workouts", "Community Access", "Limited Nutrition", "Standard Support", "Mobile App Access"],
      cta: "Get Started",
      popular: false,
      color: "brand-primary"
    },
    { 
      name: "Pro", 
      price: { monthly: 19, annual: 14 },
      desc: "Most popular choice for serious results", 
      features: ["All Workouts", "Personalized Plans", "Full Nutrition Guide", "Priority Support", "Live Classes", "Offline Downloads"],
      cta: "Go Pro",
      popular: true,
      color: "brand-primary"
    },
    { 
      name: "Elite", 
      price: { monthly: 49, annual: 39 },
      desc: "The ultimate 1-on-1 experience", 
      features: ["1-on-1 Coaching", "Custom Meal Prep", "Wearable Integration", "Exclusive Events", "VIP Support", "Pro Feature Set"],
      cta: "Join Elite",
      popular: false,
      color: "brand-accent"
    },
  ];

  return (
    <Section id="pricing" className="bg-white">
      <SectionHeader 
        title="Pricing Plans" 
        subtitle="Choose the plan that fits your lifestyle. No hidden fees, cancel anytime."
        centered
      />

      {/* Billing Toggle */}
      <div className="flex flex-col items-center mb-16">
        <div className="flex items-center gap-4 bg-brand-surface p-1.5 rounded-full border border-brand-border">
          <button 
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${!isAnnual ? "bg-white text-brand-dark shadow-sm" : "text-brand-dark/40 hover:text-brand-dark"}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all relative ${isAnnual ? "bg-white text-brand-dark shadow-sm" : "text-brand-dark/40 hover:text-brand-dark"}`}
          >
            Annual
            {isAnnual && (
              <motion.span 
                layoutId="toggle-pill"
                className="absolute inset-0 bg-white rounded-full -z-10"
              />
            )}
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest bg-brand-accent/10 px-2 py-0.5 rounded">Save up to 25%</span>
          <span className="text-xs text-brand-dark/40 font-medium">with yearly billing</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -10 }}
            className={`
              relative p-10 rounded-[3.5rem] border flex flex-col transition-all duration-500
              ${plan.popular 
                ? "border-brand-primary bg-white shadow-[0_32px_64px_-16px_rgba(79,195,247,0.15)] scale-105 z-10" 
                : "border-brand-border bg-white hover:border-brand-primary/30 hover:shadow-xl"}
            `}
          >
            {plan.popular && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-brand-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                <Zap className="w-3 h-3 fill-current" />
                Most Popular
              </div>
            )}

            <div className="mb-10 text-center md:text-left">
              <h3 className={`text-2xl font-display font-bold mb-4 ${plan.popular ? "text-brand-primary" : "text-brand-dark"}`}>
                {plan.name}
              </h3>
              
              <div className="mb-6">
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="text-sm font-bold text-brand-dark/40 transform -translate-y-4">$</span>
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={isAnnual ? "annual" : "monthly"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-6xl font-display font-bold text-brand-dark"
                    >
                      {isAnnual ? plan.price.annual : plan.price.monthly}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-brand-dark/40 text-sm font-bold uppercase tracking-widest">/mo</span>
                </div>
                {isAnnual && plan.price.annual > 0 && (
                  <p className="text-[10px] text-brand-primary font-bold uppercase tracking-wider mt-1">Billed annually</p>
                )}
              </div>

              <p className="text-brand-dark/60 text-sm leading-relaxed font-medium">
                {plan.desc}
              </p>
            </div>

            <div className="space-y-4 mb-12 flex-grow">
              {plan.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-start gap-4 text-sm font-medium text-brand-dark/80 group">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${plan.popular ? "bg-brand-primary/10 text-brand-primary" : "bg-brand-surface text-brand-dark/20"}`}>
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="leading-tight">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              variant={plan.popular ? "primary" : "secondary"}
              className={`w-full py-5 text-sm uppercase tracking-widest ${plan.popular ? "shadow-brand-primary/20" : ""}`}
              onClick={() => navigate('/signup')}
            >
              {plan.cta}
            </Button>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};
export default Pricing;