import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import LoadingScreen from '@/components/LoadingScreen';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if we have a hash in the URL
        if (window.location.hash) {
          // Parse the hash fragment
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken && refreshToken) {
            // Set the session manually
            const { data: { session }, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) throw error;
            
            if (session) {
              // Create user record in Supabase if it doesn't exist
              const { error: profileError } = await supabase
                .from('users')
                .upsert([
                  {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata.name || session.user.email?.split('@')[0],
                    auth_id: session.user.id,
                    last_login_at: new Date().toISOString(),
                  }
                ], {
                  onConflict: 'id',
                  ignoreDuplicates: false,
                });

              if (profileError) {
                console.error('Error upserting user profile:', profileError);
              }

              // Redirect to payment link if available, otherwise to dashboard
              if (redirectUrl && session.user.email) {
                const baseUrl = decodeURIComponent(redirectUrl);
                window.location.href = `${baseUrl}?prefilled_email=${encodeURIComponent(session.user.email)}`;
                return;
              }
              
              navigate('/dashboard');
              return;
            }
          }
        }
        
        // Fallback to checking the session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
          if (redirectUrl && session.user.email) {
            const baseUrl = decodeURIComponent(redirectUrl);
            window.location.href = `${baseUrl}?prefilled_email=${encodeURIComponent(session.user.email)}`;
          } else {
            navigate('/dashboard');
          }
        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate, redirectUrl]);

  return <LoadingScreen />;
};

export default AuthCallback; 