
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  MessagesSquare,
  CalendarDays,
  Users,
  Flag,
  ArrowLeft,
  ScrollText,
  Lock,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { TierBadge } from '@/components/groups/GroupCard';
import ReportModal from '@/components/groups/ReportModal';
import StewardPanel from '@/components/groups/StewardPanel';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { formatDateTime } from '@/lib/utils';

export default function GroupDetail() {
  const { slug } = useParams();
  const { user, profile, promptSignIn } = useAuth();
  const [group, setGroup] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [stewards, setStewards] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: groupRow } = await supabase
      .from('groups')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!groupRow) {
      setGroup(null);
      setLoading(false);
      return;
    }
    setGroup(groupRow);

    const [roomsRes, eventsRes, membersRes, stewardsRes, actionsRes] = await Promise.all([
      supabase.from('rooms').select('*').eq('group_id', groupRow.id).order('created_at'),
      supabase.from('events').select('*').eq('group_id', groupRow.id).order('starts_at'),
      supabase
        .from('group_members')
        .select('id, profile_id, is_active, profiles:profile_id ( display_name )')
        .eq('group_id', groupRow.id)
        .eq('is_active', true),
      supabase
        .from('group_stewards')
        .select('id, profile_id, is_active, profiles:profile_id ( display_name )')
        .eq('group_id', groupRow.id)
        .eq('is_active', true),
      supabase
        .from('steward_actions')
        .select('*')
        .eq('group_id', groupRow.id)
        .order('created_at', { ascending: false })
        .limit(8),
    ]);

    setRooms(roomsRes.data || []);
    setEvents(eventsRes.data || []);
    setMembers(membersRes.data || []);
    setStewards(stewardsRes.data || []);
    setActions(actionsRes.data || []);
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    load();
  }, [load, user]);

  const isMember = useMemo(
    () => members.some((m) => m.profile_id === profile?.id),
    [members, profile]
  );
  const isSteward = useMemo(
    () => stewards.some((s) => s.profile_id === profile?.id),
    [stewards, profile]
  );

  const toggleMembership = async () => {
    if (!promptSignIn('Sign in to join this group.')) return;
    setBusy(true);
    if (isMember) {
      const row = members.find((m) => m.profile_id === profile.id);
      await supabase.from('group_members').update({ is_active: false }).eq('id', row.id);
    } else {
      const { error } = await supabase
        .from('group_members')
        .insert({ group_id: group.id, profile_id: profile.id });
      if (error && error.code === '23505') {
        await supabase
          .from('group_members')
          .update({ is_active: true })
          .eq('group_id', group.id)
          .eq('profile_id', profile.id);
      }
    }
    setBusy(false);
    load();
  };

  if (loading) {
    return (
      <div id="page-group-detail-loading" className="min-h-[70vh] flex items-center justify-center bg-ink">
        <span className="text-lg font-mono text-paper/40">loading group…</span>
      </div>
    );
  }

  if (!group) {
    return (
      <div id="page-group-detail-empty" className="min-h-[70vh] flex flex-col items-center justify-center bg-ink gap-6 px-4 text-center">
        <p className="text-2xl font-display font-extralight text-paper">
          This group is not visible to you.
        </p>
        <p className="text-lg font-editorial text-paper/55 max-w-lg">
          Either it does not exist, or it is an adult-only group and your account has no age
          attestation yet.
        </p>
        <Link to="/groups" className="text-lg text-spark hover:text-paper transition-colors">
          Back to the directory
        </Link>
      </div>
    );
  }

  return (
    <div id="page-group-detail">
      <PageHeader
        label={`group / ${group.slug}`}
        title={group.name}
        description={group.description || 'No description written yet.'}
      />

      <section id="group-summary" className="py-14 bg-ink border-b border-paper/10">
        <div className="max-w-[2400px] mx-auto">
          <div className="grid grid-cols-12">
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-10 flex flex-wrap items-center gap-5 justify-between">
              <div className="flex flex-wrap items-center gap-5">
                <Link to="/groups" className="inline-flex items-center gap-2 text-lg text-paper/50 hover:text-spark transition-colors">
                  <ArrowLeft size={18} /> Directory
                </Link>
                <TierBadge tier={group.safety_tier} />
                <span className="inline-flex items-center gap-2 text-lg font-mono text-paper/50">
                  <Users size={16} /> {members.length} members · {stewards.length} stewards
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    if (!promptSignIn('Sign in to file a report.')) return;
                    setReportOpen(true);
                  }}
                  className="inline-flex items-center gap-2 border border-paper/25 text-paper px-5 py-3 text-lg hover:border-spark hover:text-spark transition-colors"
                >
                  <Flag size={18} /> Report
                </button>
                <button
                  onClick={toggleMembership}
                  disabled={busy}
                  className={`px-6 py-3 text-lg font-medium transition-colors disabled:opacity-50 ${
                    isMember
                      ? 'border border-paper/25 text-paper hover:border-spark hover:text-spark'
                      : 'bg-spark text-ink clip-arrow-r hover:bg-paper'
                  }`}
                >
                  {isMember ? 'Leave group' : 'Join group'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="group-body" className="py-20 md:py-28 bg-ink relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[45vw] h-[45vw] opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-spark">
            <polygon points="50,2 92,26 92,74 50,98 8,74 8,26" fill="none" stroke="currentColor" strokeWidth="0.4" />
          </svg>
        </div>

        <div className="max-w-[2400px] mx-auto relative">
          <div className="grid grid-cols-12 gap-y-16">
            {/* Rooms */}
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-5">
              <h2 className="text-3xl font-display font-extralight text-paper mb-6 flex items-center gap-3">
                <MessagesSquare size={24} className="text-spark" /> Rooms
              </h2>
              {!isMember ? (
                <div className="border border-paper/10 bg-ash p-6 flex items-start gap-4">
                  <Lock size={20} className="text-paper/40 mt-1 flex-shrink-0" />
                  <p className="text-lg font-editorial text-paper/65 leading-relaxed">
                    Rooms are member-only, enforced at the database. Join the group to read and post.
                  </p>
                </div>
              ) : rooms.length === 0 ? (
                <p className="text-lg text-paper/50">No rooms yet.</p>
              ) : (
                <ul className="space-y-3">
                  {rooms.map((room) => (
                    <li key={room.id}>
                      <Link
                        to={`/groups/${group.slug}/rooms/${room.id}`}
                        className="block border border-paper/10 bg-ash hover:border-spark transition-colors p-5"
                      >
                        <span className="block text-xl font-display text-paper mb-1">
                          {room.name}
                        </span>
                        <span className="block text-lg text-paper/55">
                          {room.description || 'Persistent room'} ·{' '}
                          {room.room_type === 'discord_bridged' ? 'discord bridged' : 'native'}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Events */}
            <div className="col-span-12 px-4 md:col-start-7 md:col-span-5">
              <h2 className="text-3xl font-display font-extralight text-paper mb-6 flex items-center gap-3">
                <CalendarDays size={24} className="text-spark" /> Events
              </h2>
              {events.length === 0 ? (
                <p className="text-lg text-paper/50">Nothing scheduled yet.</p>
              ) : (
                <ul className="space-y-3">
                  {events.map((event) => (
                    <li key={event.id}>
                      <Link
                        to={`/groups/${group.slug}/events/${event.id}`}
                        className="block border border-paper/10 bg-ash hover:border-spark transition-colors p-5"
                      >
                        <span className="block text-xl font-display text-paper mb-1">
                          {event.title}
                        </span>
                        <span className="block text-lg font-mono text-paper/55">
                          {formatDateTime(event.starts_at)} ·{' '}
                          {event.is_online ? 'online' : event.location || 'location tbc'}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Stewards + log */}
            <div className="col-span-12 px-4 md:col-start-2 md:col-span-5">
              <h2 className="text-3xl font-display font-extralight text-paper mb-6">Stewards</h2>
              {stewards.length === 0 ? (
                <p className="text-lg text-paper/50">
                  No active stewards — this group is eligible for steward election.
                </p>
              ) : (
                <ul className="space-y-2">
                  {stewards.map((s) => (
                    <li key={s.id} className="border border-paper/10 bg-ash px-5 py-4 text-lg text-paper/80">
                      {s.profiles?.display_name || 'steward'}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="col-span-12 px-4 md:col-start-7 md:col-span-5">
              <h2 className="text-3xl font-display font-extralight text-paper mb-6 flex items-center gap-3">
                <ScrollText size={24} className="text-spark" /> Transparency log
              </h2>
              {actions.length === 0 ? (
                <p className="text-lg text-paper/50">No steward actions recorded.</p>
              ) : (
                <ul className="space-y-2">
                  {actions.map((a) => (
                    <li key={a.id} className="border-l-2 border-spark/40 pl-4 py-1">
                      <span className="block text-lg font-mono uppercase text-spark">
                        {a.action_type.replace(/_/g, ' ')}
                      </span>
                      <span className="block text-lg text-paper/60">
                        {a.reason || 'No reason given'} · {formatDateTime(a.created_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {isSteward && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="col-span-12 px-4 md:col-start-2 md:col-span-10"
              >
                <StewardPanel
                  group={group}
                  members={members}
                  events={events}
                  profileId={profile?.id}
                  onRefresh={load}
                />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        reporterId={profile?.id}
        groupId={group.id}
      />
    </div>
  );
}
