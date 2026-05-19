import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, Check, X, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const MotionDiv = Motion.div;
const API_URL = 'http://localhost:5193/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    function validateEmail(value) {
        if (!value) return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
        return '';
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const err = validateEmail(email);
        if (err) { setEmailError(err); return; }

        setLoading(true);
        setServerError('');
        try {
            const res = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim().toLowerCase() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Something went wrong.');
            setSuccess(true);
        } catch (err) {
            setServerError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col">
            {/* Dreamy blurred background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(180deg,#fdf0f0 0%,#f7e3e6 20%,#eedadd 38%,#e4d1d6 54%,#dac9d0 70%,#d2c2ca 85%,#cdbec7 100%)'
                }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 120% 18% at 50% 52%,rgba(185,155,165,0.45) 0%,transparent 100%)' }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 90% 45% at 50% 10%,rgba(255,240,242,0.75) 0%,transparent 70%)' }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 100% 40% at 50% 95%,rgba(160,130,145,0.3) 0%,transparent 70%)' }} />
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center gap-4 px-8 py-5">
                <span className="font-bold text-lg tracking-tight text-gray-900">EliteFit</span>
                <div className="w-px h-5 bg-gray-300" />
                <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={16} /> Back
                </button>
            </header>

            {/* Card */}
            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
                <div className="bg-white rounded-3xl px-10 py-10 w-full max-w-md shadow-sm">
                    <AnimatePresence mode="wait">
                        {success ? (
                            /* Success state */
                            <MotionDiv key="success-state"
                                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center py-4">
                                <div className="w-15 h-15 rounded-full flex items-center justify-center mb-5"
                                    style={{ background: 'rgba(220,252,231,0.8)' }}>
                                    <Check size={28} className="text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your inbox</h2>
                                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                    If <span className="text-gray-600 font-medium">{email}</span> is registered,
                                    you'll receive a password reset link within a few minutes.
                                    The link expires in <strong className="text-gray-700">30 minutes</strong>.
                                </p>
                                <Link to="/login"
                                    className="flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-600 transition-colors">
                                    <ArrowLeft size={15} /> Back to Login
                                </Link>
                            </MotionDiv>
                        ) : (
                            /* Form state */
                            <MotionDiv key="form-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {/* Icon */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-15 h-15 rounded-full flex items-center justify-center"
                                        style={{ background: 'rgba(249,220,228,0.6)' }}>
                                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                                            <path d="M17 5C10.373 5 5 10.373 5 17C5 23.627 10.373 29 17 29C23.627 29 29 23.627 29 17"
                                                stroke="#d6306a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                                            <path d="M29 17C29 13.8 27.7 10.9 25.6 8.8"
                                                stroke="#d6306a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                                            <path d="M22 5L26.2 8.5L22.5 12.5"
                                                stroke="#d6306a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                            <path d="M13 15.5V12.5C13 10.015 14.79 8 17 8C19.21 8 21 10.015 21 12.5V15.5"
                                                stroke="#d6306a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                                            <rect x="11.5" y="15.5" width="11" height="8.5" rx="2" fill="#d6306a" />
                                            <circle cx="17" cy="19.5" r="1.6" fill="white" />
                                        </svg>
                                    </div>
                                </div>

                                <h1 className="text-[1.85rem] font-bold text-center text-gray-900 leading-tight mb-3">
                                    Forgot Password
                                </h1>
                                <p className="text-center text-gray-400 text-sm leading-relaxed mb-8">
                                    No worries! Enter your email address and we'll<br />
                                    send you a link to reset your password.
                                </p>

                                {/* Server error */}
                                <AnimatePresence>
                                    {serverError && (
                                        <MotionDiv key="error"
                                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 p-3 rounded-xl mb-5 text-sm"
                                            style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                                            <X size={14} className="shrink-0" />{serverError}
                                        </MotionDiv>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
                                                placeholder="e.g. athlete@elitefit.com"
                                                className="w-full pl-10 pr-5 py-3.5 rounded-full border text-sm text-gray-700 placeholder-gray-300 focus:outline-none transition-all"
                                                style={{
                                                    borderColor: emailError ? 'rgba(239,68,68,0.5)' : '#e5e7eb',
                                                    boxShadow: emailError ? '0 0 0 3px rgba(239,68,68,0.07)' : 'none'
                                                }}
                                            />
                                        </div>
                                        <AnimatePresence>
                                            {emailError && (
                                                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}
                                                    className="text-xs mt-1.5" style={{ color: '#ef4444' }}>
                                                    {emailError}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <button type="submit" disabled={loading}
                                        className="w-full py-4 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                        style={{ background: 'linear-gradient(135deg,#f472b6 0%,#ec4899 45%,#db2777 100%)' }}>
                                        {loading
                                            ? <><Loader2 size={16} className="animate-spin" />Sending...</>
                                            : <>Send Reset Link <ArrowRight size={17} /></>
                                        }
                                    </button>
                                </form>

                                <div className="my-6 border-t border-gray-100" />
                                <div className="flex justify-center">
                                    <Link to="/login"
                                        className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-600 transition-colors">
                                        <ArrowLeft size={15} /> Back to Login
                                    </Link>
                                </div>
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
