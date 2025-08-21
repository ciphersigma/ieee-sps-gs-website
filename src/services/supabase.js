// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

// Get environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
  SITE_STATS: 'site_stats'
};

export { supabase };