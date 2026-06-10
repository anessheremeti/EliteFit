import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SettingsSection from './SettingsSection';
import ProfileForm from './ProfileForm';
import ChangePasswordForm from './ChangePasswordForm';
import UserProfileService from '../../../api/user/userProfile/userProfile'; // Shërbimi që krijuam

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  }),
};

const AccountSettings = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Ngarko profilin nga backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await UserProfileService.getProfile();
        setUserProfile(data);
      } catch (error) {
        console.error("Gabim në marrjen e profilit", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleDeleteAccount = async () => {
    if (window.confirm("A jeni i sigurt që dëshironi ta fshini llogarinë? Ky veprim është i pakthyeshëm!")) {
      try {
        await UserProfileService.deleteAccount();
        localStorage.removeItem('token'); // Pastro token
        navigate('/login'); // Ridrejto në login
      } catch (error) {
        alert("Gabim gjatë fshirjes së llogarisë: " + (error.response?.data?.message || "Ndodhi një gabim"));
      }
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 mt-12 md:mt-0">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <Link to="/users" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0ea5e9] transition-colors mb-5 group">
            <ArrowLeft size={16} />
            <span className="text-sm font-semibold">Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">Account Settings</h1>
          <p className="mt-2 text-slate-500">Manage your personal information and account security.</p>
        </div>

        <div className="space-y-6">
          {/* Personal Information Section */}
          <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible">
            <SettingsSection title="Personal Information" description="Update your name, email address." icon={<User size={18} />}>
              {/* I kalojmë userProfile si props nëse formës i duhen vlerat fillestare */}
              <ProfileForm initialData={userProfile} />
            </SettingsSection>
          </motion.div>

          {/* Password Section */}
          <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible">
            <SettingsSection title="Change Password" description="Keep your account secure." icon={<ShieldCheck size={18} />}>
              <ChangePasswordForm />
            </SettingsSection>
          </motion.div>

          {/* Danger zone */}
          <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible">
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 sm:p-8">
              <h3 className="text-base font-bold text-red-900">Danger Zone</h3>
              <p className="mt-1 text-sm text-red-600/80">Once you delete your account, there is no going back.</p>
              <button
                onClick={handleDeleteAccount}
                type="button"
                className="mt-5 px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 active:scale-95 transition-all"
              >
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;