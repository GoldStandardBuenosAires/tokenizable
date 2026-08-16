import React from 'react';
import { motion } from 'motion/react';
import PageHeader from '@/components/PageHeader';
import VoteWeightSlider from '@/components/custom/VoteWeightSlider';
import ProposalTicker from '@/components/custom/ProposalTicker';
import CountUp from '@/components/ui/count-up';

const DISTRIBUTION = [
  { who: 'Active community members', pct: 60, color: '#FF5C28' },
  { who: 'Treasury reserve', pct: 20, color: '#6B7FFF' },
  { who: 'Core contributors (vested 4yr)', pct: 12, color: '#F5F1E8' },
  { who: 'Early backers (vested 2yr)', pct: 8, color: '#9B59B6' },
];

const LIFECYCLE = [
  { phase: '01', t: 'Proposal drafted', d: 'Any token holder above 1,000 TKN threshold can submit on-chain.' },
  { phase: '02', t: 'Discussion period', d: '5 days of forum debate. Mirrored in Discord and Snapshot.' },
  { phase: '03', t: 'Vote opens', d: 'Quadratic weighting. 7-day window. Minimum 5% turnout required.' },
  { phase: '04', t: 'Execution', d: 'If passed, smart contract executes. No human in the loop.' },
];

export default function Governance() {
  return (
    <div id="page-governance">
      <PageHeader
        label="governance / tokenomics & voting"
        title="On-chain rules,"
        italic="off-chain accountability."
        description="Quadratic voting prevents plutocracy. 60% of tokens go to active members. Every proposal is public. Every vote is auditable."
      />

      {/* Stats */}
      <section id="gov-stats" className="py-16 bg-ink border-b border-paper/10">
        <div className="max-w-[2400px] mx-auto">
          <div className="grid grid-cols-12">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { n: 12847, l: 'Token holders', sep: ',' },
                  { n: 423, l: 'Proposals submitted' },
                  { n: 287, l: 'Proposals passed' },
                  { n: 72, l: 'Avg turnout %', suffix: '%' },
                ].map((s, i) => (
                  <motion.div
                    key={s.l}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="text-4xl md:text-5xl font-display text-paper">
                      <CountUp to={s.n} separator={s.sep || ''} duration={2} />{s.suffix || ''}
                    </div>
                    <div className="text-lg font-mono uppercase tracking-wider text-paper/40 mt-2">{s.l}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Distribution + Slider */}
      <section id="gov-distribution" className="py-24 md:py-32 bg-ink relative overflow-hidden">
        <div className="absolute -bottom-32 -right-32 w-[50vw] h-[50vw] opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-spark">
            <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <polygon points="50,20 76,34 76,66 50,80 24,66 24,34" fill="none" stroke="currentColor" strokeWidth="0.3" />
          </svg>
        </div>

        <div className="max-w-[2400px] mx-auto relative">
          <div className="grid grid-cols-12 gap-y-12 items-start">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-spark" />
                <span className="text-lg font-mono uppercase tracking-widest text-spark">token distribution</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-extralight text-paper leading-[1.05] mb-10">
                Built so the <span className="italic font-editorial text-spark">community wins.</span>
              </h2>
              <div className="space-y-5">
                {DISTRIBUTION.map((d, i) => (
                  <div key={d.who}>
                    <div className="flex justify-between mb-2">
                      <span className="text-lg text-paper">{d.who}</span>
                      <span className="text-lg font-mono text-paper/60">{d.pct}%</span>
                    </div>
                    <div className="h-2 bg-ash">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${d.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.1 }}
                        className="h-full"
                        style={{ backgroundColor: d.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-12 px-4 md:col-start-8 md:col-span-5">
              <VoteWeightSlider />
            </div>
          </div>
        </div>
      </section>

      {/* Lifecycle */}
      <section id="gov-lifecycle" className="py-24 md:py-32 bg-paper text-ink">
        <div className="max-w-[2400px] mx-auto">
          <div className="grid grid-cols-12 mb-16">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-9">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-spark" />
                <span className="text-lg font-mono uppercase tracking-widest text-spark">proposal lifecycle</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-extralight leading-[1.05]">
                From idea to <span className="italic font-editorial text-spark">executed code.</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {LIFECYCLE.map((l, i) => (
                  <motion.div
                    key={l.phase}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="border border-ink/10 p-6 hover:border-spark hover:bg-ink hover:text-paper transition-colors group"
                  >
                    <div className="text-5xl font-display font-extralight text-spark mb-4">{l.phase}</div>
                    <h3 className="text-2xl font-display mb-3">{l.t}</h3>
                    <p className="text-lg font-editorial leading-relaxed opacity-70 group-hover:opacity-90">{l.d}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active proposals */}
      <section id="gov-active" className="py-24 md:py-32 bg-ink relative overflow-hidden">
        <div className="max-w-[2400px] mx-auto">
          <div className="grid grid-cols-12 gap-y-12 items-center">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-5">
              <h2 className="text-4xl md:text-5xl font-display font-extralight text-paper leading-[1.05] mb-8">
                See it <span className="italic font-editorial text-spark">in motion.</span>
              </h2>
              <p className="text-xl font-editorial text-paper/70 leading-relaxed">
                Real proposals being voted on right now. Member-submitted. Member-decided. Auto-executed when they pass.
              </p>
            </div>
            <div className="col-span-12 px-4 md:col-start-8 md:col-span-5">
              <ProposalTicker />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
