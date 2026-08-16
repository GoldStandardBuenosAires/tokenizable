
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, ShieldCheck, LogOut } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import GroupCard, { GroupCardSkeleton } from '@/components/groups/GroupCard';
import CreateGroupModal from '@/components/groups/CreateGroupModal';
import { supabase, TIER_META } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

const FILTERS = [
  { value: 'all', label: 'All tiers' },
  { value: 'family_friendly', label: 'Family friendly' },
  { value: 'all_ages', label: 'All ages' },
  { value: 'adult_only', label: 'Adult only 18+' },
];

export default function Groups() {
  const { user, profile, promptSignIn, setAgeVerified, signOut } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);

  const load = useCallback(async () => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from('groups')
      .select('id, name, slug, description, safety_tier, created_at, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    setError(loadError ? loadError.message : '');
    setGroups(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(
    () => (filter === 'all' ? groups : groups.filter((g) => g.safety_tier === filter)),
    [groups, filter]
  );

  const openCreate = () => {
    if (!promptSignIn('Creating a group requires a signed-in membership.')) return;
    setCreateOpen(true);
  };

  return (
    <div id="page-groups">
      <PageHeader
        label="discover / groups rooms events"
        title="Find your"
        italic="people, in real life."
        description="Every group is member-owned, steward-governed and safety-tiered at the data model — not by a moderation afterthought. Rooms keep the community alive between events."
      />

      {/* Controls */}
      <section id="groups-controls" className="py-12 bg-ink border-b border-paper/10">
        <div className="max-w-[2400px] mx-auto">
          <div className="grid grid-cols-12">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-10 flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap gap-3">
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`px-5 py-2 text-lg border transition-colors ${
                      filter === f.value
                        ? 'bg-spark border-spark text-ink'
                        : 'border-paper/20 text-paper/70 hover:border-paper hover:text-paper'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                {user && (
                  <button
                    onClick={signOut}
                    className="inline-flex items-center gap-2 text-lg text-paper/50 hover:text-spark transition-colors"
                  >
                    <LogOut size={16} /> Sign out
                  </button>
                )}
                <button
                  onClick={openCreate}
                  className="inline-flex items-center gap-2 bg-spark text-ink px-6 py-3 text-lg font-medium clip-arrow-r hover:bg-paper transition-colors"
                >
                  <Plus size={18} /> Create group
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory */}
      <section id="groups-directory" className="py-24 md:py-32 bg-ink relative overflow-hidden">
        <div className="absolute top-32 -right-32 w-[40vw] h-[40vw] opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-signal">
            <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="max-w-[2400px] mx-auto">
          <div className="grid grid-cols-12 mb-12">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-9 flex items-end justify-between flex-wrap gap-4">
              <h2 className="text-3xl md:text-5xl font-display font-extralight text-paper">
                The directory
              </h2>
              <span className="text-lg font-mono text-paper/40">
                {loading ? 'syncing…' : `${visible.length} groups visible to you`}
              </span>
            </div>
          </div>

          {!user ? (
            <div className="grid grid-cols-12">
              <div className="col-span-12 px-4 md:col-start-2 md:col-span-8">
                <div className="border border-paper/10 bg-ash clip-notch-tr p-10">
                  <h3 className="text-2xl font-display text-paper mb-4">Sign in to browse</h3>
                  <p className="text-lg font-editorial text-paper/65 leading-relaxed mb-8 max-w-xl">
                    Group visibility is enforced at the database, not in the UI. Adult-only groups
                    stay hidden from search entirely until an account carries an age attestation.
                  </p>
                  <button
                    onClick={() => promptSignIn('Sign in to see the group directory.')}
                    className="bg-spark text-ink px-7 py-4 text-lg font-medium clip-arrow-r hover:bg-paper transition-colors"
                  >
                    Send me a magic link
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4 md:px-8">
              {loading &&
                [0, 1, 2, 3, 4, 5].map((n) => <GroupCardSkeleton key={n} />)}
              {!loading &&
                visible.map((group, i) => <GroupCard key={group.id} group={group} index={i} />)}
            </div>
          )}

          {!loading && user && visible.length === 0 && (
            <div className="grid grid-cols-12 mt-4">
              <div className="col-span-12 px-4 md:col-start-2 md:col-span-8">
                <p className="text-lg font-editorial text-paper/55 leading-relaxed">
                  Nothing here under this filter yet. Adult-only groups stay hidden until your
                  account carries an age attestation — or be the first to create one.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="grid grid-cols-12 mt-8">
              <div className="col-span-12 px-4 md:col-start-2 md:col-span-8">
                <p className="text-lg text-spark">{error}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Age attestation */}
      <section id="groups-age-gate" className="py-20 bg-ash border-y border-paper/10">
        <div className="max-w-[2400px] mx-auto">
          <div className="grid grid-cols-12">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-8">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck size={18} className="text-signal" />
                <span className="text-lg font-mono uppercase tracking-widest text-signal">
                  age attestation
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-extralight text-paper mb-6">
                Adult-only spaces stay <span className="italic font-editorial text-spark">invisible</span> without this.
              </h3>
              <p className="text-lg font-editorial text-paper/65 leading-relaxed mb-8 max-w-2xl">
                Honest version: this is self-attestation today. We store a single boolean on your
                profile — never an ID document, never a scan. A privacy-preserving verification API
                replaces this before adult-only groups go live at scale.
              </p>
              <button
                onClick={() => {
                  if (!promptSignIn('Sign in to attest your age.')) return;
                  setAgeVerified(!profile?.is_age_verified);
                }}
                className={`inline-flex items-center gap-3 px-6 py-4 text-lg border transition-colors ${
                  profile?.is_age_verified
                    ? 'border-spark bg-spark/10 text-spark'
                    : 'border-paper/25 text-paper hover:border-spark hover:text-spark'
                }`}
              >
                <span
                  className={`w-5 h-5 border flex items-center justify-center ${
                    profile?.is_age_verified ? 'bg-spark border-spark' : 'border-paper/40'
                  }`}
                />
                {profile?.is_age_verified
                  ? 'Attested — adult-only groups are discoverable'
                  : 'I confirm I am 18 or older'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Host CTA */}
      <section id="groups-host" className="py-24 md:py-32 bg-paper text-ink relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.05] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" fill="none" stroke="#0A0A0F" strokeWidth="0.4" />
          </svg>
        </div>
        <div className="max-w-[2400px] mx-auto relative">
          <div className="grid grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="col-span-12 px-4 md:col-start-2 md:col-span-9"
            >
              <h2 className="text-4xl md:text-6xl font-display font-extralight mb-8 leading-[1.05]">
                Want to host?{' '}
                <span className="italic font-editorial text-spark">No subscription. No gatekeepers.</span>
              </h2>
              <p className="text-xl font-editorial text-ink/70 max-w-2xl mb-10 leading-relaxed">
                Meetup charges organisers a monthly fee to own your community. Here, any member can
                create a group — and if every steward disappears, the group survives them: it enters
                steward-election mode instead of vanishing with one account.
              </p>
              <button
                onClick={openCreate}
                className="bg-ink text-paper px-7 py-4 text-lg clip-arrow-r hover:bg-spark hover:text-ink transition-colors"
              >
                Create a group
              </button>
              <p className="text-lg text-ink/50 mt-6 font-mono">
                Default rooms created automatically: General · Event Planning · tier{' '}
                {TIER_META.all_ages.label}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <CreateGroupModal
        open={createOpen}
        profileId={profile?.id}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          load();
        }}
      />
    </div>
  );
}
