import React from 'react';
import { motion } from 'motion/react';
import PageHeader from '@/components/PageHeader';
import Timeline from '@/components/ui/timeline';

const PHASES = [
  {
    title: 'Q1 2024',
    content: (
      <div>
        <div className="bg-ash border border-paper/10 p-6 md:p-8 clip-notch-tr">
          <span className="inline-block bg-signal/20 text-signal px-3 py-1 text-lg font-mono mb-4">SHIPPED</span>
          <h4 className="text-2xl md:text-3xl font-display text-paper mb-4">Foundation phase</h4>
          <ul className="space-y-3">
            {['Smart contract suite deployed to testnet', 'Open-source repo public on GitHub', 'First 100 founding members onboarded', 'Discord server with mirrored channel structure'].map((i) => (
              <li key={i} className="text-lg text-paper/70 flex items-start gap-3">
                <span className="text-spark mt-1.5">◆</span> {i}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: 'Q3 2024',
    content: (
      <div>
        <div className="bg-ash border border-paper/10 p-6 md:p-8 clip-notch-tr">
          <span className="inline-block bg-signal/20 text-signal px-3 py-1 text-lg font-mono mb-4">SHIPPED</span>
          <h4 className="text-2xl md:text-3xl font-display text-paper mb-4">Governance live</h4>
          <ul className="space-y-3">
            {['Mainnet launch on Base + Polygon', 'First DAO proposal passed (fee structure)', 'Moderation council elected', 'Treasury contract activated'].map((i) => (
              <li key={i} className="text-lg text-paper/70 flex items-start gap-3">
                <span className="text-spark mt-1.5">◆</span> {i}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: 'Q1 2025',
    content: (
      <div>
        <div className="bg-ash border border-spark p-6 md:p-8 clip-notch-tr">
          <span className="inline-block bg-spark text-ink px-3 py-1 text-lg font-mono mb-4">CURRENT</span>
          <h4 className="text-2xl md:text-3xl font-display text-paper mb-4">Mobile + scale</h4>
          <ul className="space-y-3">
            {['Native iOS and Android apps with full feature parity', 'Hybrid event support (in-person + streaming)', 'Gas-free RSVP via signed messages', 'Multi-language: ES, FR, DE, PT, JA'].map((i) => (
              <li key={i} className="text-lg text-paper/70 flex items-start gap-3">
                <span className="text-spark mt-1.5">◆</span> {i}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: 'Q3 2025',
    content: (
      <div>
        <div className="bg-ash border border-paper/10 p-6 md:p-8 clip-notch-tr">
          <span className="inline-block bg-paper/10 text-paper/60 px-3 py-1 text-lg font-mono mb-4">VOTED FOR</span>
          <h4 className="text-2xl md:text-3xl font-display text-paper mb-4">Trust infrastructure</h4>
          <ul className="space-y-3">
            {['On-chain reputation scoring for organizers', 'Tiered safety verification (ZK age proofs)', 'Appeals jury system live', 'Integration with self-sovereign identity providers'].map((i) => (
              <li key={i} className="text-lg text-paper/70 flex items-start gap-3">
                <span className="text-spark mt-1.5">◆</span> {i}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: 'Q4 2025+',
    content: (
      <div>
        <div className="bg-ash border border-paper/10 p-6 md:p-8 clip-notch-tr">
          <span className="inline-block bg-paper/10 text-paper/60 px-3 py-1 text-lg font-mono mb-4">PROPOSED</span>
          <h4 className="text-2xl md:text-3xl font-display text-paper mb-4">Community-decided</h4>
          <ul className="space-y-3">
            {['Roadmap from this point forward is voted by the DAO', 'No fixed corporate roadmap', 'Members propose, members decide', 'Open-source forks welcome'].map((i) => (
              <li key={i} className="text-lg text-paper/70 flex items-start gap-3">
                <span className="text-spark mt-1.5">◆</span> {i}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
];

export default function Roadmap() {
  return (
    <div id="page-roadmap">
      <PageHeader
        label="roadmap / community-decided"
        title="The plan, then"
        italic="the community."
        description="Core team set the foundation. Past Q2 2025, the DAO writes the roadmap. Vote on what we build next."
      />

      <section id="roadmap-timeline" className="relative py-16 md:py-24 bg-ink overflow-hidden">
        <div className="hidden lg:block absolute right-8 top-32 -rotate-90 origin-top-right z-10 pointer-events-none">
          <span className="text-lg font-mono uppercase tracking-[0.3em] text-paper/15">v0 → v∞</span>
        </div>

        <div className="max-w-[2400px] mx-auto">
          <div className="grid grid-cols-12">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-10">
              <Timeline data={PHASES} />
            </div>
          </div>
        </div>
      </section>

      <section id="roadmap-handoff" className="py-24 md:py-32 bg-paper text-ink relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[40vw] h-[40vw] opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" fill="none" stroke="#0A0A0F" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="max-w-[2400px] mx-auto relative">
          <div className="grid grid-cols-12">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-9">
              <motion.div
                initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
                whileInView={{ opacity: 1, rotate: -3, scale: 1 }}
                viewport={{ once: true }}
                className="inline-block bg-ink text-paper px-4 py-1.5 text-lg font-mono uppercase tracking-wider mb-10"
              >
                ◆ the handoff
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-display font-extralight leading-[1.05] mb-8">
                The core team builds itself <span className="italic font-editorial text-spark">out of the loop.</span>
              </h2>
              <p className="text-xl md:text-2xl font-editorial text-ink/70 leading-relaxed max-w-3xl">
                By Q4 2025, all major decisions are voted by the DAO. The original contributors hold no special voting weight. The platform belongs to whoever shows up.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
