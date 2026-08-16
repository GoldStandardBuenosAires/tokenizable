
import React, { useEffect, useRef, useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatShortTime } from '@/lib/utils';

const SELECT = 'id, content, created_at, profile_id, profiles:profile_id ( display_name )';

export default function RoomChat({ roomId, profileId, onRequireAuth }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const { data, error: loadError } = await supabase
        .from('room_messages')
        .select(SELECT)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(200);
      if (cancelled) return;
      if (loadError) setError(loadError.message);
      setMessages(data || []);
      setLoading(false);
    };

    load();

    const channel = supabase
      .channel(`room-messages-${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'room_messages', filter: `room_id=eq.${roomId}` },
        async (payload) => {
          const { data } = await supabase.from('room_messages').select(SELECT).eq('id', payload.new.id).maybeSingle();
          const incoming = data || payload.new;
          setMessages((prev) => (prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming]));
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  const send = async (event) => {
    event.preventDefault();
    if (!profileId) {
      onRequireAuth();
      return;
    }
    const content = draft.trim();
    if (!content) return;
    setDraft('');
    const { error: insertError } = await supabase
      .from('room_messages')
      .insert({ room_id: roomId, profile_id: profileId, content });
    if (insertError) setError(insertError.message);
  };

  return (
    <div id="room-chat" className="border border-paper/10 bg-ash clip-notch-tr flex flex-col h-[62vh] min-h-[420px]">
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {loading && <p className="text-lg font-mono text-paper/40">loading messages…</p>}
        {!loading && messages.length === 0 && (
          <p className="text-lg font-editorial text-paper/50">
            Nothing here yet. Say the first thing — persistent rooms are what keep a community alive
            between events.
          </p>
        )}
        {messages.map((message) => (
          <div key={message.id} className="border-l-2 border-spark/40 pl-4">
            <div className="flex items-baseline gap-3 flex-wrap mb-1">
              <span className="text-lg text-paper font-display">
                {message.profiles?.display_name || 'member'}
              </span>
              <span className="text-lg font-mono text-paper/35">
                {formatShortTime(message.created_at)}
              </span>
            </div>
            <p className="text-lg font-editorial text-paper/75 leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && <p className="text-lg text-spark px-6 pb-2">{error}</p>}

      <form onSubmit={send} noValidate className="border-t border-paper/10 p-4 flex items-end gap-3">
        <textarea
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write to the room…"
          className="flex-1 px-4 py-3 text-lg bg-ink border border-paper/15 focus:border-spark outline-none transition-colors text-paper placeholder:text-paper/30 resize-none"
        />
        <button
          type="submit"
          className="bg-spark text-ink px-5 py-3 text-lg font-medium hover:bg-paper transition-colors flex items-center gap-2"
        >
          <SendHorizonal size={18} /> Send
        </button>
      </form>
    </div>
  );
}
