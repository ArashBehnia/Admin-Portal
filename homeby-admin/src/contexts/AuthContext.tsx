import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, UserRole } from '../types/auth';
import { setApiTokens, registerTokenRefreshCallback } from '../lib/axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [staffId, setStaffId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Sync tokens to Axios when accessToken or refreshToken changes
  useEffect(() => {
    setApiTokens(accessToken, refreshToken);
  }, [accessToken, refreshToken]);

  // Register token refresh callback once on mount to keep Context and Axios state in sync
  useEffect(() => {
    registerTokenRefreshCallback((newAccess, newRefresh) => {
      setAccessToken(newAccess);
      setRefreshToken(newRefresh);
    });
  }, []);

  const login = (token: string, rToken: string, newRole: UserRole, newName: string, newStaffId: string) => {
    setAccessToken(token);
    setRefreshToken(rToken);
    setRole(newRole);
    setName(newName);
    setStaffId(newStaffId);
  };

  const updateTokens = (token: string, rToken: string) => {
    setAccessToken(token);
    setRefreshToken(rToken);
  };

  const logout = () => {
    setRole(null);
    setStaffId(null);
    setName(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  return (
    <AuthContext.Provider value={{ role, staffId, name, accessToken, refreshToken, login, updateTokens, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
