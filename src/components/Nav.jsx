import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/groups', label: 'Groups' },
  { to: '/safety', label: 'Safety' },
  { to: '/governance', label: 'Governance' },
  { to: '/roadmap', label: 'Roadmap' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        id="global-nav"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'bg-ink/85 backdrop-blur-md border-b border-white/5' : ''
        }`}
      >
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 via-ink/20 to-transparent pointer-events-none -z-10" />
        <div className="max-w-[2400px] mx-auto">
          <div className="grid grid-cols-12">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-10 flex items-center justify-between py-5">
              <Link to="/" className="flex items-center gap-3 group">
                <svg width="28" height="28" viewBox="0 0 32 32" className="text-spark">
                  <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="none" stroke="currentColor" strokeWidth="2" />
                  <polygon points="16,9 22,12.5 22,19.5 16,23 10,19.5 10,12.5" fill="currentColor" />
                </svg>
                <span className="text-xl font-display font-medium tracking-tight">tokenizable</span>
              </Link>
              <div className="hidden lg:flex items-center gap-8">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                      `text-lg font-extralight tracking-wide transition-colors ${
                        isActive ? 'text-spark' : 'text-paper/70 hover:text-paper'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
                <Link
                  to="/join"
                  className="text-lg bg-spark text-ink px-5 py-2 clip-arrow-r font-medium hover:bg-paper transition-colors"
                >
                  Join DAO
                </Link>
              </div>
              <button
                className="lg:hidden text-paper p-2"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink lg:hidden"
          >
            <div className="flex justify-end p-6">
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={32} className="text-paper" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center gap-8 mt-12">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <NavLink
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `text-3xl font-display font-extralight ${isActive ? 'text-spark' : 'text-paper'}`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <Link
                to="/join"
                onClick={() => setOpen(false)}
                className="mt-8 bg-spark text-ink px-8 py-3 clip-arrow-r text-xl font-medium"
              >
                Join DAO
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
