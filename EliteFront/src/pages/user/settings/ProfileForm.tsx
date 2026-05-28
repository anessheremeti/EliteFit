import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Loader2, CheckCircle } from 'lucide-react';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(300, 'Bio must be under 300 characters').optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const STORAGE_KEY = 'elitefit_user';

const ProfileForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: '', email: '', bio: '' },
  });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const stored = JSON.parse(raw);
      reset({
        full_name: stored.fullName ?? '',
        email: stored.email ?? '',
        bio: stored.bio ?? '',
      });
    } catch {
      // corrupted storage — leave defaults
    }
  }, [reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const raw = localStorage.getItem(STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...existing, fullName: data.full_name, email: data.email, bio: data.bio }),
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="full_name" className="text-sm font-semibold text-slate-700">
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            {...register('full_name')}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
            placeholder="Your full name"
          />
          {errors.full_name && (
            <p className="text-xs text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-slate-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all"
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-semibold text-slate-700">
          Bio
        </label>
        <textarea
          id="bio"
          {...register('bio')}
          rows={4}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all resize-none"
          placeholder="Tell us a bit about yourself..."
        />
        {errors.bio && (
          <p className="text-xs text-red-500">{errors.bio.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-4 pt-4">
        {isSubmitSuccessful && (
          <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium animate-in fade-in slide-in-from-right-4">
            <CheckCircle size={16} />
            Changes saved successfully
          </span>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#0f172a] text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
