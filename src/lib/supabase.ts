import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://jughxjhaqaearaamlglp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1Z2h4amhhcWFlYXJhYW1sZ2xwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NzIxMTMsImV4cCI6MjA5NTA0ODExM30.jF-tiV7f5JvVaW5zdYAwWus2g_2lkSdD0QDiju6eV10";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
