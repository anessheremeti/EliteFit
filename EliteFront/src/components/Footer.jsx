import { Dumbbell, Globe, Share2, Video, Users2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const links = {
  Product: ['Features', 'Workouts', 'Trainers', 'Pricing', 'Mobile App'],
  Company: ['About Us', 'Blog', 'Careers', 'Press Kit', 'Affiliates'],
  Support: ['Help Center', 'Community', 'Privacy Policy', 'Terms of Service', 'Contact'],
}
const socials = [
  { Icon: Globe, label: 'Website' },
  { Icon: Share2, label: 'Social' },
  { Icon: Video, label: 'YouTube' },
  { Icon: Users2, label: 'Community' },
]
  const navigate = useNavigate();

  if(links.Company[3] === 'Press Kit') {
    links.Company[3] = <a onClick={() => navigate('/press-kit')}>Press Kit</a>;
  }
 if(links.Company[4] === 'Affiliates') {
    links.Company[4] = <a onClick={() => navigate('/affiliates')}>Affiliates</a>;
  }
  if(links.Product[0] === 'Features') {
    links.Product[0] = <a onClick={() => navigate('/features')}>Features</a>;
  }
  return (
    <footer className="bg-white border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-black/5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="group inline-flex items-center gap-3 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky rounded-lg px-1 -ml-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink to-pink/80 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                <Dumbbell size={20} className="" fill="white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-heading font-bold text-lg text-dark group-hover:text-sky transition-colors duration-300">
                  EliteFit
                </span>
                <span className="font-heading font-bold text-xs text-pink tracking-wider">
                  PRO
                </span>
              </div>
            </a>
            <p className="text-dark/50 text-sm font-sans leading-relaxed max-w-xs">
              The world's most advanced fitness platform, built for athletes who refuse to settle
              for average.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center text-dark/40 hover:text-dark hover:bg-dark/5 transition-colors border border-black/5"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-heading font-bold text-dark text-sm mb-4">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-dark/50 text-sm font-sans hover:text-dark transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-dark/40 text-sm font-sans">
            © 2025 EliteFitPro. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-dark/40 text-sm font-sans hover:text-dark transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
