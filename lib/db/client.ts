import { createClient } from '@supabase/supabase-js';

// The database URL and anon key come from the environment. The env var names
// and the `@supabase/supabase-js` package name are fixed by the provider and
// cannot be renamed; everything else in the app refers to this simply as `db`.
const databaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const databaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!databaseUrl || !databaseAnonKey) {
  // Previously this silently fell back to a placeholder URL, so a missing or
  // misspelled env var looked like an empty database instead of a config error.
  const missing = [
    !databaseUrl && 'NEXT_PUBLIC_SUPABASE_URL',
    !databaseAnonKey && 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ].filter(Boolean).join(' and ');
  console.error(
    `Database client is not configured: ${missing} is not set. ` +
    'Add it to .env.local (and to your hosting provider) and restart.'
  );
}

export const db = createClient(
  databaseUrl || 'https://placeholder.invalid',
  databaseAnonKey || 'placeholder-key'
);
