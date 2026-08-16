
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { supabase } from '@/lib/supabase';
import SignInModal from '@/components/groups/SignInModal';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setSession(data?.session ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      if (nextSession) {
        setModalOpen(false);
        setStatus('idle');
      }
    });
    return () => {
      cancelled = true;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const loadProfile = useCallback(async (user) => {
    if (!user) {
      setProfile(null);
      return null;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      setProfile(null);
      return null;
    }
    if (data) {
      setProfile(data);
      return data;
    }

    const fallbackName = (user.email || 'member').split('@')[0];
    const { data: created, error: insertError } = await supabase
      .from('profiles')
      .insert({ id: user.id, display_name: fallbackName })
      .select()
      .single();

    if (insertError) {
      setProfile(null);
      return null;
    }
    setProfile(created);
    return created;
  }, []);

  useEffect(() => {
    loadProfile(session?.user ?? null);
  }, [session, loadProfile]);

  const promptSignIn = useCallback(
    (reason) => {
      if (session?.user) return true;
      setModalReason(reason || '');
      setStatus('idle');
      setErrorMessage('');
      setModalOpen(true);
      return false;
    },
    [session]
  );

  const sendMagicLink = useCallback(async (email) => {
    setStatus('sending');
    setErrorMessage('');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.href },
    });
    if (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Could not send the link. Try again in a moment.');
      return;
    }
    setStatus('sent');
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const setAgeVerified = useCallback(
    async (value) => {
      if (!session?.user) return { error: new Error('Not signed in') };
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_age_verified: value })
        .eq('id', session.user.id)
        .select()
        .single();
      if (!error && data) setProfile(data);
      return { data, error };
    },
    [session]
  );

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      promptSignIn,
      signOut,
      setAgeVerified,
      refreshProfile: () => loadProfile(session?.user ?? null),
    }),
    [session, profile, loading, promptSignIn, signOut, setAgeVerified, loadProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SignInModal
        open={modalOpen}
        reason={modalReason}
        status={status}
        errorMessage={errorMessage}
        onSubmit={sendMagicLink}
        onClose={() => setModalOpen(false)}
      />
    </AuthContext.Provider>
  );
}
