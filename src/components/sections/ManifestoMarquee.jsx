import React from 'react';
import ScrollVelocity from '@/components/ui/scroll-velocity';

export default function ManifestoMarquee() {
  return (
    <section id="manifesto-marquee" className="relative py-24 md:py-32 bg-ink overflow-hidden border-y border-paper/5">
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(255,92,40,0.15), transparent 60%)',
      }} />

      <div className="max-w-[2400px] mx-auto mb-16 relative">
        <div className="grid grid-cols-12">
          <div className="col-span-12 px-4 md:col-start-2 md:col-span-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-spark" />
              <span className="text-lg font-mono uppercase tracking-widest text-spark">manifesto / 01</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-extralight text-paper leading-tight max-w-3xl">
              We are tired of being the product. We are tired of communities being harvested for engagement metrics.
            </h2>
          </div>
        </div>
      </div>

      <ScrollVelocity
        texts={['COMMUNITY OVER CORPORATE  ◆  ', 'ON-CHAIN OVER OPAQUE  ◆  ', 'OWNERSHIP OVER EXTRACTION  ◆  ']}
        velocity={60}
        className="text-7xl md:text-9xl font-display font-extralight text-paper italic"
      />
    </section>
  );
}
