
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, ShieldCheck, CalendarDays } from 'lucide-react';
import SpotlightCard from '@/components/ui/spotlight-card';
import { TIER_META } from '@/lib/supabase';
import { formatShortTime } from '@/lib/utils';

export default function GroupCard({ group, index = 0 }) {
  const tier = TIER_META[group.safety_tier] || TIER_META.all_ages;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.07 }}
    >
      <SpotlightCard className="p-0 h-full clip-notch-tr">
        <Link to={`/groups/${group.slug}`} className="flex flex-col h-full">
          <div className="relative h-40 overflow-hidden bg-gradient-to-br from-ash via-smoke to-ink border-b border-paper/10">
            <svg
              viewBox="0 0 200 100"
              className="absolute inset-0 w-full h-full text-spark/25"
              aria-hidden="true"
            >
              <polygon points="30,10 60,26 60,58 30,74 0,58 0,26" fill="none" stroke="currentColor" strokeWidth="0.6" />
              <polygon points="90,26 120,42 120,74 90,90 60,74 60,42" fill="none" stroke="currentColor" strokeWidth="0.6" />
              <polygon points="150,4 180,20 180,52 150,68 120,52 120,20" fill="none" stroke="currentColor" strokeWidth="0.6" />
              <line x1="45" y1="42" x2="105" y2="58" stroke="currentColor" strokeWidth="0.4" />
              <line x1="105" y1="58" x2="165" y2="36" stroke="currentColor" strokeWidth="0.4" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <span
              className={`absolute top-4 right-4 text-lg font-mono uppercase px-2 py-1 ${tier.badge}`}
            >
              {tier.label}
            </span>
          </div>

          <div className="p-6 flex flex-col flex-1">
            <h3 className="text-2xl font-display text-paper mb-3 leading-snug">{group.name}</h3>
            <p className="text-lg font-editorial text-paper/60 leading-relaxed mb-5 line-clamp-3">
              {group.description || 'No description written yet — the stewards can add one anytime.'}
            </p>

            <div className="mt-auto pt-4 border-t border-paper/10 flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-lg text-paper/50 font-mono">
                <CalendarDays size={16} className="text-spark" />
                {formatShortTime(group.created_at)}
              </span>
              <span className="flex items-center gap-2 text-lg text-spark">
                Open <ArrowUpRight size={16} />
              </span>
            </div>
          </div>
        </Link>
      </SpotlightCard>
    </motion.div>
  );
}

export function GroupCardSkeleton() {
  return (
    <div className="h-[360px] bg-ash/60 border border-paper/10 clip-notch-tr animate-pulse">
      <div className="h-40 bg-smoke/40" />
      <div className="p-6 space-y-4">
        <div className="h-6 w-2/3 bg-smoke/50" />
        <div className="h-4 w-full bg-smoke/30" />
        <div className="h-4 w-4/5 bg-smoke/30" />
      </div>
    </div>
  );
}

export function TierBadge({ tier }) {
  const meta = TIER_META[tier] || TIER_META.all_ages;
  return (
    <span className={`inline-flex items-center gap-2 text-lg font-mono uppercase px-3 py-1 ${meta.badge}`}>
      <ShieldCheck size={16} /> {meta.label}
    </span>
  );
}
