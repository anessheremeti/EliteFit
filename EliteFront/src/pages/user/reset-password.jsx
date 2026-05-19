import { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
const MotionDiv = Motion.div;
import { Eye, EyeOff, ArrowLeft, Check, X, Loader2, ShieldCheck } from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5193/api';

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
const STRENGTH_COLORS = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];

function getStrength(pw) {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[a-z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
}

function validate(newPassword, confirmPassword) {
    const errors = {};
    if (!newPassword) {
        errors.newPassword = 'New password is required.';
    } else {
        if (newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters.';
        else if (!/[A-Z]/.test(newPassword)) errors.newPassword = 'Must contain at least one uppercase letter.';
        else if (!/[a-z]/.test(newPassword)) errors.newPassword = 'Must contain at least one lowercase letter.';
        else if (!/[0-9]/.test(newPassword)) errors.newPassword = 'Must contain at least one digit.';
    }
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.';
    else if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    return errors;
}

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState(false);
    const [tokenMissing, setTokenMissing] = useState(false);

    const strength = getStrength(newPassword);

    useEffect(() => {
        if (!token) setTokenMissing(true);
    }, [token]);

    async function handleSubmit(e) {
        e.preventDefault();
        const validationErrors = validate(newPassword, confirmPassword);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setLoading(true);
        setServerError('');
        try {
            const res = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    newPassword,
                    confirmPassword,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Reset failed. Please try again.');
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setServerError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col">
            {/* Background */}
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
                <Link to="/login" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={16} /> Back to Login
                </Link>
            </header>

            <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
                <div className="bg-white rounded-3xl px-10 py-10 w-full max-w-md shadow-sm">
                    <AnimatePresence mode="wait">
                        {/* Invalid / missing token */}
                        {tokenMissing && (
                            <MotionDiv key="token-missing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex flex-col items-center text-center py-4">
                                <div className="w-15 h-15 rounded-full flex items-center justify-center mb-5"
                                    style={{ background: 'rgba(254,226,226,0.8)' }}>
                                    <X size={28} className="text-red-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">Invalid Link</h2>
                                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                    This reset link is missing a token. Please request a new password reset link.
                                </p>
                                <Link to="/forgot-password"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold"
                                    style={{ background: 'linear-gradient(135deg,#f472b6,#db2777)' }}>
                                    Request New Link
                                </Link>
                            </MotionDiv>
                        )}

                        {/* Success */}
                        {!tokenMissing && success && (
                            <MotionDiv key="success" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center py-4">
                                <div className="w-15 h-15 rounded-full flex items-center justify-center mb-5"
                                    style={{ background: 'rgba(220,252,231,0.8)' }}>
                                    <ShieldCheck size={28} className="text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">Password Reset!</h2>
                                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                    Your password has been updated successfully.<br />
                                    Redirecting you to login in a moment...
                                </p>
                                <Link to="/login"
                                    className="flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-600 transition-colors">
                                    <ArrowLeft size={15} /> Go to Login
                                </Link>
                            </MotionDiv>
                        )}

                        {/* Form */}
                        {!tokenMissing && !success && (
                            <MotionDiv key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {/* Icon */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-15 h-15 rounded-full flex items-center justify-center"
                                        style={{ background: 'rgba(249,220,228,0.6)' }}>
                                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                                            <path d="M13 15.5V12.5C13 10.015 14.79 8 17 8C19.21 8 21 10.015 21 12.5V15.5"
                                                stroke="#d6306a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                                            <rect x="11.5" y="15.5" width="11" height="8.5" rx="2" fill="#d6306a" />
                                            <circle cx="17" cy="19.5" r="1.6" fill="white" />
                                            <path d="M24 10 L27 7 M27 7 L30 10 M27 7 V14"
                                                stroke="#d6306a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                        </svg>
                                    </div>
                                </div>

                                <h1 className="text-[1.85rem] font-bold text-center text-gray-900 leading-tight mb-3">
                                    Set New Password
                                </h1>
                                <p className="text-center text-gray-400 text-sm leading-relaxed mb-8">
                                    Choose a strong password for your account.<br />
                                    It must be at least 8 characters.
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
                                    {/* New Password */}
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showNew ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={e => { setNewPassword(e.target.value); if (errors.newPassword) setErrors(p => ({ ...p, newPassword: '' })); }}
                                                placeholder="Min. 8 characters"
                                                className="w-full pl-5 pr-11 py-3.5 rounded-full border text-sm text-gray-700 placeholder-gray-300 focus:outline-none transition-all"
                                                style={{
                                                    borderColor: errors.newPassword ? 'rgba(239,68,68,0.5)' : '#e5e7eb',
                                                    boxShadow: errors.newPassword ? '0 0 0 3px rgba(239,68,68,0.07)' : 'none'
                                                }}
                                            />
                                            <button type="button" onClick={() => setShowNew(v => !v)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>

                                        {/* Strength bar */}
                                        {newPassword && (
                                            <div className="mt-2 space-y-1">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                                                            style={{ background: i <= strength ? STRENGTH_COLORS[strength] : '#e5e7eb' }} />
                                                    ))}
                                                </div>
                                                <p className="text-xs" style={{ color: STRENGTH_COLORS[strength] }}>
                                                    {STRENGTH_LABELS[strength]}
                                                </p>
                                            </div>
                                        )}

                                        <AnimatePresence>
                                            {errors.newPassword && (
                                                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}
                                                    className="text-xs mt-1.5" style={{ color: '#ef4444' }}>
                                                    {errors.newPassword}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirm ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={e => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(p => ({ ...p, confirmPassword: '' })); }}
                                                placeholder="Repeat your password"
                                                className="w-full pl-5 pr-11 py-3.5 rounded-full border text-sm text-gray-700 placeholder-gray-300 focus:outline-none transition-all"
                                                style={{
                                                    borderColor: errors.confirmPassword ? 'rgba(239,68,68,0.5)'
                                                        : confirmPassword && confirmPassword === newPassword ? 'rgba(34,197,94,0.5)'
                                                            : '#e5e7eb',
                                                }}
                                            />
                                            <button type="button" onClick={() => setShowConfirm(v => !v)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            {confirmPassword && confirmPassword === newPassword && (
                                                <Check size={16} className="absolute right-10 top-1/2 -translate-y-1/2 text-green-500" />
                                            )}
                                        </div>
                                        <AnimatePresence>
                                            {errors.confirmPassword && (
                                                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}
                                                    className="text-xs mt-1.5" style={{ color: '#ef4444' }}>
                                                    {errors.confirmPassword}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <button type="submit" disabled={loading}
                                        className="w-full py-4 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                        style={{ background: 'linear-gradient(135deg,#f472b6 0%,#ec4899 45%,#db2777 100%)' }}>
                                        {loading
                                            ? <><Loader2 size={16} className="animate-spin" />Resetting...</>
                                            : <><Check size={17} /> Reset Password</>
                                        }
                                    </button>
                                </form>
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
