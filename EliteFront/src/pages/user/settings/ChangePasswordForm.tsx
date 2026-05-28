import { useState, useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Loader2, CheckCircle2, XCircle, ShieldCheck, AlertCircle } from 'lucide-react';

/* ─────────────────────────────────────────────
   Schema
───────────────────────────────────────────── */
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine(data => data.newPassword !== data.currentPassword, {
    message: 'New password must differ from current password',
    path: ['newPassword'],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

/* ─────────────────────────────────────────────
   Password strength
───────────────────────────────────────────── */
type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

interface StrengthResult {
  level: StrengthLevel;
  score: number;
  label: string;
  color: string;
  trackColor: string;
}

function getStrength(password: string): StrengthResult {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: 'weak',   score, label: 'Weak',   color: 'bg-red-500',     trackColor: 'text-red-500' };
  if (score === 2) return { level: 'fair',   score, label: 'Fair',   color: 'bg-amber-400',   trackColor: 'text-amber-500' };
  if (score === 3) return { level: 'good',   score, label: 'Good',   color: 'bg-sky-500',     trackColor: 'text-sky-500' };
  return             { level: 'strong', score, label: 'Strong', color: 'bg-emerald-500', trackColor: 'text-emerald-600' };
}

interface Requirement {
  label: string;
  met: (pw: string) => boolean;
}

const REQUIREMENTS: Requirement[] = [
  { label: 'At least 8 characters',    met: pw => pw.length >= 8 },
  { label: 'One uppercase letter (A–Z)', met: pw => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter (a–z)', met: pw => /[a-z]/.test(pw) },
  { label: 'One number (0–9)',           met: pw => /[0-9]/.test(pw) },
  { label: 'One special character',      met: pw => /[^A-Za-z0-9]/.test(pw) },
];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  registration: ReturnType<typeof useForm<ChangePasswordValues>>['register'];
  fieldName: keyof ChangePasswordValues;
  error?: string;
  hint?: string;
  autoComplete?: string;
}

function PasswordField({
  id,
  label,
  placeholder,
  registration,
  fieldName,
  error,
  hint,
  autoComplete = 'current-password',
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-error`;
  const hintId  = `${id}-hint`;

  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <Lock size={15} className="text-slate-400" aria-hidden="true" />
        </div>

        <input
          type={visible ? 'text' : 'password'}
          id={id}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          {...registration(fieldName)}
          className={[
            'w-full rounded-xl border py-2.5 pl-9 pr-11 text-sm bg-slate-50 transition-all',
            'focus:outline-none focus:ring-2',
            'placeholder:text-slate-400',
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20'
              : 'border-slate-200 focus:border-[#0ea5e9] focus:ring-[#0ea5e9]/20',
          ].join(' ')}
        />

        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9] focus-visible:ring-offset-1 rounded-r-xl"
        >
          {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
        </button>
      </div>

      {hint && !error && (
        <p id={hintId} className="text-xs text-slate-400">{hint}</p>
      )}

      {error && (
        <p id={errorId} role="alert" className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Strength meter ── */
interface StrengthMeterProps {
  password: string;
}

function StrengthMeter({ password }: StrengthMeterProps) {
  if (!password) return null;

  const { score, label, color, trackColor } = getStrength(password);
  const percentage = (score / 4) * 100;

  return (
    <div className="space-y-2 pt-1">
      <div
        role="meter"
        aria-label="Password strength"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuetext={label}
        className="flex gap-1"
      >
        {[1, 2, 3, 4].map(segment => (
          <div
            key={segment}
            className={[
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              score >= segment ? color : 'bg-slate-200',
            ].join(' ')}
          />
        ))}
      </div>
      <p className={`text-xs font-semibold ${trackColor}`} aria-live="polite">
        {label} password
      </p>
    </div>
  );
}

/* ── Requirements list ── */
interface RequirementsListProps {
  password: string;
}

function RequirementsList({ password }: RequirementsListProps) {
  return (
    <ul
      aria-label="Password requirements"
      className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1"
    >
      {REQUIREMENTS.map(req => {
        const met = password.length > 0 && req.met(password);
        const pending = password.length === 0;
        return (
          <li
            key={req.label}
            className={[
              'flex items-center gap-2 text-xs transition-colors',
              pending ? 'text-slate-400' : met ? 'text-emerald-600' : 'text-red-500',
            ].join(' ')}
          >
            {pending ? (
              <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" aria-hidden="true" />
            ) : met ? (
              <CheckCircle2 size={14} className="shrink-0" aria-hidden="true" />
            ) : (
              <XCircle size={14} className="shrink-0" aria-hidden="true" />
            )}
            <span>{req.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

/* ─────────────────────────────────────────────
   Main form
───────────────────────────────────────────── */
type SubmitStatus = 'idle' | 'success' | 'error';

const ChangePasswordForm: React.FC = () => {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const formId = useId();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const newPassword = watch('newPassword') ?? '';

  const onSubmit = async (_data: ChangePasswordValues) => {
    setSubmitStatus('idle');
    try {
      // Simulated API call — replace with real PATCH /api/auth/change-password
      await new Promise<void>((resolve, reject) =>
        setTimeout(() => {
          // Simulate ~90% success rate for realistic demo
          Math.random() > 0.1 ? resolve() : reject(new Error('Incorrect current password'));
        }, 900),
      );
      setSubmitStatus('success');
      reset();
    } catch {
      setSubmitStatus('error');
    }
  };

  const canSubmit = isValid && isDirty && !isSubmitting;

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Change password"
      className="space-y-6"
    >
      {/* Status banners */}
      {submitStatus === 'success' && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm"
        >
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
          <div>
            <p className="font-semibold text-emerald-800">Password updated</p>
            <p className="text-emerald-700">Your password has been changed successfully.</p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" aria-hidden="true" />
          <div>
            <p className="font-semibold text-red-800">Incorrect current password</p>
            <p className="text-red-700">Please check your current password and try again.</p>
          </div>
        </div>
      )}

      {/* Current password */}
      <PasswordField
        id={`${formId}-current`}
        label="Current Password"
        placeholder="Enter your current password"
        registration={register}
        fieldName="currentPassword"
        error={errors.currentPassword?.message}
        autoComplete="current-password"
      />

      {/* New password + strength meter + requirements */}
      <fieldset className="space-y-3 border-0 p-0 m-0 mb-3.5">
        <legend className="sr-only">New password criteria</legend>

        <PasswordField
          id={`${formId}-new`}
          label="New Password"
          placeholder="Create a strong password"
          registration={register}
          fieldName="newPassword"
          error={errors.newPassword?.message}
          autoComplete="new-password"
        />

        <StrengthMeter password={newPassword} />
        <RequirementsList password={newPassword} />
      </fieldset>

      {/* Confirm password */}
      <PasswordField
        id={`${formId}-confirm`}
        label="Confirm New Password"
        placeholder="Re-enter your new password"
        registration={register}
        fieldName="confirmPassword"
        error={errors.confirmPassword?.message}
        autoComplete="new-password"
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <button
          type="button"
          onClick={() => { reset(); setSubmitStatus('idle'); }}
          disabled={!isDirty || isSubmitting}
          className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors focus:outline-none focus-visible:underline"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!canSubmit}
          aria-disabled={!canSubmit}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0f172a] text-white text-sm font-bold rounded-xl hover:bg-slate-800 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9] focus-visible:ring-offset-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              Updating…
            </>
          ) : (
            <>
              <ShieldCheck size={16} aria-hidden="true" />
              Update Password
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
