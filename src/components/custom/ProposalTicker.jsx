import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, ArrowDown, Clock } from 'lucide-react';

const PROPOSALS = [
  { id: 'PROP-0412', title: 'Reduce event listing fee from 2% to 1.5%', for: 8432, against: 1204, status: 'active', time: '2d 14h' },
  { id: 'PROP-0411', title: 'Fund Berlin community center renovation', for: 6781, against: 2103, status: 'active', time: '4d 02h' },
  { id: 'PROP-0410', title: 'Adopt EIP-712 signed RSVPs for gas-free check-in', for: 11203, against: 412, status: 'passed', time: 'ended' },
  { id: 'PROP-0409', title: 'Elect three new moderators for adult-only spaces', for: 7234, against: 1882, status: 'active', time: '6d 11h' },
  { id: 'PROP-0408', title: 'Treasury allocation: $42k to open-source contributors', for: 9412, against: 731, status: 'passed', time: 'ended' },
  { id: 'PROP-0407', title: 'Add Spanish language as official platform locale', for: 5621, against: 234, status: 'passed', time: 'ended' },
  { id: 'PROP-0406', title: 'Mandate on-chain attestation for organizer reputation', for: 4231, against: 3892, status: 'active', time: '1d 03h' },
];

export default function ProposalTicker() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % PROPOSALS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const visible = [PROPOSALS[idx], PROPOSALS[(idx + 1) % PROPOSALS.length], PROPOSALS[(idx + 2) % PROPOSALS.length]];

  return (
    <div id="proposal-ticker" className="relative border border-paper/10 bg-ash/50 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-ash to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-ash to-transparent z-10 pointer-events-none" />
      <div className="px-6 py-4 border-b border-paper/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-spark animate-pulse" />
          <span className="text-lg font-mono uppercase tracking-widest text-spark">Live proposals</span>
        </div>
        <span className="text-lg font-mono text-paper/40">{PROPOSALS.length} active</span>
      </div>
      <div className="relative h-[280px] overflow-hidden">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => {
            const pct = (p.for / (p.for + p.against)) * 100;
            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: i === 0 ? 1 : 0.5 - i * 0.2, y: i * 90 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
                className="absolute inset-x-0 px-6 py-4 border-b border-paper/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-mono text-signal">{p.id}</span>
                      <span className={`text-lg font-mono uppercase px-2 py-0.5 ${
                        p.status === 'active' ? 'bg-spark/10 text-spark' : 'bg-signal/10 text-signal'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-lg text-paper font-extralight leading-snug">{p.title}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg text-paper/60">
                      <Clock size={14} /> {p.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 h-1 bg-paper/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full bg-spark"
                    />
                  </div>
                  <span className="text-lg font-mono text-paper/60">{Math.round(pct)}% YES</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
