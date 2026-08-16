import React from 'react';
import { motion } from 'motion/react';
import SplitText from '@/components/ui/split-text';
import Shuffle from '@/components/ui/shuffle';

export default function PageHeader({ label, title, italic, description }) {
  return (
    <section className="relative pt-40 pb-20 md:pt-48 md:pb-24 bg-ink overflow-hidden border-b border-paper/5">
      {/* Hex background */}
      <motion.div
        className="absolute -top-40 -right-40 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] opacity-[0.04] pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-spark">
          <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <polygon points="50,20 76,34 76,66 50,80 24,66 24,34" fill="none" stroke="currentColor" strokeWidth="0.3" />
        </svg>
      </motion.div>

      <div className="max-w-[2400px] mx-auto relative">
        <div className="grid grid-cols-12">
          <div className="col-span-12 px-4 md:col-start-2 md:col-span-9">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-spark" />
              <Shuffle text={label} className="text-lg uppercase tracking-widest text-spark" tag="span" />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extralight leading-[0.95] text-paper">
              <SplitText text={title} tag="span" className="block" stagger={0.05} />
              {italic && (
                <SplitText
                  text={italic}
                  tag="span"
                  className="block italic font-editorial text-spark mt-2"
                  stagger={0.05}
                  delay={0.3}
                />
              )}
            </h1>
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-xl md:text-2xl font-editorial font-extralight text-paper/70 mt-10 max-w-2xl leading-relaxed"
              >
                {description}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
