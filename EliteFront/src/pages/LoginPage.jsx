import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const API_URL = 'http://localhost:5193/api';

function validate(email, password) {
  const errors = {};
  if (!email) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Password is required.';
  return errors;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(email, password);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setServerError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed.');
      localStorage.setItem('token', data.token);
      localStorage.setItem('elitefit_user', JSON.stringify({ email: data.email, fullName: data.fullName }));
      setSuccess('Logged in successfully! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Welcome back
      </h1>
      <p className="text-gray-500 text-sm mb-8">Sign in to continue your fitness journey.</p>

      <AnimatePresence>
        {serverError && (
          <motion.div key="error"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 p-3 rounded-lg mb-5 text-sm"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
            <X size={14} className="shrink-0" />{serverError}
          </motion.div>
        )}
        {success && (
          <motion.div key="success"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 p-3 rounded-lg mb-5 text-sm"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#86efac' }}>
            <Check size={14} className="shrink-0" />{success}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Email" type="email" value={email}
          onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: '' })); }}
          error={errors.email} placeholder="you@example.com" />

        <Field label="Password" type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: '' })); }}
          error={errors.password} placeholder="Enter your password"
          right={
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="text-gray-500 hover:text-gray-300 transition-colors">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          } />

        <SubmitBtn loading={loading} label="Sign In" />
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-semibold transition-colors hover:opacity-80" style={{ color: '#4FC3F7' }}>
          Sign up free
        </Link>
      </p>
    </AuthLayout>
  );
}

function Field({ label, error, right, ...props }) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
        style={{ color: '#6b7280', fontFamily: 'Space Grotesk, sans-serif' }}>
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          onFocus={e => { setFocused(true); props.onFocus?.(e); }}
          onBlur={e => { setFocused(false); props.onBlur?.(e); }}
          className="w-full rounded-lg text-sm text-white outline-none transition-all duration-150"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: focused
              ? `1px solid ${hasError ? 'rgba(239,68,68,0.7)' : '#4FC3F7'}`
              : `1px solid ${hasError ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
            boxShadow: focused ? `0 0 0 3px ${hasError ? 'rgba(239,68,68,0.08)' : 'rgba(79,195,247,0.08)'}` : 'none',
            padding: right ? '10px 40px 10px 12px' : '10px 12px',
          }}
        />
        {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}
            className="text-xs mt-1.5" style={{ color: '#fca5a5' }}>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubmitBtn({ loading, label }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full py-2.5 rounded-lg font-bold text-white text-sm transition-all duration-200 flex items-center justify-center gap-2"
      style={{
        background: loading ? 'rgba(79,195,247,0.4)' : 'linear-gradient(135deg, #4FC3F7, #38b2e8)',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontFamily: 'Space Grotesk, sans-serif'
      }}>
      {loading ? <><Loader2 size={16} className="animate-spin" />Please wait...</> : label}
    </button>
  );
}
