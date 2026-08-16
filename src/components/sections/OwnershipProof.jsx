import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProposalTicker from '@/components/custom/ProposalTicker';
import Magnet from '@/components/ui/magnet';

export default function OwnershipProof() {
  return (
    <section id="ownership-proof" className="relative py-24 md:py-32 bg-ink overflow-visible">
      {/* Background hex shape */}
      <div className="absolute -top-20 -left-20 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-signal">
          <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" fill="none" stroke="currentColor" strokeWidth="0.4" />
        </svg>
      </div>

      {/* Vertical accent */}
      <div className="hidden lg:block absolute right-8 top-32 -rotate-90 origin-top-right z-10 pointer-events-none">
        <span className="text-lg font-mono uppercase tracking-[0.3em] text-paper/15">
          governance / live
        </span>
      </div>

      <div className="max-w-[2400px] mx-auto relative">
        <div className="grid grid-cols-12 gap-y-12">
          <div className="col-span-12 px-4 md:col-start-2 md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-spark" />
              <span className="text-lg font-mono uppercase tracking-widest text-spark">proof / 02</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-extralight text-paper leading-[1.05] mb-8">
              The DAO is <span className="italic font-editorial text-spark">already running.</span>
            </h2>
            <p className="text-xl font-editorial font-extralight text-paper/70 leading-relaxed mb-8">
              Every proposal on the right is real on-chain governance happening right now. Token holders vote. Code executes. No board overrides. No founder veto. The community decided last Tuesday to lower listing fees by 0.5% — and that's exactly what happened.
            </p>
            <div className="space-y-4 mb-10">
              {[
                { n: '01', t: 'Anyone with a membership NFT can propose' },
                { n: '02', t: 'Token-weighted voting with quadratic safeguards' },
                { n: '03', t: 'Smart contract executes the result automatically' },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-4">
                  <span className="text-2xl font-display font-extralight text-spark/60">{s.n}</span>
                  <span className="text-lg font-editorial text-paper/80 pt-1">{s.t}</span>
                </div>
              ))}
            </div>
            <Magnet padding={60}>
              <Link
                to="/governance"
                className="inline-flex items-center gap-3 border border-paper/30 text-paper px-7 py-4 text-lg hover:border-spark hover:text-spark transition-colors"
              >
                Read governance docs <ArrowRight size={18} />
              </Link>
            </Magnet>
          </div>

          <div className="col-span-12 px-4 md:col-start-8 md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
            >
              <ProposalTicker />
              <div className="mt-4 flex items-center justify-between text-lg font-mono text-paper/40">
                <span>contract: 0x7fE6...4a3B</span>
                <span className="text-spark">view on explorer ↗</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
