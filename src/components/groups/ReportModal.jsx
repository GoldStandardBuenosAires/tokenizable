
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flag, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ReportModal({ open, onClose, reporterId, groupId, roomId, eventId }) {
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const invalid = touched && reason.trim().length < 10;

  const close = () => {
    setReason('');
    setSent(false);
    setError('');
    setTouched(false);
    onClose();
  };

  const submit = async (event) => {
    event.preventDefault();
    setTouched(true);
    if (reason.trim().length < 10) return;
    setBusy(true);
    setError('');
    const { error: insertError } = await supabase.from('reports').insert({
      reporter_id: reporterId,
      group_id: groupId || null,
      room_id: roomId || null,
      event_id: eventId || null,
      reason: reason.trim(),
    });
    setBusy(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setSent(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="groups-report-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[65] bg-ink/92 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className="relative w-full max-w-xl bg-ash border border-paper/10 clip-notch-tr p-8 md:p-10"
          >
            <button
              onClick={close}
              aria-label="Close report"
              className="absolute top-5 right-5 text-paper/50 hover:text-spark transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <Flag size={18} className="text-spark" />
              <span className="text-lg font-mono uppercase tracking-widest text-spark">
                report to safety council
              </span>
            </div>

            {sent ? (
              <div className="border border-spark/40 bg-spark/10 p-6 flex items-start gap-4">
                <CheckCircle2 size={22} className="text-spark mt-1 flex-shrink-0" />
                <p className="text-lg text-paper/85 leading-relaxed">
                  Filed. Stewards of this group and the platform safety council can see it, and the
                  resolution gets written to the transparency log.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5">
                <p className="text-lg font-editorial text-paper/70 leading-relaxed">
                  Reports route to this group's stewards and the central safety council — never to a
                  single organiser with unilateral discretion.
                </p>
                <div>
                  <label htmlFor="report-reason" className="text-lg font-mono uppercase tracking-wider text-paper/50 block mb-3">
                    what happened
                  </label>
                  <textarea
                    id="report-reason"
                    rows={5}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="Describe the behaviour, where it happened, and when."
                    className={`w-full px-4 py-4 text-lg bg-ink border outline-none transition-colors text-paper placeholder:text-paper/30 resize-none ${
                      invalid ? 'border-spark' : 'border-paper/15 focus:border-spark'
                    }`}
                  />
                  {invalid && (
                    <p className="text-lg text-spark mt-2">
                      Add a little more detail so a steward can act on it.
                    </p>
                  )}
                </div>
                {error && (
                  <p className="text-lg text-spark border border-spark/30 bg-spark/10 px-4 py-3">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full bg-spark text-ink py-4 text-lg font-medium hover:bg-paper transition-colors disabled:opacity-50"
                >
                  {busy ? 'Filing…' : 'File report'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
