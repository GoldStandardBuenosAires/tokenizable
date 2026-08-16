
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Hexagon } from 'lucide-react';
import { supabase, slugify } from '@/lib/supabase';

const TIERS = [
  { value: 'family_friendly', label: 'Family friendly', hint: 'Public. Discoverable by every member.' },
  { value: 'all_ages', label: 'All ages', hint: 'Public. Discoverable by every member.' },
  { value: 'adult_only', label: 'Adult only 18+', hint: 'Hidden from members without age attestation.' },
];

export default function CreateGroupModal({ open, profileId, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tier, setTier] = useState('all_ages');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const slug = slugify(name);
  const nameInvalid = touched && name.trim().length < 3;

  const reset = () => {
    setName('');
    setDescription('');
    setTier('all_ages');
    setError('');
    setTouched(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    setTouched(true);
    if (name.trim().length < 3) return;
    setBusy(true);
    setError('');

    const attempt = async (candidate) =>
      supabase
        .from('groups')
        .insert({
          name: name.trim(),
          slug: candidate,
          description: description.trim() || null,
          safety_tier: tier,
          created_by: profileId,
        })
        .select()
        .single();

    let { data: group, error: insertError } = await attempt(slug);
    if (insertError && insertError.code === '23505') {
      const suffixed = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
      ({ data: group, error: insertError } = await attempt(suffixed));
    }

    if (insertError || !group) {
      setBusy(false);
      setError(insertError?.message || 'Could not create the group.');
      return;
    }

    await supabase.from('group_stewards').insert({ group_id: group.id, profile_id: profileId });
    await supabase.from('group_members').insert({ group_id: group.id, profile_id: profileId });
    await supabase.from('rooms').insert([
      { group_id: group.id, name: 'General', description: 'Everything else.', is_default: true },
      { group_id: group.id, name: 'Event Planning', description: 'Plan the next gathering.' },
    ]);
    await supabase.from('steward_actions').insert({
      group_id: group.id,
      action_type: 'steward_added',
      performed_by: profileId,
      target_id: profileId,
      reason: 'Founding steward at group creation',
    });

    setBusy(false);
    reset();
    onCreated(group);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="groups-create-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[65] bg-ink/92 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className="relative w-full max-w-2xl my-12 bg-ash border border-paper/10 clip-notch-tr p-8 md:p-10"
          >
            <button
              onClick={onClose}
              aria-label="Close create group"
              className="absolute top-5 right-5 text-paper/50 hover:text-spark transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <Hexagon size={18} className="text-spark" />
              <span className="text-lg font-mono uppercase tracking-widest text-spark">
                new group
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-extralight text-paper mb-8 leading-tight">
              Spin up a community. <span className="italic font-editorial text-spark">No subscription.</span>
            </h2>

            <form onSubmit={submit} noValidate className="space-y-6">
              <div>
                <label htmlFor="group-name" className="text-lg font-mono uppercase tracking-wider text-paper/50 block mb-3">
                  group name
                </label>
                <input
                  id="group-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="Buenos Aires Filmmakers"
                  className={`w-full px-4 py-4 text-lg bg-ink border outline-none transition-colors text-paper placeholder:text-paper/30 ${
                    nameInvalid ? 'border-spark' : 'border-paper/15 focus:border-spark'
                  }`}
                />
                {nameInvalid ? (
                  <p className="text-lg text-spark mt-2">Give it at least three characters.</p>
                ) : (
                  <p className="text-lg text-paper/40 mt-2 font-mono">/groups/{slug || '…'}</p>
                )}
              </div>

              <div>
                <label htmlFor="group-desc" className="text-lg font-mono uppercase tracking-wider text-paper/50 block mb-3">
                  description
                </label>
                <textarea
                  id="group-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What happens here, who it is for, how often you meet."
                  className="w-full px-4 py-4 text-lg bg-ink border border-paper/15 focus:border-spark outline-none transition-colors text-paper placeholder:text-paper/30 resize-none"
                />
              </div>

              <div>
                <span className="text-lg font-mono uppercase tracking-wider text-paper/50 block mb-3">
                  safety tier — set once, changed only by steward action
                </span>
                <div className="space-y-2">
                  {TIERS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTier(t.value)}
                      className={`w-full text-left px-4 py-4 border transition-colors ${
                        tier === t.value
                          ? 'border-spark bg-spark/10'
                          : 'border-paper/15 hover:border-paper/40'
                      }`}
                    >
                      <span className="block text-lg text-paper">{t.label}</span>
                      <span className="block text-lg text-paper/50">{t.hint}</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-lg text-spark border border-spark/30 bg-spark/10 px-4 py-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full bg-spark text-ink py-4 text-lg font-medium hover:bg-paper transition-colors disabled:opacity-50"
              >
                {busy ? 'Creating…' : 'Create group and default rooms'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
