import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Shield, Vote, Coins, Users, Globe, Lock } from 'lucide-react';
import SpotlightCard from '@/components/ui/spotlight-card';
import VariableProximity from '@/components/ui/variable-proximity';

const FEATURES = [
  { icon: Vote, title: 'On-chain voting', desc: 'Every platform decision — fees, features, moderators — voted by token holders.', size: 'lg', color: '#FF5C28' },
  { icon: Coins, title: 'Community treasury', desc: 'All platform fees flow into a multisig the DAO controls.', size: 'md', color: '#6B7FFF' },
  { icon: MapPin, title: 'Hybrid events', desc: 'In-person, online, or both. Native support, no plugins.', size: 'md', color: '#F5F1E8' },
  { icon: Shield, title: 'Tiered safety', desc: 'All-ages, child-safe, adult-only. Enforced at protocol level.', size: 'md', color: '#6B7FFF' },
  { icon: Users, title: 'Elected moderators', desc: 'Mod council voted by community. Recallable. On-chain.', size: 'lg', color: '#FF5C28' },
  { icon: Calendar, title: 'Gas-free RSVPs', desc: 'Sign with your wallet. No transaction fees for attendance.', size: 'md', color: '#F5F1E8' },
  { icon: Globe, title: 'Open source', desc: 'Full code public. Roadmap voted on Snapshot.', size: 'md', color: '#6B7FFF' },
  { icon: Lock, title: 'Self-sovereign identity', desc: 'Your wallet is your account. Email fallback optional.', size: 'md', color: '#FF5C28' },
];

export default function FeaturesBento() {
  const containerRef = useRef(null);

  return (
    <section id="features-bento" className="relative py-24 md:py-32 bg-paper text-ink overflow-hidden">
      {/* Background hex pattern */}
      <div className="absolute -bottom-32 -right-32 w-[70vw] h-[70vw] max-w-[1000px] max-h-[1000px] opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" fill="none" stroke="#0A0A0F" strokeWidth="0.3" />
          <polygon points="50,20 76,34 76,66 50,80 24,66 24,34" fill="none" stroke="#0A0A0F" strokeWidth="0.3" />
        </svg>
      </div>

      <div ref={containerRef} className="max-w-[2400px] mx-auto relative">
        <div className="grid grid-cols-12 mb-16">
          <div className="col-span-12 px-4 md:col-start-2 md:col-span-9">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-spark" />
              <span className="text-lg font-mono uppercase tracking-widest text-spark">platform / 03</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-extralight leading-[1.05]">
              Everything Meetup does.{' '}
              <VariableProximity
                label="Owned by you."
                containerRef={containerRef}
                radius={120}
                falloff="gaussian"
                fromFontVariationSettings="'wght' 200, 'wdth' 100"
                toFontVariationSettings="'wght' 800, 'wdth' 125"
                className="italic font-editorial text-spark"
              />
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 px-4 md:px-0">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            const span = f.size === 'lg' ? 'md:col-span-6' : 'md:col-span-3';
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                className={`col-span-12 ${span} ${i === 0 ? 'md:col-start-2' : ''}`}
              >
                <div className="relative h-full bg-ink text-paper p-8 group cursor-pointer overflow-hidden border border-transparent hover:border-spark/30 transition-colors clip-notch-tr">
                  <div className="flex items-start justify-between mb-6">
                    <Icon size={28} style={{ color: f.color }} />
                    <span className="text-lg font-mono text-paper/30">0{i + 1}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-extralight mb-3">{f.title}</h3>
                  <p className="text-lg font-editorial text-paper/60 leading-relaxed">{f.desc}</p>
                  <motion.div
                    className="absolute bottom-0 left-0 h-px"
                    style={{ backgroundColor: f.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3 + (i % 4) * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
