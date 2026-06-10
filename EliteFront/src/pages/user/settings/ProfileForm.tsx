import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import UserProfileService from '../../../api/user/userProfile/userProfile';

// Schema tani i ka te ndara
const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  // Përshtatur për të pranuar FirstName dhe LastName nga API
  initialData?: { firstName: string; lastName: string; email: string } | null;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: '', lastName: '', email: '' },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Dërgojmë objektin siç e pret API yt (FirstName, LastName, Email)
      await UserProfileService.updateProfile(data);
    } catch (error) {
      console.error("Gabim:", error);
      alert("Dështoi përditësimi.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">First Name</label>
          <input
            {...register('firstName')}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
          />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Last Name</label>
          <input
            {...register('lastName')}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
          />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Email Address</label>
        <input
          {...register('email')}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="flex items-center justify-end gap-4 pt-4">
        {isSubmitSuccessful && (
          <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
            <CheckCircle size={16} /> Saved
          </span>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-[#0f172a] text-white font-bold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;