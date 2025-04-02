import { createClient } from '@supabase/supabase-js';
import config from '@/config/environment';

if (!config.supabaseUrl || !config.supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: {
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
      },
    });
  }
  return supabaseInstance;
})(); 