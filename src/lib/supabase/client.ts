import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ywafbdqxskfbkvwqcdwa.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3YWZiZHF4c2tmYmt2d3FjZHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMTk2MzEsImV4cCI6MjEwNjc5NTYzMX0.bT0zIxOpGAGZW1qgUC8tlSRMLyma91Roo-FfPE4u2pM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


