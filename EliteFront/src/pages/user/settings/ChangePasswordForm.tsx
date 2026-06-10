import { useState, useId } from 'react';
import { useForm, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import UserProfileService from '../../../api/user/userProfile/userProfile';

/* ─────────────────────────────────────────────
   Schema & Types
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
   Password Field Component
───────────────────────────────────────────── */
interface PasswordFieldProps {
  id: string;
  label: string;
  registration: UseFormRegister<ChangePasswordValues>;
  fieldName: keyof ChangePasswordValues;
  error?: string;
}

const PasswordField = ({ id, label, registration, fieldName, error }: PasswordFieldProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <input
          {...registration(fieldName)}
          type={visible ? 'text' : 'password'}
          id={id}
          className={`w-full rounded-xl border p-2.5 pl-9 text-sm ${error ? 'border-red-300' : 'border-slate-200'}`}
        />
        <button type="button" onClick={() => setVisible(!visible)} className="absolute right-3 top-3 text-slate-400">
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const ChangePasswordForm = () => {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const formId = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ChangePasswordValues) => {
    setSubmitStatus('idle');
    try {
      await UserProfileService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      
      setSubmitStatus('success');
      reset();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setErrorMessage(err.response?.data?.message || "Failed to update password.");
      setSubmitStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitStatus === 'success' && (
        <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <ShieldCheck /> Password updated successfully.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle /> {errorMessage}
        </div>
      )}

      <PasswordField id={`${formId}-current`} label="Current Password" fieldName="currentPassword" registration={register} error={errors.currentPassword?.message} />
      <PasswordField id={`${formId}-new`} label="New Password" fieldName="newPassword" registration={register} error={errors.newPassword?.message} />
      <PasswordField id={`${formId}-confirm`} label="Confirm Password" fieldName="confirmPassword" registration={register} error={errors.confirmPassword?.message} />

      <button
        type="submit"
        disabled={!isValid || isSubmitting || !isDirty}
        className="w-full flex justify-center gap-2 px-6 py-2.5 bg-[#0f172a] text-white rounded-xl hover:bg-slate-800 disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Update Password"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;