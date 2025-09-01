// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

// Get environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase environment check:', {
  url: supabaseUrl ? supabaseUrl.substring(0, 10) + '...' : 'missing',
  key: supabaseAnonKey ? 'present' : 'missing'
});

// Check if the required environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL or Anonymous Key is missing. Make sure your .env.local file has the required values:',
    { url: supabaseUrl ? '✓' : '✗', key: supabaseAnonKey ? '✓' : '✗' }
  );
}

// Create Supabase client
let supabase = null;
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
    
    // Test connection
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Supabase connection test failed:', error);
      } else {
        console.log('Supabase connection test successful:', !!data.session);
      }
    });
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

// Database table constants
export const TABLES = {
  EVENTS: 'events',
  MEMBERS: 'members',
  PUBLICATIONS: 'publications',
  EXECUTIVE_COMMITTEE: 'executive_committee',
  NEWS: 'news',
  GALLERY: 'gallery',
  CONTACT_MESSAGES: 'contact_messages',
  ACHIEVEMENTS: 'achievements',
  SITE_STATS: 'site_stats',
  // New tables for user management
  ORGANIZATIONS: 'organizations',
  USER_ROLES: 'user_roles'
};

// Helper function to check if tables exist
export const checkTablesExist = async () => {
  if (!supabase) return { exists: false, error: 'Supabase client not initialized' };
  
  try {
    // Test if the user_roles table exists
    const { data: userData, error: userError } = await supabase
      .from(TABLES.USER_ROLES)
      .select('id')
      .limit(1);
      
    if (userError && userError.code === '42P01') {
      console.error('User roles table does not exist:', userError);
      return { exists: false, error: userError };
    }
    
    // Test if the organizations table exists
    const { data: orgData, error: orgError } = await supabase
      .from(TABLES.ORGANIZATIONS)
      .select('id')
      .limit(1);
      
    if (orgError && orgError.code === '42P01') {
      console.error('Organizations table does not exist:', orgError);
      return { exists: false, error: orgError };
    }
    
    return { exists: true };
  } catch (error) {
    console.error('Error checking tables:', error);
    return { exists: false, error };
  }
};

// Create a fallback "empty" client if real one failed to initialize
if (!supabase) {
  console.warn('Using mock Supabase client as fallback');
  // This mock implementation prevents crashes when Supabase isn't available
  supabase = {
    auth: {
      getSession: async () => ({ data: null, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Mock client - authentication disabled' } }),
      signOut: async () => ({ error: null })
    },
    from: () => ({
      select: () => ({ eq: () => ({ data: [], error: null }) }),
      insert: () => ({ data: null, error: { message: 'Mock client - database operations disabled' } }),
      update: () => ({ eq: () => ({ data: null, error: null }) }),
      delete: () => ({ eq: () => ({ error: null }) })
    })
  };
}

export { supabase };