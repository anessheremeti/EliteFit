import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldCheck, X } from 'lucide-react'
import { Button } from './Button'

export function LogoutModal({ open, onClose, onConfirm, userName }) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-4 top-1/2 z-50 mx-auto w-full max-w-lg -translate-y-1/2 rounded-3xl border border-black/5 bg-white p-6 shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
            aria-describedby="logout-modal-description"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-pink/10 text-pink ring-1 ring-pink/10">
                <ShieldCheck size={28} />
              </div>
              <button
                type="button"
                aria-label="Close logout confirmation"
                className="rounded-full p-2 text-dark/60 transition hover:bg-surface hover:text-dark"
                onClick={onClose}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 text-center">
              <p id="logout-modal-title" className="text-xl font-semibold text-dark">
                Confirm sign out
              </p>
              <p id="logout-modal-description" className="mt-3 text-sm leading-6 text-dark/70">
                Are you sure you want to log out{userName ? `, ${userName}` : ''}? You'll need to sign in again to continue using EliteFit.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="secondary"
                className="w-full text-brand-dark"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="dark"
                                    className='flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-sans text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300'

                onClick={onConfirm}
              >
                Log out
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
