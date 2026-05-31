import { Bell, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NotificationsEmptyState } from './components/NotificationsEmptyState';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-5 mt-12 md:mt-0">

        {/* Page header */}
        <div className="mb-6 space-y-4">
          <Link
            to="/users"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-dark/40 hover:text-sky transition-colors group"
          >
            <ArrowLeft
              size={13}
              className="transition-transform duration-150 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky/10 flex items-center justify-center shrink-0">
              <Bell size={20} className="text-sky" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-dark leading-tight">
                Notifications
              </h1>
              <p className="text-xs text-dark/40">Stay up to date</p>
            </div>
          </div>
        </div>

        {/*
          Notification list will be rendered here once the backend
          notification system is integrated. Each item can use the
          NotificationItem and NotificationGroup components already
          defined in ./components/.
        */}
        <NotificationsEmptyState />

        <div className="h-10" />
      </div>
    </div>
  );
}
