import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, UserRole } from '../types/auth';
import { setApiToken } from '../lib/axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [staffId, setStaffId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Sync token to Axios when accessToken changes
  useEffect(() => {
    setApiToken(accessToken);
  }, [accessToken]);

  const login = (token: string, newRole: UserRole, newName: string, newStaffId: string) => {
    setAccessToken(token);
    setRole(newRole);
    setName(newName);
    setStaffId(newStaffId);
  };

  const logout = () => {
    setRole(null);
    setStaffId(null);
    setName(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ role, staffId, name, accessToken, login, logout }}>
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
