import { motion } from 'framer-motion';
import { User, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SettingsSection from './SettingsSection';
import ProfileForm from './ProfileForm';
import ChangePasswordForm from './ChangePasswordForm';

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  }),
};

const AccountSettings = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 mt-12 md:mt-0">
      <div className="max-w-3xl mx-auto">

        {/* Page header */}
        <div className="mb-10">
          <Link
            to="/users"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0ea5e9] transition-colors mb-5 group focus:outline-none focus-visible:underline"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-1"
              aria-hidden="true"
            />
            <span className="text-sm font-semibold">Back to Dashboard</span>
          </Link>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Account Settings
          </h1>
          <p className="mt-2 text-slate-500">
            Manage your personal information and account security.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <motion.div
            custom={0}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <SettingsSection
              title="Personal Information"
              description="Update your name, email address, and bio."
              icon={<User size={18} aria-hidden="true" />}
            >
              <ProfileForm />
            </SettingsSection>
          </motion.div>

          <motion.div
            custom={1}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <SettingsSection
              title="Change Password"
              description="Keep your account secure with a strong, unique password."
              icon={<ShieldCheck size={18} aria-hidden="true" />}
            >
              <ChangePasswordForm />
            </SettingsSection>
          </motion.div>

          {/* Danger zone */}
          <motion.div
            custom={2}
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 sm:p-8">
              <h3 className="text-base font-bold text-red-900">Danger Zone</h3>
              <p className="mt-1 text-sm text-red-600/80">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                type="button"
                className="mt-5 px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
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
