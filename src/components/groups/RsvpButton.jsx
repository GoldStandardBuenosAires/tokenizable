
import React, { useState } from 'react';
import { Check, Clock, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function RsvpButton({ event, goingCount, myRsvp, profileId, onRequireAuth, onRefresh }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const atCapacity = event.capacity != null && goingCount >= event.capacity;

  const act = async (status) => {
    if (!profileId) {
      onRequireAuth();
      return;
    }
    setBusy(true);
    setError('');
    const payload = { event_id: event.id, profile_id: profileId, status };
    const { error: upsertError } = myRsvp
      ? await supabase.from('event_rsvps').update({ status }).eq('id', myRsvp.id)
      : await supabase.from('event_rsvps').insert(payload);
    setBusy(false);
    if (upsertError) {
      setError(upsertError.message);
      return;
    }
    onRefresh();
  };

  const going = myRsvp?.status === 'going';
  const waitlisted = myRsvp?.status === 'waitlist';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {going || waitlisted ? (
          <button
            onClick={() => act('cancelled')}
            disabled={busy}
            className="inline-flex items-center gap-2 border border-paper/25 text-paper px-6 py-3 text-lg hover:border-spark hover:text-spark transition-colors disabled:opacity-50"
          >
            <XCircle size={18} /> {going ? 'Cancel my RSVP' : 'Leave waitlist'}
          </button>
        ) : (
          <button
            onClick={() => act(atCapacity ? 'waitlist' : 'going')}
            disabled={busy}
            className="inline-flex items-center gap-2 bg-spark text-ink px-6 py-3 text-lg font-medium clip-arrow-r hover:bg-paper transition-colors disabled:opacity-50"
          >
            {atCapacity ? <Clock size={18} /> : <Check size={18} />}
            {atCapacity ? 'Join waitlist' : 'RSVP — I am going'}
          </button>
        )}
      </div>

      <p className="text-lg text-paper/50 font-mono">
        {goingCount} going
        {event.capacity != null ? ` · ${event.capacity} capacity` : ' · no cap'}
        {going ? ' · you are on the list' : ''}
        {waitlisted ? ' · you are waitlisted' : ''}
      </p>

      {error && <p className="text-lg text-spark">{error}</p>}
    </div>
  );
}
