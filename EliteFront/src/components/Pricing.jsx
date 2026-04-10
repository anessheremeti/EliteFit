import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    desc: 'Perfect for getting started on your fitness journey.',
    features: [
      '10 workouts / month',
      'Basic progress tracking',
      '2 trainer profiles',
      'Community access',
      'Mobile app',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    desc: 'For serious athletes who demand elite performance tools.',
    features: [
      'Unlimited workouts',
      'Advanced analytics',
      'All trainer profiles',
      'Live sessions (4/mo)',
      'Nutrition planner',
      'Priority support',
      'Offline downloads',
    ],
    cta: 'Start Pro Trial',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    name: 'Elite',
    price: '$49',
    period: '/month',
    desc: 'The ultimate package for peak performance and coaching.',
    features: [
      'Everything in Pro',
      '1-on-1 coaching (2/mo)',
      'Custom meal plans',
      'Biometric integration',
      'Unlimited live sessions',
      'Dedicated trainer',
      'White-glove onboarding',
    ],
    cta: 'Go Elite',
    highlight: false,
  },
]

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sky text-sm font-sans font-medium tracking-widest uppercase">
            Pricing
          </span>
          <h2 className="font-heading font-bold text-4xl text-dark mt-3">Choose Your Plan</h2>
          <p className="text-dark/50 font-sans mt-4 max-w-md mx-auto">
            Start for free, upgrade when you're ready. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid md:grid-cols-3 gap-6 items-stretch"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`relative rounded-[2rem] p-8 flex flex-col ${
                plan.highlight
                  ? 'bg-dark text-white shadow-2xl md:scale-[1.03] z-10'
                  : 'bg-surface border border-black/5'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-sky text-dark text-xs font-sans font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                    <Zap size={11} fill="currentColor" /> {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`font-heading font-bold text-xl mb-1 ${
                    plan.highlight ? 'text-white' : 'text-dark'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm font-sans ${
                    plan.highlight ? 'text-white/60' : 'text-dark/50'
                  }`}
                >
                  {plan.desc}
                </p>
              </div>

              <div className="mb-8">
                <span
                  className={`font-heading font-bold text-5xl ${
                    plan.highlight ? 'text-white' : 'text-dark'
                  }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-sm font-sans ml-1 ${
                    plan.highlight ? 'text-white/50' : 'text-dark/40'
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        plan.highlight ? 'bg-sky/25' : 'bg-sky/10'
                      }`}
                    >
                      <Check size={11} className="text-sky" />
                    </div>
                    <span
                      className={`text-sm font-sans ${
                        plan.highlight ? 'text-white/80' : 'text-dark/70'
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3.5 rounded-full font-sans font-medium text-sm transition-all ${
                  plan.highlight
                    ? 'bg-pink text-white hover:opacity-90'
                    : 'bg-dark text-white hover:bg-dark/85'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
