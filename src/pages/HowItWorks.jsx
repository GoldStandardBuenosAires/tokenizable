import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Wallet, Vote, Coins, Cog } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import SpotlightCard from '@/components/ui/spotlight-card';
import Magnet from '@/components/ui/magnet';
import TreasuryGauge from '@/components/custom/TreasuryGauge';

const STEPS = [
  { n: '01', icon: Wallet, title: 'Mint your membership', desc: 'Connect a wallet (or sign up via email — wallet generated for you). Mint a soulbound membership NFT for 0.02 ETH. This is your identity on the platform.' },
  { n: '02', icon: Coins, title: 'Receive TKN tokens', desc: 'Membership comes with an initial TKN allocation. Earn more by hosting events, moderating, contributing code, or being voted a "valuable member" by the community.' },
  { n: '03', icon: Vote, title: 'Vote on everything', desc: 'Fee structures, feature priorities, moderator elections, treasury spending. Every meaningful platform decision goes through on-chain voting. Quadratic weighting prevents whale rule.' },
  { n: '04', icon: Cog, title: 'Watch it execute', desc: 'When a proposal passes, smart contracts execute automatically. No board veto. No "we hear you" PR statements. The code does what the community decided.' },
];

export default function HowItWorks() {
  return (
    <div id="page-how-it-works">
      <PageHeader
        label="how it works / mechanics"
        title="From wallet"
        italic="to platform power."
        description="Four steps from joining to shaping the platform. No middleware. No corporate approval layer. Just you, your tokens, and the smart contracts."
      />

      {/* Steps section */}
      <section id="how-steps" className="relative py-24 md:py-32 bg-ink overflow-visible">
        <div className="hidden lg:block absolute left-8 top-24 -rotate-90 origin-top-left z-10 pointer-events-none">
          <span className="text-lg font-mono uppercase tracking-[0.3em] text-paper/20">flow / sequence</span>
        </div>

        <div className="max-w-[2400px] mx-auto">
          <div className="grid grid-cols-12 gap-y-12">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isEven = i % 2 === 0;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6 }}
                  className={`col-span-12 px-4 ${isEven ? 'md:col-start-2 md:col-span-9' : 'md:col-start-3 md:col-span-9'}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-t border-paper/10 pt-10">
                    <div className="md:col-span-3">
                      <div className="text-7xl md:text-9xl font-display font-extralight text-spark/40 leading-none">{s.n}</div>
                    </div>
                    <div className="md:col-span-2">
                      <Icon size={40} className="text-spark" />
                    </div>
                    <div className="md:col-span-7">
                      <h3 className="text-3xl md:text-4xl font-display font-extralight text-paper mb-4">{s.title}</h3>
                      <p className="text-lg md:text-xl font-editorial text-paper/70 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Treasury section */}
      <section id="how-treasury" className="relative py-24 md:py-32 bg-paper text-ink overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" fill="none" stroke="#0A0A0F" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="max-w-[2400px] mx-auto relative">
          <div className="grid grid-cols-12 gap-y-12 items-center">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-spark" />
                <span className="text-lg font-mono uppercase tracking-widest text-spark">treasury</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-extralight leading-[1.05] mb-8">
                Where every fee <span className="italic font-editorial text-spark">actually goes.</span>
              </h2>
              <p className="text-xl font-editorial font-extralight text-ink/70 leading-relaxed mb-6">
                Meetup charges organizers ~$23/month and pockets it. Tokenizable charges a small platform fee voted by the community, and 100% flows into a multisig the DAO controls.
              </p>
              <p className="text-xl font-editorial font-extralight text-ink/70 leading-relaxed">
                You can read every transaction on-chain. You vote on every allocation. The treasury contract is open source. There is no slush fund.
              </p>
            </div>
            <div className="col-span-12 px-4 md:col-start-8 md:col-span-5">
              <TreasuryGauge />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="how-cta" className="relative py-24 md:py-32 bg-ink">
        <div className="max-w-[2400px] mx-auto">
          <div className="grid grid-cols-12">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-10 text-center">
              <h3 className="text-4xl md:text-6xl font-display font-extralight text-paper mb-8 max-w-3xl mx-auto">
                Ready to <span className="italic font-editorial text-spark">stop renting</span> your community space?
              </h3>
              <Magnet padding={80}>
                <Link
                  to="/join"
                  className="inline-flex items-center gap-3 bg-spark text-ink px-8 py-5 text-xl font-medium clip-arrow-r hover:bg-paper transition-colors"
                >
                  Mint your membership <ArrowRight size={20} />
                </Link>
              </Magnet>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
