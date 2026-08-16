import React from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import CountUp from '@/components/ui/count-up';

const ALLOCATIONS = [
  { label: 'Moderation council', pct: 28, color: '#FF5C28' },
  { label: 'Open-source grants', pct: 22, color: '#6B7FFF' },
  { label: 'Community events fund', pct: 20, color: '#F5F1E8' },
  { label: 'Infrastructure (RPC/IPFS)', pct: 15, color: '#9B59B6' },
  { label: 'Legal defense reserve', pct: 10, color: '#FFB627' },
  { label: 'Bug bounties', pct: 5, color: '#27AE60' },
];

export default function TreasuryGauge() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div id="treasury-gauge" ref={ref} className="bg-ash border border-paper/10 p-8 md:p-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-2 h-2 bg-spark animate-pulse" />
        <span className="text-lg font-mono uppercase tracking-widest text-spark">Treasury health</span>
      </div>
      <div className="flex items-baseline gap-3 mb-12">
        <span className="text-5xl md:text-7xl font-display text-paper">
          $<CountUp to={1247832} separator="," duration={2.5} />
        </span>
        <span className="text-lg font-mono text-paper/40">USDC equivalent</span>
      </div>

      <div className="space-y-5">
        {ALLOCATIONS.map((a, i) => (
          <div key={a.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg text-paper/80">{a.label}</span>
              <span className="text-lg font-mono text-paper/60">{a.pct}%</span>
            </div>
            <div className="h-2 bg-ink overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${a.pct}%` } : { width: 0 }}
                transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: [0.65, 0, 0.35, 1] }}
                className="h-full"
                style={{ backgroundColor: a.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t border-paper/10 grid grid-cols-2 gap-6">
        <div>
          <div className="text-lg font-mono uppercase tracking-wider text-paper/40 mb-2">last quarter</div>
          <div className="text-2xl font-display text-paper">+$184,302</div>
        </div>
        <div>
          <div className="text-lg font-mono uppercase tracking-wider text-paper/40 mb-2">runway</div>
          <div className="text-2xl font-display text-spark">∞ self-sustaining</div>
        </div>
      </div>
    </div>
  );
}
