import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Service-role client: full access, used only in this backend, never shipped to the app.
export const supabase = createClient(env.supabaseUrl, env.supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
