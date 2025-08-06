import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yeamusejjlkxjsxjhkud.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllYW11c2VqamxreGpzeGpoa3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzU3MDIsImV4cCI6MjA2OTU1MTcwMn0.SfqemoKz-J8BB5Q6_sJObMEOYqkCnDdo_blqHQv_Q2s';

export const supabase = createClient(supabaseUrl, supabaseKey);
