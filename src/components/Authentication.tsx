import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

export const Authentication: React.FC = () => {
  const { isAuthenticated, requestAccessToken } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {

    if(isAuthenticated){
      navigate('/search')
    }

    const handleAuthentication = async () => {
      // Handle the authorization callback from Spotify
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code && !isAuthenticated ) {
        const result = await requestAccessToken(code);
        if (result) {
          navigate('/search');
        }
      }
    };
    if (!isAuthenticated){

      handleAuthentication();
    }
  }, [isAuthenticated, navigate, requestAccessToken]);

  return (
    <div>
      <h1>Authentication</h1>
      <p>Processing authentication...</p>
    </div>
  );
};

