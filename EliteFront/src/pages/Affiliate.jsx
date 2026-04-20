/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  Gift,
  Heart
} from "lucide-react";
import { Section, SectionHeader } from "../components/Layout";
import { Button } from "../components/Button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export const Affiliate = () => {
  const benefits = [
    {
      title: "Generous Commissions",
      desc: "Earn up to 25% recurring commission on every subscription for the lifetime of the customer.",
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    },
    {
      title: "Exclusive Perks",
      desc: "Get early access to new features, exclusive workout content, and branded EliteFitPro merchandise.",
      icon: Gift,
      color: "text-brand-accent",
      bg: "bg-pink/10"
    },
    {
      title: "90-Day Cookie",
      desc: "Our industry-leading cookie duration ensures you get credit for referrals even if they take their time.",
      icon: ShieldCheck,
      color: "text-brand-primary",
      bg: "bg-brand-primary/10"
    },
    {
      title: "Monthly Payouts",
      desc: "Reliable, on-time payments every month via PayPal or direct bank transfer with clear reporting.",
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-50"
    }
  ];

  const steps = [
    { title: "Apply", desc: "Fill out our simple application form to join the community." },
    { title: "Promote", desc: "Share your unique link via social media, blog, or video." },
    { title: "Earn", desc: "Receive commissions for every successful referral you make." }
  ];

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-brand-surface pt-24">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-brand-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-brand-accent/5 blur-[120px] rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-brand-border text-brand-primary text-xs font-bold uppercase tracking-widest mb-8 shadow-sm"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            Join the Movement
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-brand-dark mb-8"
          >
            EARN WHILE YOU <br />
            <span className="text-brand-primary italic">TRANSFORM LIVES</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-brand-dark/60 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Partner with FitOn Pro and help your audience reach their peak performance while building a sustainable income.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button variant="primary" size="lg" className="shadow-2xl">
              Apply to Program <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <Section id="benefits">
        <SectionHeader 
          title="Affiliate Benefits" 
          subtitle="We value our partners. That's why we offer one of the most competitive affiliate programs in the fitness industry."
          centered
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 border border-brand-border card-shadow flex flex-col group hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl ${benefit.bg} ${benefit.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <benefit.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-dark">{benefit.title}</h3>
              <p className="text-brand-dark/50 text-sm leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Simple How it Works */}
      <Section className="bg-white">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-brand-surface">
              <img 
                src="https://picsum.photos/seed/affiliate-success/1200/900" 
                alt="Partnership" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Float Element */}
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2rem] shadow-2xl card-shadow border border-brand-border max-w-xs md:block hidden animate-bounce-slow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <p className="font-bold text-sm">Growth Partner</p>
              </div>
              <p className="text-xs text-brand-dark/40 font-medium">Join 2,500+ influencers already earning with FitOn Pro.</p>
            </div>
          </motion.div>
          
          <div>
            <SectionHeader 
              title="Three Steps to Success" 
              subtitle="It's simple to get started. No complex setups or technical knowledge required."
            />
            <div className="space-y-8">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-brand-primary flex items-center justify-center font-display font-bold text-brand-primary text-xl group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-brand-dark mb-1">{step.title}</h4>
                    <p className="text-brand-dark/60 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12">
              <Button variant="dark" size="md" className="w-full md:w-auto">
                Read Partner FAQ
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Trust Quote */}
      <section className="py-24 px-6 bg-brand-surface overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <blockquote className="text-3xl md:text-4xl font-display font-medium text-brand-dark leading-tight mb-12">
            "FitOn Pro isn't just a platform I promote; it's a community I'm proud to be part of. The conversion rates are insane."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img src="https://picsum.photos/seed/influencer/200/200" alt="Testimonial" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="text-left">
              <p className="font-bold text-brand-dark">Sarah Michaels</p>
              <p className="text-sm text-brand-dark/40 font-medium tracking-wide">Elite Partner • 2M+ Followers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto rounded-[3.5rem] bg-brand-dark p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
              READY TO <span className="text-brand-primary">START EARNING?</span>
            </h2>
            <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">
              Join our elite affiliate community today and get your custom dashboard and tracking link in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Become a Partner
              </Button>
              <Button variant="ghost" className="text-white hover:text-brand-primary!">
                Program Terms <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
        <Footer />
    </>
  );
};
export default Affiliate;