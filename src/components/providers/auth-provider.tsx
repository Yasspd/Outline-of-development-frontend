'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import {
  CurrentUserProfile,
  clearStoredAuthTokens,
  getCurrentUser,
  getStoredAccessToken,
  getStoredRefreshToken,
  persistAuthTokens,
} from '@/lib/api';

type SessionTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthContextValue = {
  user: CurrentUserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasHydrated: boolean;
  setSession: (tokens: { accessToken: string; refreshToken: string }) => void;
  clearSession: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [session, setSessionState] = useState<SessionTokens>({
    accessToken: null,
    refreshToken: null,
  });

  useEffect(() => {
    setSessionState({
      accessToken: getStoredAccessToken(),
      refreshToken: getStoredRefreshToken(),
    });
    setHasHydrated(true);
  }, []);

  const currentUserQuery = useQuery({
    queryKey: ['current-user', session.accessToken],
    queryFn: () => getCurrentUser(session.accessToken as string),
    enabled: hasHydrated && Boolean(session.accessToken),
    retry: false,
  });

  function setSession(tokens: { accessToken: string; refreshToken: string }) {
    persistAuthTokens(tokens);
    setSessionState(tokens);
    queryClient.invalidateQueries({ queryKey: ['current-user'] });
  }

  function clearSession() {
    clearStoredAuthTokens();
    setSessionState({
      accessToken: null,
      refreshToken: null,
    });
    queryClient.removeQueries({ queryKey: ['current-user'] });
  }

  return (
    <AuthContext.Provider
      value={{
        user: currentUserQuery.data ?? null,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        isAuthenticated: Boolean(session.accessToken && currentUserQuery.data),
        isLoading: !hasHydrated || currentUserQuery.isPending,
        hasHydrated,
        setSession,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
