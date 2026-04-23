import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const API_URL = 'http://localhost:5193/api';

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function validate(form) {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = 'First name is required.';
  else if (form.firstName.length > 50) errors.firstName = 'Maximum 50 characters.';
  if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
  else if (form.lastName.length > 50) errors.lastName = 'Maximum 50 characters.';
  if (!form.email) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (!form.password) errors.password = 'Password is required.';
  else if (form.password.length < 8) errors.password = 'At least 8 characters required.';
  else if (!/[A-Z]/.test(form.password)) errors.password = 'Must contain an uppercase letter.';
  else if (!/[a-z]/.test(form.password)) errors.password = 'Must contain a lowercase letter.';
  else if (!/\d/.test(form.password)) errors.password = 'Must contain a number.';
  if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password.';
  else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  return errors;
}

export default function SignupPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  function change(field, value) {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: validate(updated)[field] }));
    }
  }

  function blur(field) {
    setTouched(prev => ({ ...prev, [field]: true }));
    setFieldErrors(prev => ({ ...prev, [field]: validate(form)[field] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const allTouched = { firstName: true, lastName: true, email: true, password: true, confirmPassword: true };
    setTouched(allTouched);
    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    setServerError('');
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed.');
      localStorage.setItem('token', data.token);
      localStorage.setItem('elitefit_user', JSON.stringify({ email: data.email, fullName: data.fullName }));
      setSuccess('Account created! Redirecting...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const strengthScore = getPasswordStrength(form.password);
  const strengthLabels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#4FC3F7'];

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Create your account
      </h1>
      <p className="text-gray-500 text-sm mb-8">Join thousands of members transforming their lives.</p>

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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name" value={form.firstName}
            onChange={e => change('firstName', e.target.value)} onBlur={() => blur('firstName')}
            error={touched.firstName ? fieldErrors.firstName : undefined} placeholder="John" />
          <Field label="Last Name" value={form.lastName}
            onChange={e => change('lastName', e.target.value)} onBlur={() => blur('lastName')}
            error={touched.lastName ? fieldErrors.lastName : undefined} placeholder="Doe" />
        </div>

        <Field label="Email" type="email" value={form.email}
          onChange={e => change('email', e.target.value)} onBlur={() => blur('email')}
          error={touched.email ? fieldErrors.email : undefined} placeholder="you@example.com" />

        <div>
          <Field label="Password" type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={e => change('password', e.target.value)} onBlur={() => blur('password')}
            error={touched.password ? fieldErrors.password : undefined} placeholder="Min. 8 characters"
            right={
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="text-gray-500 hover:text-gray-300 transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            } />
          {form.password && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{ background: i <= strengthScore ? strengthColors[strengthScore] : 'rgba(255,255,255,0.08)' }} />
                ))}
              </div>
              <span className="text-xs" style={{ color: strengthColors[strengthScore] || '#6b7280' }}>
                {strengthLabels[strengthScore]}
              </span>
            </div>
          )}
        </div>

        <Field label="Confirm Password" type={showConfirm ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={e => change('confirmPassword', e.target.value)} onBlur={() => blur('confirmPassword')}
          error={touched.confirmPassword ? fieldErrors.confirmPassword : undefined} placeholder="Repeat your password"
          right={
            <button type="button" onClick={() => setShowConfirm(v => !v)}
              className="text-gray-500 hover:text-gray-300 transition-colors">
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          } />

        <SubmitBtn loading={loading} label="Create Account" />
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold transition-colors hover:opacity-80" style={{ color: '#4FC3F7' }}>
          Sign in
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
