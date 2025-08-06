import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/db';

const email = 'mnelmaghraby145@gmail.com'; // only if hardcoded login
const password = '111111';               // only if hardcoded login

const autoLogin = async () => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error('Auto-login failed: ' + error.message);
  }
  return 'Logged in';
};

export const useAutoLogin = () => {
  return useQuery({
    queryKey: ['auto-login'],
    queryFn: autoLogin,
    retry: false,
  });
};
