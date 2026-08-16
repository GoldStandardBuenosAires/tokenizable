import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="global-footer" className="relative bg-ink border-t border-white/5 overflow-hidden">
      <div className="absolute -top-32 -right-20 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-spark">
          <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <polygon points="50,20 76,34 76,66 50,80 24,66 24,34" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <polygon points="50,38 60,44 60,56 50,62 40,56 40,44" fill="currentColor" />
        </svg>
      </div>
      <div className="max-w-[2400px] mx-auto relative">
        <div className="grid grid-cols-12 py-20">
          <div className="col-span-12 px-4 md:col-start-2 md:col-span-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-5">
                <div className="flex items-center gap-3 mb-6">
                  <svg width="32" height="32" viewBox="0 0 32 32" className="text-spark">
                    <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="none" stroke="currentColor" strokeWidth="2" />
                    <polygon points="16,9 22,12.5 22,19.5 16,23 10,19.5 10,12.5" fill="currentColor" />
                  </svg>
                  <span className="text-2xl font-display font-medium">tokenizable</span>
                </div>
                <p className="text-lg font-editorial text-paper/60 max-w-md leading-relaxed">
                  Communities owned by the people who show up — not the people who funded a Series B.
                </p>
                <div className="flex gap-4 mt-8">
                  <a href="https://discord.gg" target="_blank" rel="noreferrer" className="w-12 h-12 border border-paper/20 flex items-center justify-center hover:border-spark hover:text-spark transition-colors">
                    <MessageCircle size={20} />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-12 h-12 border border-paper/20 flex items-center justify-center hover:border-spark hover:text-spark transition-colors">
                    <Twitter size={20} />
                  </a>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="w-12 h-12 border border-paper/20 flex items-center justify-center hover:border-spark hover:text-spark transition-colors">
                    <Github size={20} />
                  </a>
                </div>
              </div>
              <div className="md:col-span-3">
                <p className="text-lg font-mono uppercase text-spark/80 tracking-widest mb-5">Platform</p>
                <ul className="space-y-3">
                  <li><Link to="/groups" className="text-lg text-paper/70 hover:text-paper transition-colors">Groups</Link></li>
                  <li><Link to="/how-it-works" className="text-lg text-paper/70 hover:text-paper transition-colors">How it works</Link></li>
                  <li><Link to="/safety" className="text-lg text-paper/70 hover:text-paper transition-colors">Safety</Link></li>
                  <li><Link to="/governance" className="text-lg text-paper/70 hover:text-paper transition-colors">Governance</Link></li>
                </ul>
              </div>
              <div className="md:col-span-4">
                <p className="text-lg font-mono uppercase text-spark/80 tracking-widest mb-5">DAO</p>
                <ul className="space-y-3">
                  <li><Link to="/roadmap" className="text-lg text-paper/70 hover:text-paper transition-colors">Roadmap</Link></li>
                  <li><Link to="/join" className="text-lg text-paper/70 hover:text-paper transition-colors">Join the DAO</Link></li>
                  <li><a href="#" className="text-lg text-paper/70 hover:text-paper transition-colors">Treasury reports</a></li>
                  <li><a href="#" className="text-lg text-paper/70 hover:text-paper transition-colors">Open source repo</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 py-5">
          <div className="grid grid-cols-12">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <p className="text-lg text-paper/40 font-mono">© {new Date().getFullYear()} Tokenizable DAO</p>
              <p className="text-lg text-paper/40">
                AI vibe coded development by{' '}
                <a href="https://biela.dev/" target="_blank" rel="noreferrer" className="text-paper/70 hover:text-spark transition-colors underline-offset-4 hover:underline">Biela.dev</a>
                , powered by{' '}
                <a href="https://teachmecode.ae/" target="_blank" rel="noreferrer" className="text-paper/70 hover:text-spark transition-colors underline-offset-4 hover:underline">TeachMeCode® Institute</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
