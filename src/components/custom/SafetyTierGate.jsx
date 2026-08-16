import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Users, Lock, AlertCircle } from 'lucide-react';

const TIERS = [
  {
    id: 'all-ages',
    label: 'All Ages',
    color: 'paper',
    accent: '#F5F1E8',
    icon: Users,
    desc: 'Public spaces with community standards. No age verification required. Most groups live here.',
    examples: ['Book clubs', 'Hiking groups', 'Code meetups', 'Language exchanges'],
  },
  {
    id: 'child-safe',
    label: 'Child-Safe',
    color: 'signal',
    accent: '#6B7FFF',
    icon: Shield,
    desc: 'Enhanced moderation, COPPA-compliant, organizer background checks. Family-friendly events only.',
    examples: ['Kids coding clubs', 'Family hikes', 'Youth art workshops', 'Parent groups'],
  },
  {
    id: 'adult',
    label: 'Adult-Only',
    color: 'spark',
    accent: '#FF5C28',
    icon: Lock,
    desc: 'NFT-gated age verification (18+ or 21+ per jurisdiction). Strict isolation from other tiers.',
    examples: ['Whiskey tastings', 'Adult discussion circles', 'Nightlife meetups', 'After-hours'],
  },
];

export default function SafetyTierGate() {
  const [active, setActive] = useState('all-ages');
  const tier = TIERS.find((t) => t.id === active);

  return (
    <div id="safety-tier-gate" className="border border-paper/10 bg-ash overflow-hidden">
      <div className="grid grid-cols-3 border-b border-paper/10">
        {TIERS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`relative p-5 md:p-7 text-left transition-colors ${
                isActive ? 'bg-ink' : 'hover:bg-ink/50'
              }`}
            >
              <Icon size={24} style={{ color: isActive ? t.accent : '#F5F1E8' }} className="opacity-80 mb-3" />
              <div className="text-lg font-display font-medium" style={{ color: isActive ? t.accent : '#F5F1E8' }}>
                {t.label}
              </div>
              {isActive && (
                <motion.div
                  layoutId="tier-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: t.accent }}
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
          className="p-8 md:p-12"
        >
          <div className="flex items-start gap-3 mb-6">
            <AlertCircle size={20} style={{ color: tier.accent }} className="mt-1 flex-shrink-0" />
            <p className="text-xl md:text-2xl font-editorial font-extralight text-paper leading-relaxed">
              {tier.desc}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {tier.examples.map((e) => (
              <div
                key={e}
                className="border border-paper/10 p-4 text-lg text-paper/70 hover:border-paper/30 transition-colors"
              >
                {e}
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-paper/10 flex items-center justify-between flex-wrap gap-3">
            <span className="text-lg font-mono uppercase tracking-wider text-paper/40">
              isolation enforced at protocol level
            </span>
            <span className="text-lg font-mono px-3 py-1 bg-ink" style={{ color: tier.accent }}>
              tier_id: {tier.id}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
