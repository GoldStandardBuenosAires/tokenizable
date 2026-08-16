
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Flag } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import RoomChat from '@/components/groups/RoomChat';
import ReportModal from '@/components/groups/ReportModal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';

export default function RoomView() {
  const { slug, roomId } = useParams();
  const { profile, promptSignIn } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('rooms').select('*').eq('id', roomId).maybeSingle();
    setRoom(data || null);
    setLoading(false);
  }, [roomId]);

  useEffect(() => {
    load();
  }, [load, profile]);

  if (loading) {
    return (
      <div id="page-room-loading" className="min-h-[70vh] flex items-center justify-center bg-ink">
        <span className="text-lg font-mono text-paper/40">loading room…</span>
      </div>
    );
  }

  if (!room) {
    return (
      <div id="page-room-locked" className="min-h-[70vh] flex flex-col items-center justify-center bg-ink gap-6 px-4 text-center">
        <p className="text-2xl font-display font-extralight text-paper">Room not available.</p>
        <p className="text-lg font-editorial text-paper/55 max-w-lg">
          Rooms are readable only by active members of the parent group — that rule lives in the
          database, not in this interface.
        </p>
        <Link to={`/groups/${slug}`} className="text-lg text-spark hover:text-paper transition-colors">
          Back to the group
        </Link>
      </div>
    );
  }

  return (
    <div id="page-room-view">
      <PageHeader
        label={`room / ${slug}`}
        title={room.name}
        description={room.description || 'A persistent room — the thing that keeps a community alive between events.'}
      />

      <section id="room-body" className="py-16 md:py-24 bg-ink">
        <div className="max-w-[2400px] mx-auto">
          <div className="grid grid-cols-12 gap-y-8">
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
                <Flag size={18} /> Report this room
              </button>
            </div>

            <div className="col-span-12 px-4 md:col-start-2 md:col-span-10">
              <RoomChat
                roomId={room.id}
                profileId={profile?.id}
                onRequireAuth={() => promptSignIn('Sign in to post in this room.')}
              />
            </div>
          </div>
        </div>
      </section>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        reporterId={profile?.id}
        groupId={room.group_id}
        roomId={room.id}
      />
    </div>
  );
}
