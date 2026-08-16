import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Vote } from 'lucide-react';
import SplitText from '@/components/ui/split-text';
import Magnet from '@/components/ui/magnet';
import Shuffle from '@/components/ui/shuffle';

export default function Hero() {
  const containerRef = useRef(null);

  return (
    <section
      id="home-hero"
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-ink"
    >
      {/* Hero still bleeds edge-to-edge */}
      <img
        src="https://content-studio.biela.dev/cover/1536x870/i/images-library/6a39754701fcc1c9459ac865/1782150554770-6a39754701fcc1c9459ac865/originals/1782150874474.png/cinematic-wide-rooftop-gathering-at-golden-hour-with-diverse-community-members-conversing-around-candlelit-tables-strings-of-fairy-lights-overhead-drifting-warm-particles-catching-light-full-human-figures-sitting-standing-laughing-amber-sunset-sky-behind-blurred-city-skyline-atmospheric-haze-film-grain-hyper-realistic-8k-professional-film-grade-color-grading-allow-only-white-person-european-1536x870.webp"
        alt="Rooftop community gathering at golden hour, people conversing around candlelit tables beneath strings of fairy lights with a city skyline behind"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        width={1536}
        height={870}
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />

      {/* Gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/40 pointer-events-none" />

      {/* Decorative hex motif - top right */}
      <motion.div
        className="absolute top-32 right-12 lg:right-32 w-24 h-24 lg:w-40 lg:h-40 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-spark/40">
          <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="50,25 75,37.5 75,62.5 50,75 25,62.5 25,37.5" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="50" cy="50" r="6" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Vertical accent label - left edge */}
      <div className="hidden lg:block absolute left-8 bottom-32 -rotate-90 origin-bottom-left z-10 pointer-events-none">
        <span className="text-lg font-mono uppercase tracking-[0.3em] text-paper/30">
          v0.1 / mainnet
        </span>
      </div>

      {/* Sticker badge */}
      <motion.div
        initial={{ opacity: 0, rotate: -12, scale: 0.8 }}
        animate={{ opacity: 1, rotate: -6, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="hidden md:block absolute top-32 left-12 lg:left-1/3 z-20"
      >
        <div className="bg-spark text-ink px-4 py-1.5 text-lg font-mono uppercase tracking-wider">
          ◆ now open · DAO active
        </div>
      </motion.div>

      {/* Content grid */}
      <div className="relative z-10 max-w-[2400px] mx-auto min-h-screen flex items-center pt-32 pb-20">
        <div className="grid grid-cols-12 w-full">
          <div className="col-span-12 px-4 md:col-start-2 md:col-span-10 lg:col-start-2 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="w-12 h-px bg-spark" />
              <Shuffle
                text="MEETUP, BUT THE PEOPLE OWN IT"
                className="text-lg text-spark tracking-widest"
              />
            </motion.div>

            <h1 className="font-display font-extralight leading-[0.95] text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tight max-w-5xl">
              <SplitText
                text="The platform"
                tag="span"
                className="block text-paper"
                stagger={0.06}
              />
              <SplitText
                text="belongs to"
                tag="span"
                className="block text-paper"
                stagger={0.06}
                delay={0.3}
              />
              <SplitText
                text="the room."
                tag="span"
                className="block text-spark italic font-editorial"
                stagger={0.06}
                delay={0.6}
              />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="text-xl md:text-2xl font-editorial font-extralight text-paper/70 mt-10 max-w-2xl leading-relaxed"
            >
              A DAO-governed alternative to Meetup. Hold a membership NFT, vote on fees, elect moderators, propose changes. No board. No exit liquidity event. Just the community that shows up.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="flex flex-wrap gap-4 mt-12"
            >
              <Magnet padding={60}>
                <Link
                  to="/join"
                  className="inline-flex items-center gap-3 bg-spark text-ink px-7 py-4 text-lg font-medium clip-arrow-r hover:bg-paper transition-colors"
                >
                  Mint your membership <ArrowRight size={18} />
                </Link>
              </Magnet>
              <Magnet padding={60}>
                <Link
                  to="/governance"
                  className="inline-flex items-center gap-3 border border-paper/30 text-paper px-7 py-4 text-lg font-extralight hover:border-paper hover:bg-paper/5 transition-colors"
                >
                  <Vote size={18} /> See active proposals
                </Link>
              </Magnet>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="grid grid-cols-3 gap-6 mt-16 max-w-2xl border-t border-paper/10 pt-8"
            >
              <div>
                <div className="text-3xl md:text-4xl font-display text-paper">12,847</div>
                <div className="text-lg font-mono uppercase tracking-wider text-paper/40 mt-2">members</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-display text-paper">423</div>
                <div className="text-lg font-mono uppercase tracking-wider text-paper/40 mt-2">proposals</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-display text-spark">∞</div>
                <div className="text-lg font-mono uppercase tracking-wider text-paper/40 mt-2">no exit</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom diagonal divider */}
      <div className="absolute bottom-0 left-0 right-0 h-20 z-[1]" style={{
        background: 'linear-gradient(to top, #0A0A0F, transparent)',
      }} />
    </section>
  );
}
