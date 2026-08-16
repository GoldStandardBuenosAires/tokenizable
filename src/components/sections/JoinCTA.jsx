import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Magnet from '@/components/ui/magnet';

export default function JoinCTA() {
  return (
    <section id="join-cta" className="relative w-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <img
          src="https://content-studio.biela.dev/cover/4800x2400/i/images-library/6a39754701fcc1c9459ac865/1782150554770-6a39754701fcc1c9459ac865/originals/1782150954165.png/aerial-top-down-shot-of-diverse-hands-meeting-in-center-forming-a-circle-of-connection-golden-warm-light-from-above-atmospheric-haze-film-grain-hyper-realistic-8k-professional-film-grade-earth-tones-amber-highlights-allow-only-white-person-european-4800x2400.webp?search_term=hands,connection,community,unity&img_prompt=Aerial+top+down+shot+of+diverse+hands+meeting+in+center+forming+a+circle+of+connection+golden+warm+light+from+above+atmospheric+haze+film+grain+hyper+realistic+8k+professional+film+grade+earth+tones+amber+highlights&w=2400&h=1200&type=image"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />
      </div>

      {/* Hex motif */}
      <motion.div
        className="absolute top-20 right-12 lg:right-20 w-32 h-32 lg:w-48 lg:h-48 pointer-events-none opacity-30"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-spark">
          <polygon points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </motion.div>

      <div className="relative max-w-[2400px] mx-auto py-32 md:py-48">
        <div className="grid grid-cols-12">
          <div className="col-span-12 px-4 md:col-start-2 md:col-span-9">
            <motion.div
              initial={{ opacity: 0, rotate: -8, scale: 0.8 }}
              whileInView={{ opacity: 1, rotate: -4, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block bg-spark text-ink px-4 py-1.5 text-lg font-mono uppercase tracking-wider mb-10"
            >
              ◆ membership mint open
            </motion.div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-extralight leading-[0.95] mb-10 max-w-5xl">
              Stop being the product.{' '}
              <span className="italic font-editorial text-spark block mt-2">Own the platform.</span>
            </h2>
            <p className="text-xl md:text-2xl font-editorial font-extralight text-paper/70 max-w-2xl mb-12 leading-relaxed">
              Mint a membership NFT. Get governance tokens. Help decide what a community-owned meetup platform actually looks like.
            </p>
            <div className="flex flex-wrap gap-4">
              <Magnet padding={80}>
                <Link
                  to="/join"
                  className="inline-flex items-center gap-3 bg-spark text-ink px-8 py-5 text-xl font-medium clip-arrow-r hover:bg-paper transition-colors"
                >
                  <Sparkles size={20} /> Mint membership · 0.02 ETH
                </Link>
              </Magnet>
              <Magnet padding={80}>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-3 border border-paper/30 text-paper px-8 py-5 text-xl hover:border-paper hover:bg-paper/5 transition-colors"
                >
                  How it works <ArrowRight size={18} />
                </Link>
              </Magnet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
