import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'Can I cancel my subscription at any time?',
    a: 'Yes, absolutely. You can cancel at any time from your account settings. There are no cancellation fees and your access continues until the end of the billing period.',
  },
  {
    q: 'How does the personalization onboarding work?',
    a: 'After signing up you complete a short onboarding where you set your gender, weight, height, fitness goals, diet type (e.g. Vegan, Keto, Standard), daily activity level, and any food allergies. We use this to calculate your daily calorie target and surface the most relevant workouts and recipes.',
  },
  {
    q: 'Can I filter recipes by allergens or diet type?',
    a: 'Yes. Every recipe is tagged with allergen information (gluten, dairy, nuts, etc.) and a diet label. You can filter by your saved allergies and diet preferences so you only see meals that are safe and aligned with your plan.',
  },
  {
    q: 'How does the streak and badge system work?',
    a: 'Your streak counts consecutive days with at least one completed workout. If you miss a day you can spend a streak freeze to protect it. Badges are awarded for milestones like first workout, 7-day streak, 50 workouts completed, and more.',
  },
  {
    q: 'Do I need any equipment to get started?',
    a: "Not at all. Many workouts are bodyweight-only. Each video lists its difficulty level, target muscle group, and any required equipment upfront so you can plan ahead.",
  },
  {
    q: 'How many workouts and recipes are available?',
    a: 'We have over 2,000 workout videos across categories like HIIT, Yoga, Strength, Cardio, Pilates, and Core, plus hundreds of recipes with full macro breakdowns. New content is added every week.',
  },
  {
    q: 'Is there a free trial for the Pro plan?',
    a: "Yes. All new users get a 14-day free trial of the Pro plan with no credit card required. You'll only be charged if you choose to continue after the trial.",
  },
  {
    q: 'Can I use the app on multiple devices?',
    a: 'EliteFitPro is available on web, iOS, and Android. Your workout history, streaks, and progress sync seamlessly across all devices.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" className="py-24 px-6 lg:px-8 bg-surface">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-sky text-sm font-sans font-medium tracking-widest uppercase">
            Support
          </span>
          <h2 className="font-heading font-bold text-4xl text-dark mt-3">
            Frequently Asked Questions
          </h2>
          <p className="text-dark/50 font-sans mt-4">
            Everything you need to know before getting started.
          </p>
        </motion.div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="bg-white rounded-2xl border border-black/5 overflow-hidden"
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-heading font-semibold text-dark">{faq.q}</span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    open === i ? 'bg-dark text-white' : 'bg-surface text-dark'
                  }`}
                >
                  {open === i ? <Minus size={13} /> : <Plus size={13} />}
                </div>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 pt-1 text-dark/60 font-sans text-sm leading-relaxed border-t border-black/5">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
