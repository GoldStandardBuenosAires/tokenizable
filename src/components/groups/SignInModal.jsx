
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Send, CheckCircle2 } from 'lucide-react';

export default function SignInModal({ open, reason, status, errorMessage, onSubmit, onClose }) {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);

  const invalid = touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = (event) => {
    event.preventDefault();
    setTouched(true);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    onSubmit(email.trim());
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="auth-signin-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-ink/92 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className="relative w-full max-w-xl bg-ash border border-paper/10 clip-notch-tr p-8 md:p-10"
          >
            <button
              onClick={onClose}
              aria-label="Close sign in"
              className="absolute top-5 right-5 text-paper/50 hover:text-spark transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-spark" />
              <span className="text-lg font-mono uppercase tracking-widest text-spark">
                membership sign in
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-display font-extralight text-paper leading-tight mb-4">
              One link. <span className="italic font-editorial text-spark">No password.</span>
            </h2>
            <p className="text-lg font-editorial text-paper/70 leading-relaxed mb-8">
              {reason || 'Sign in to join groups, post in rooms, and RSVP to events.'} We email you a
              magic link — nothing to remember, nothing to leak.
            </p>

            {status === 'sent' ? (
              <div className="border border-spark/40 bg-spark/10 p-6 flex items-start gap-4">
                <CheckCircle2 size={22} className="text-spark mt-1 flex-shrink-0" />
                <p className="text-lg text-paper/85 leading-relaxed">
                  Link sent. Open it on this device and you will land back here, signed in.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5">
                <div>
                  <label
                    htmlFor="signin-email"
                    className="text-lg font-mono uppercase tracking-wider text-paper/50 block mb-3"
                  >
                    your email
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-paper/40"
                    />
                    <input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched(true)}
                      placeholder="you@somewhere.com"
                      className={`w-full pl-12 pr-4 py-4 text-lg bg-ink border outline-none transition-colors text-paper placeholder:text-paper/30 ${
                        invalid ? 'border-spark' : 'border-paper/15 focus:border-spark'
                      }`}
                    />
                  </div>
                  {invalid && (
                    <p className="text-lg text-spark mt-2">
                      That address does not look right — check the spelling.
                    </p>
                  )}
                </div>

                {status === 'error' && errorMessage && (
                  <p className="text-lg text-spark border border-spark/30 bg-spark/10 px-4 py-3">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-spark text-ink py-4 text-lg font-medium hover:bg-paper transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={18} />
                  {status === 'sending' ? 'Sending link…' : 'Send magic link'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
