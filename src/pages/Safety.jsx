import React from 'react';
import { motion } from 'motion/react';
import { Shield, Users, FileText, Scale } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SafetyTierGate from '@/components/custom/SafetyTierGate';

const COUNCIL = [
  { role: 'Elected moderators', n: 47, desc: 'Voted in by token holders. 6-month terms. Recallable.' },
  { role: 'Appeals jurors', n: 12, desc: 'Random selection from active members. Hear every appeal.' },
  { role: 'Safety auditors', n: 5, desc: 'Independent. Audit moderation actions quarterly.' },
];

const PRINCIPLES = [
  { t: 'Transparent', d: 'Every moderation action is logged on-chain. Search-public. No shadow bans.' },
  { t: 'Appealable', d: 'Every decision can be appealed to a randomly-selected jury of members.' },
  { t: 'Accountable', d: 'Moderators are elected, recallable, and their voting records are public.' },
  { t: 'Isolated', d: 'Tier boundaries enforced at the smart contract level. Not policy, math.' },
];

export default function Safety() {
  return (
    <div id="page-safety">
      <PageHeader
        label="safety / trust infrastructure"
        title="Moderation without"
        italic="opaque authority."
        description="Safety on a community-owned platform doesn't mean a faceless trust-and-safety team. It means elected moderators, on-chain accountability, and appeal rights for everyone."
      />

      {/* Interactive tier demo */}
      <section id="safety-tiers" className="py-24 md:py-32 bg-ink relative overflow-hidden">
        <div className="hidden lg:block absolute right-8 top-32 -rotate-90 origin-top-right z-10 pointer-events-none">
          <span className="text-lg font-mono uppercase tracking-[0.3em] text-paper/20">try the tiers</span>
        </div>

        <div className="max-w-[2400px] mx-auto">
          <div className="grid grid-cols-12 mb-12">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-spark" />
                <span className="text-lg font-mono uppercase tracking-widest text-spark">tier system</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-extralight text-paper leading-[1.05]">
                Three protocol-enforced zones.{' '}
                <span className="italic font-editorial text-spark">Click to explore.</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-10">
              <SafetyTierGate />
            </div>
          </div>
        </div>
      </section>

      {/* Moderation Council */}
      <section id="safety-council" className="py-24 md:py-32 bg-paper text-ink relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[50vw] h-[50vw] opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" fill="none" stroke="#0A0A0F" strokeWidth="0.4" />
          </svg>
        </div>
        <div className="max-w-[2400px] mx-auto relative">
          <div className="grid grid-cols-12 gap-y-12 items-start">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-spark" />
                <span className="text-lg font-mono uppercase tracking-widest text-spark">moderation council</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-extralight leading-[1.05] mb-8">
                Elected, not <span className="italic font-editorial text-spark">appointed.</span>
              </h2>
              <p className="text-xl font-editorial text-ink/70 leading-relaxed mb-6">
                Moderators are token holders voted in by other members. They serve six-month terms and can be recalled at any time with a successful proposal.
              </p>
              <p className="text-xl font-editorial text-ink/70 leading-relaxed">
                Every action they take — bans, content removal, appeals — is recorded on-chain. You can audit any moderator's history with a single query.
              </p>
            </div>
            <div className="col-span-12 px-4 md:col-start-8 md:col-span-5 space-y-4">
              {COUNCIL.map((c, i) => (
                <motion.div
                  key={c.role}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="border border-ink/10 p-6 bg-paper hover:border-spark transition-colors"
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-lg font-mono uppercase tracking-wider text-ink/50">{c.role}</span>
                    <span className="text-4xl font-display text-spark">{c.n}</span>
                  </div>
                  <p className="text-lg text-ink/70">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section id="safety-principles" className="py-24 md:py-32 bg-ink relative overflow-hidden">
        <div className="max-w-[2400px] mx-auto">
          <div className="grid grid-cols-12 mb-16">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-9">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-spark" />
                <span className="text-lg font-mono uppercase tracking-widest text-spark">four principles</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-extralight text-paper leading-[1.05]">
                How safety <span className="italic font-editorial text-spark">actually works</span> here.
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-3 px-4 md:px-0">
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.t}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`col-span-12 md:col-span-3 ${i === 0 ? 'md:col-start-2' : ''}`}
              >
                <div className="bg-ash border border-paper/10 p-8 h-full clip-notch-bl hover:border-spark transition-colors">
                  <div className="text-6xl font-display font-extralight text-spark/40 mb-4">0{i + 1}</div>
                  <h3 className="text-2xl font-display text-paper mb-4">{p.t}</h3>
                  <p className="text-lg font-editorial text-paper/60 leading-relaxed">{p.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
