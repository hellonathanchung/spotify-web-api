import React from 'react';
import { useAuthContext } from '../contexts/AuthContext';

export const Header: React.FC = React.memo(() => {
  const { isAuthenticated, logout, login,refreshToken } = useAuthContext();

  return (
    <header>
      <h1>My App</h1>
      {isAuthenticated ? (
        <><button onClick={logout}>Logout</button><button onClick={refreshToken}> Refresh</button></>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </header>
  );
});
