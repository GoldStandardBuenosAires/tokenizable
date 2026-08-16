import React from 'react';
import LogoLoop from '@/components/ui/logo-loop';

const TECH = [
  { node: <span className="text-lg font-mono text-paper/60">ETHEREUM</span> },
  { node: <span className="text-lg font-mono text-paper/60">POLYGON</span> },
  { node: <span className="text-lg font-mono text-paper/60">BASE</span> },
  { node: <span className="text-lg font-mono text-paper/60">IPFS</span> },
  { node: <span className="text-lg font-mono text-paper/60">ARWEAVE</span> },
  { node: <span className="text-lg font-mono text-paper/60">SNAPSHOT</span> },
  { node: <span className="text-lg font-mono text-paper/60">SAFE.GLOBAL</span> },
  { node: <span className="text-lg font-mono text-paper/60">DISCORD</span> },
  { node: <span className="text-lg font-mono text-paper/60">GITHUB</span> },
  { node: <span className="text-lg font-mono text-paper/60">NEXT.JS</span> },
  { node: <span className="text-lg font-mono text-paper/60">RUST</span> },
  { node: <span className="text-lg font-mono text-paper/60">WAGMI</span> },
];

export default function TechStackMarquee() {
  return (
    <section id="tech-stack" className="py-16 bg-ink border-y border-paper/5">
      <div className="max-w-[2400px] mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-lg font-mono uppercase tracking-widest text-paper/40">built on open protocols</span>
        </div>
        <LogoLoop logos={TECH} speed={40} gap={64} logoHeight={20} />
      </div>
    </section>
  );
}
