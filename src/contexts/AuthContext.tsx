import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  PropsWithChildren,
} from "react";
import {
  generateRandomString,
  generateCodeChallenge,
} from "../utils.tsx/authUtils";

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
  requestAccessToken: (code: string) => boolean;
  refreshToken: () => Promise<void>;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => Promise.resolve(),
  logout: () => {},
  requestAccessToken: () => false,
  refreshToken: () => Promise.resolve(),
  isLoading: false,
});

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("access_token"))
  );
  const [isLoading, setIsLoading] = useState(false);

  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID ?? "";
  const redirectUri = process.env.REACT_APP_REDIRECT_URI ?? "";

  useEffect(() => {
    const checkAuthentication = async () => {
      const accessToken = window.localStorage.getItem("access_token");
      const expiresAt = window.localStorage.getItem("expires_at");
      const isAuthenticated = !!accessToken && Date.now() < Number(expiresAt);
      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const expiresIn = Number(expiresAt) - Date.now();
        if (expiresIn < 60000) {
          // Token will expire in less than 1 minute, refresh it
          await refreshToken();
        }
      }
    };

    checkAuthentication();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const login = async () => {
    try {
      setIsLoading(true);
      const codeVerifier = generateRandomString(64);
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const scope =
        "user-read-private user-read-email playlist-modify-private user-library-read";

      localStorage.setItem("code_verifier", codeVerifier);

      const args = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
      });

      window.location.href = "https://accounts.spotify.com/authorize?" + args;
    } catch (error) {
      console.error("Login Failed", error);
      // Handle error requesting access token
    } finally {
      setIsLoading(false);
    }
  };

  type tokenData = {
    access_token: string;
    expires_in: number;
    refresh_token: string;
  };

  const processTokenData = ({
    access_token,
    refresh_token,
    expires_in,
  }: tokenData) => {
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    const t = new Date();
    const expires_at = t.setSeconds(t.getSeconds() + expires_in);
    localStorage.setItem("expires_at", expires_at.toString());
  };

  const requestAccessToken = (code: string): boolean => {
    const accessToken = window.localStorage.getItem("access_token");
    if (accessToken !== null) {
      return true;
    }

    const codeVerifier = localStorage.getItem("code_verifier");
    let success = false;
    let state = generateRandomString(16);

    setIsLoading(true);
    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        state,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier ?? "",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP status " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        processTokenData({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_in: data.expires_in,
        });

        setIsAuthenticated(true);
        success = true;
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    return success;
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: "refresh_token",
          refresh_token: localStorage.getItem("refresh_token") ?? "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      processTokenData({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        isLoading,
        requestAccessToken,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
