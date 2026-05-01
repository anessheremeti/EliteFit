import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({ children, backTo = '/' }) {
  return (
    <div className="min-h-screen flex" style={{ background: '#1A1C1E', fontFamily: 'Inter, sans-serif' }}>

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at top left, rgba(79,195,247,0.12) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(240,98,146,0.08) 0%, transparent 60%)'
        }} />

        <Link to="/" className="flex items-center gap-2 z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base"
            style={{ background: 'linear-gradient(135deg, #4FC3F7, #F06292)' }}>E</div>
          <span className="text-white font-bold text-xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>EliteFit</span>
        </Link>

        <div className="z-10 space-y-6">
          <h2 className="text-5xl font-bold text-white leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Train Smart.<br /><span style={{ color: '#4FC3F7' }}>Live Elite.</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Your personalized fitness journey starts here. AI-powered workouts, expert nutrition, and a community that pushes you forward.
          </p>
          <div className="flex gap-10 pt-4">
            {[['50K+', 'Active Members'], ['500+', 'Trainers'], ['10K+', 'Workouts']].map(([num, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold" style={{ color: '#4FC3F7', fontFamily: 'Space Grotesk, sans-serif' }}>{num}</div>
                <div className="text-gray-500 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-700 text-sm z-10">© 2026 EliteFit. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #4FC3F7, #F06292)' }}>E</div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>EliteFit</span>
          </Link>

          <Link to={backTo} className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors mb-8 text-sm">
            <ArrowLeft size={15} /> Back to home
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}
