
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Video, CalendarClock, Flag, Users } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import RsvpButton from '@/components/groups/RsvpButton';
import ReportModal from '@/components/groups/ReportModal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { formatDateTime } from '@/lib/utils';

export default function EventDetail() {
  const { slug, eventId } = useParams();
  const { profile, promptSignIn } = useAuth();
  const [event, setEvent] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: eventRow } = await supabase.from('events').select('*').eq('id', eventId).maybeSingle();
    setEvent(eventRow || null);
    if (eventRow) {
      const { data } = await supabase
        .from('event_rsvps')
        .select('id, status, profile_id, created_at, profiles:profile_id ( display_name )')
        .eq('event_id', eventRow.id)
        .order('created_at');
      setRsvps(data || []);
    }
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    load();
  }, [load, profile]);

  const going = useMemo(() => rsvps.filter((r) => r.status === 'going'), [rsvps]);
  const waitlist = useMemo(() => rsvps.filter((r) => r.status === 'waitlist'), [rsvps]);
  const myRsvp = useMemo(
    () => rsvps.find((r) => r.profile_id === profile?.id && r.status !== 'cancelled'),
    [rsvps, profile]
  );

  if (loading) {
    return (
      <div id="page-event-loading" className="min-h-[70vh] flex items-center justify-center bg-ink">
        <span className="text-lg font-mono text-paper/40">loading event…</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div id="page-event-empty" className="min-h-[70vh] flex flex-col items-center justify-center bg-ink gap-6 px-4 text-center">
        <p className="text-2xl font-display font-extralight text-paper">Event not available.</p>
        <Link to={`/groups/${slug}`} className="text-lg text-spark hover:text-paper transition-colors">
          Back to the group
        </Link>
      </div>
    );
  }

  return (
    <div id="page-event-detail">
      <PageHeader
        label={`event / ${slug}`}
        title={event.title}
        description={event.description || 'No description written for this gathering yet.'}
      />

      <section id="event-body" className="py-16 md:py-24 bg-ink relative overflow-hidden">
        <div className="absolute -bottom-32 -right-32 w-[45vw] h-[45vw] opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-signal">
            <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" fill="none" stroke="currentColor" strokeWidth="0.4" />
          </svg>
        </div>

        <div className="max-w-[2400px] mx-auto relative">
          <div className="grid grid-cols-12 gap-y-12">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-10 flex flex-wrap items-center justify-between gap-4">
              <Link
                to={`/groups/${slug}`}
                className="inline-flex items-center gap-2 text-lg text-paper/50 hover:text-spark transition-colors"
              >
                <ArrowLeft size={18} /> Back to group
              </Link>
              <button
                onClick={() => {
                  if (!promptSignIn('Sign in to file a report.')) return;
                  setReportOpen(true);
                }}
                className="inline-flex items-center gap-2 border border-paper/25 text-paper px-5 py-3 text-lg hover:border-spark hover:text-spark transition-colors"
              >
                <Flag size={18} /> Report this event
              </button>
            </div>

            <div className="col-span-12 px-4 md:col-start-2 md:col-span-5">
              <div className="border border-paper/10 bg-ash clip-notch-tr p-8 space-y-5">
                <p className="flex items-center gap-3 text-lg text-paper/80">
                  <CalendarClock size={18} className="text-spark" /> {formatDateTime(event.starts_at)}
                </p>
                <p className="flex items-center gap-3 text-lg text-paper/80">
                  {event.is_online ? (
                    <Video size={18} className="text-spark" />
                  ) : (
                    <MapPin size={18} className="text-spark" />
                  )}
                  {event.is_online
                    ? event.online_link || 'Online — link shared with attendees'
                    : event.location || 'Location to be confirmed'}
                </p>
                <p className="flex items-center gap-3 text-lg text-paper/80">
                  <Users size={18} className="text-spark" />
                  {event.capacity != null ? `Capacity ${event.capacity}` : 'No capacity limit'}
                </p>

                <div className="pt-5 border-t border-paper/10">
                  <RsvpButton
                    event={event}
                    goingCount={going.length}
                    myRsvp={myRsvp}
                    profileId={profile?.id}
                    onRequireAuth={() => promptSignIn('Sign in to RSVP.')}
                    onRefresh={load}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-12 px-4 md:col-start-8 md:col-span-4">
              <h2 className="text-3xl font-display font-extralight text-paper mb-6">Attending</h2>
              {going.length === 0 ? (
                <p className="text-lg text-paper/50">Nobody yet. Be the first name on the list.</p>
              ) : (
                <ul className="space-y-2">
                  {going.map((r) => (
                    <li key={r.id} className="border border-paper/10 bg-ash px-5 py-3 text-lg text-paper/80">
                      {r.profiles?.display_name || 'member'}
                    </li>
                  ))}
                </ul>
              )}

              {waitlist.length > 0 && (
                <>
                  <h3 className="text-2xl font-display font-extralight text-paper mt-10 mb-4">
                    Waitlist
                  </h3>
                  <ul className="space-y-2">
                    {waitlist.map((r) => (
                      <li key={r.id} className="border border-paper/10 bg-ash/60 px-5 py-3 text-lg text-paper/60">
                        {r.profiles?.display_name || 'member'}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        reporterId={profile?.id}
        groupId={event.group_id}
        eventId={event.id}
      />
    </div>
  );
}
