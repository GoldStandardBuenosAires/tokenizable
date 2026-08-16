import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, MessageCircle, Github } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Magnet from '@/components/ui/magnet';
import WalletConnectBar from '@/components/web3/WalletConnectBar';
import MintPanel from '@/components/web3/MintPanel';

const TIERS = [
  {
    name: 'Founding Member',
    price: '$72',
    sub: 'USDC or USDT',
    tag: 'Most popular',
    color: 'spark',
    perks: [
      'Soulbound membership NFT',
      '500 TKN governance tokens',
      'Full voting rights from day one',
      'Access to all platform tiers',
      'Founding member discord role',
      'Earn TKN by hosting and contributing',
    ],
  },
  {
    name: 'Contributor',
    price: 'Earn it',
    sub: 'no purchase',
    tag: 'Code or moderate',
    color: 'signal',
    perks: [
      'Earn membership through PRs, moderation, or community work',
      'Same governance rights as paid members',
      '500 TKN granted on first significant contribution',
      'Verified contributor badge',
      'Direct line to core team',
    ],
  },
  {
    name: 'Patron',
    price: '$1,890',
    sub: 'USDC or USDT',
    tag: 'Power user',
    color: 'paper',
    perks: [
      'Everything in Founding Member',
      '10,000+ TKN allocation (vested 1 yr)',
      'Named in repo CREDITS file',
      'Patron-only discord channel',
      'Early access to new features',
    ],
  },
];

export default function Join() {
  const [email, setEmail] = useState('');

  return (
    <div id="page-join">
      <PageHeader
        label="join / become a member"
        title="Membership is"
        italic="the only password."
        description="There are no free accounts. There is no paid tier with more rights. There is one membership NFT — three ways to get one."
      />

      {/* Tiers */}
      <section id="join-tiers" className="py-24 md:py-32 bg-ink relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[50vw] h-[50vw] opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-spark">
            <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" fill="none" stroke="currentColor" strokeWidth="0.4" />
          </svg>
        </div>

        <div className="max-w-[2400px] mx-auto">
          <div className="grid grid-cols-12">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-10">
              <WalletConnectBar />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {TIERS.map((t, i) => (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`relative p-8 h-full clip-notch-tr border ${
                      i === 0 ? 'border-spark bg-ash' : 'border-paper/10 bg-ash/50'
                    } flex flex-col`}
                  >
                    <div className={`text-lg font-mono uppercase tracking-wider mb-2 ${
                      t.color === 'spark' ? 'text-spark' : t.color === 'signal' ? 'text-signal' : 'text-paper/60'
                    }`}>
                      {t.tag}
                    </div>
                    <h3 className="text-3xl font-display text-paper mb-2">{t.name}</h3>
                    <div className="flex items-baseline gap-2 mb-8">
                      <span className="text-5xl font-display font-extralight text-paper">{t.price}</span>
                      <span className="text-lg text-paper/40">{t.sub}</span>
                    </div>
                    <ul className="space-y-3 mb-8 flex-1">
                      {t.perks.map((p) => (
                        <li key={p} className="flex items-start gap-3 text-lg text-paper/80">
                          <Check size={16} className="text-spark mt-1.5 flex-shrink-0" /> {p}
                        </li>
                      ))}
                    </ul>
                    <MintPanel tierIndex={i} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email fallback / waitlist */}
      <section id="join-waitlist" className="py-24 md:py-32 bg-paper text-ink relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-[40vw] h-[40vw] opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" fill="none" stroke="#0A0A0F" strokeWidth="0.4" />
          </svg>
        </div>

        <div className="max-w-[2400px] mx-auto relative">
          <div className="grid grid-cols-12 gap-y-12 items-center">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-px bg-spark" />
                <span className="text-lg font-mono uppercase tracking-widest text-spark">no wallet?</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-extralight leading-[1.05] mb-8">
                Email-first works <span className="italic font-editorial text-spark">too.</span>
              </h2>
              <p className="text-xl font-editorial text-ink/70 leading-relaxed">
                Sign up with email and we'll generate a wallet for you (custodial during onboarding, you can self-custody anytime). You'll still receive your membership NFT and TKN tokens.
              </p>
            </div>
            <div className="col-span-12 px-4 md:col-start-8 md:col-span-5">
              <form onSubmit={(e) => e.preventDefault()} noValidate className="space-y-4">
                <div>
                  <label htmlFor="email" className="text-lg font-mono uppercase tracking-wider text-ink/60 block mb-3">your email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@somewhere.com"
                    className="w-full px-4 py-4 text-lg bg-paper border border-ink/20 focus:border-spark outline-none transition-colors text-ink"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-ink text-paper py-4 text-lg font-medium hover:bg-spark hover:text-ink transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles size={18} /> Reserve my membership
                </button>
                <p className="text-lg text-ink/50">
                  No spam. One email when minting opens. You can self-custody anytime.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Discord + Github */}
      <section id="join-community" className="py-24 md:py-32 bg-ink">
        <div className="max-w-[2400px] mx-auto">
          <div className="grid grid-cols-12">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-10 text-center">
              <h3 className="text-3xl md:text-5xl font-display font-extralight text-paper mb-10">
                Join the conversation first.
              </h3>
              <div className="flex flex-wrap gap-4 justify-center">
                <Magnet padding={60}>
                  <a href="https://discord.gg" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 border border-paper/30 text-paper px-7 py-4 text-lg hover:border-spark hover:text-spark transition-colors">
                    <MessageCircle size={18} /> Join Discord · 8,432 members
                  </a>
                </Magnet>
                <Magnet padding={60}>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 border border-paper/30 text-paper px-7 py-4 text-lg hover:border-spark hover:text-spark transition-colors">
                    <Github size={18} /> Read the code
                  </a>
                </Magnet>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
