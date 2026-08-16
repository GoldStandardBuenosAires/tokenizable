
import React, { useState } from 'react';
import { ShieldAlert, UserMinus, CalendarX, ArrowRightLeft } from 'lucide-react';
import { supabase, TIER_META } from '@/lib/supabase';

const TIER_ORDER = ['family_friendly', 'all_ages', 'adult_only'];

export default function StewardPanel({ group, members, events, profileId, onRefresh }) {
  const [busy, setBusy] = useState('');
  const [note, setNote] = useState('');

  const changeTier = async (nextTier) => {
    if (nextTier === group.safety_tier) return;
    setBusy(`tier-${nextTier}`);
    const { error } = await supabase
      .from('groups')
      .update({ safety_tier: nextTier, tier_changed_at: new Date().toISOString() })
      .eq('id', group.id);
    if (!error) {
      await supabase.from('steward_actions').insert({
        group_id: group.id,
        action_type: 'tier_change',
        performed_by: profileId,
        target_id: group.id,
        reason: `Tier moved to ${TIER_META[nextTier].label}`,
      });
      setNote('Tier changed. Every member sees this in the transparency log.');
      onRefresh();
    } else {
      setNote(error.message);
    }
    setBusy('');
  };

  const removeMember = async (member) => {
    setBusy(`member-${member.id}`);
    const { error } = await supabase
      .from('group_members')
      .update({ is_active: false })
      .eq('id', member.id);
    if (!error) {
      await supabase.from('steward_actions').insert({
        group_id: group.id,
        action_type: 'remove_member',
        performed_by: profileId,
        target_id: member.profile_id,
        reason: 'Removed by steward action',
      });
      setNote('Member removed and logged.');
      onRefresh();
    } else {
      setNote(error.message);
    }
    setBusy('');
  };

  const cancelEvent = async (event) => {
    setBusy(`event-${event.id}`);
    const { error } = await supabase.from('steward_actions').insert({
      group_id: group.id,
      action_type: 'cancel_event',
      performed_by: profileId,
      target_id: event.id,
      reason: `Cancelled: ${event.title}`,
    });
    setNote(error ? error.message : 'Cancellation logged for this event.');
    setBusy('');
    if (!error) onRefresh();
  };

  return (
    <div id="group-steward-panel" className="border border-spark/30 bg-spark/5 clip-notch-tr p-8">
      <div className="flex items-center gap-3 mb-6">
        <ShieldAlert size={20} className="text-spark" />
        <span className="text-lg font-mono uppercase tracking-widest text-spark">steward actions</span>
      </div>

      <p className="text-lg font-editorial text-paper/70 leading-relaxed mb-8 max-w-2xl">
        Every action below writes an immutable row to this group's transparency log, visible to all
        members. No quiet settings toggles.
      </p>

      <div className="space-y-8">
        <div>
          <h4 className="text-xl font-display text-paper mb-4 flex items-center gap-2">
            <ArrowRightLeft size={18} className="text-spark" /> Safety tier
          </h4>
          <div className="flex flex-wrap gap-3">
            {TIER_ORDER.map((tier) => (
              <button
                key={tier}
                onClick={() => changeTier(tier)}
                disabled={busy === `tier-${tier}`}
                className={`px-5 py-3 text-lg border transition-colors disabled:opacity-50 ${
                  group.safety_tier === tier
                    ? 'bg-spark border-spark text-ink'
                    : 'border-paper/20 text-paper/70 hover:border-spark hover:text-spark'
                }`}
              >
                {TIER_META[tier].label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xl font-display text-paper mb-4 flex items-center gap-2">
            <UserMinus size={18} className="text-spark" /> Members
          </h4>
          {members.length === 0 ? (
            <p className="text-lg text-paper/50">No active members yet.</p>
          ) : (
            <ul className="space-y-2">
              {members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-4 border border-paper/10 bg-ink px-4 py-3"
                >
                  <span className="text-lg text-paper/80">
                    {m.profiles?.display_name || 'member'}
                  </span>
                  <button
                    onClick={() => removeMember(m)}
                    disabled={busy === `member-${m.id}` || m.profile_id === profileId}
                    className="text-lg text-paper/50 hover:text-spark transition-colors disabled:opacity-30"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h4 className="text-xl font-display text-paper mb-4 flex items-center gap-2">
            <CalendarX size={18} className="text-spark" /> Events
          </h4>
          {events.length === 0 ? (
            <p className="text-lg text-paper/50">Nothing scheduled.</p>
          ) : (
            <ul className="space-y-2">
              {events.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-4 border border-paper/10 bg-ink px-4 py-3"
                >
                  <span className="text-lg text-paper/80">{e.title}</span>
                  <button
                    onClick={() => cancelEvent(e)}
                    disabled={busy === `event-${e.id}`}
                    className="text-lg text-paper/50 hover:text-spark transition-colors disabled:opacity-30"
                  >
                    Log cancellation
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {note && <p className="text-lg text-spark mt-8">{note}</p>}
    </div>
  );
}
