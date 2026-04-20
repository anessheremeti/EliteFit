/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users, Activity, Zap, Trophy } from "lucide-react";
import { Section, SectionHeader } from "./Layout";

export const HowItWorks = () => {
  const steps = [
    { step: "01", title: "Join Elite", desc: "Sign up and choose your personalized fitness path.", icon: <Users className="w-7 h-7" /> },
    { step: "02", title: "Personalize", desc: "Tell us your goals, preferences, and schedule.", icon: <Activity className="w-7 h-7" /> },
    { step: "03", title: "Train Hard", desc: "Follow elite-level workouts designed specifically for you.", icon: <Zap className="w-7 h-7" /> },
    { step: "04", title: "Track Progress", desc: "Monitor your gains with advanced real-time analytics.", icon: <Trophy className="w-7 h-7" /> },
  ];

  return (
    <Section id="training" className="bg-white">
      <SectionHeader 
        title="How It Works" 
        subtitle="Your journey to peak performance starts with four simple, scientifically-backed steps."
        centered
      />
      <div className="grid md:grid-cols-4 gap-12">
        {steps.map((item, idx) => (
          <div key={idx} className="relative group">
            <div className="mb-8 w-20 h-20 rounded-[2rem] bg-brand-surface flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm">
              {item.icon}
            </div>
            <span className="text-7xl font-display font-bold text-brand-dark/5 absolute top-0 right-0 pointer-events-none">
              {item.step}
            </span>
            <h3 className="text-2xl font-bold mb-3 text-brand-dark">{item.title}</h3>
            <p className="text-brand-dark/60 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};
export default HowItWorks;