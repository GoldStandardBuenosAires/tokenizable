
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://jltsxibuwxjkdornfmcv.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdHN4aWJ1d3hqa2Rvcm5mbWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MTc5MDEsImV4cCI6MjEwMjM5MzkwMX0.0PBX8ysYvNWICDdYKIRNwRjccBOd-VIqeNj9-F0xTl8';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const TIER_META = {
  family_friendly: { label: 'family friendly', badge: 'bg-signal text-ink' },
  all_ages: { label: 'all ages', badge: 'bg-paper text-ink' },
  adult_only: { label: 'adult only 18+', badge: 'bg-spark text-ink' },
};

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}
