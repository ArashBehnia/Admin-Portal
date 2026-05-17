import React, { createContext, useContext, useState } from 'react';

export interface AuthContextType {
  role: 'superadmin' | 'admin' | 'support' | 'reviewer' | 'content-editor' | null;
  staffId: string | null;
  name: string | null;
  accessToken: string | null;
  login: (token: string, role: AuthContextType['role'], name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<AuthContextType['role']>(null);
  const [staffId, setStaffId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = (token: string, newRole: AuthContextType['role'], newName: string) => {
    setAccessToken(token);
    setRole(newRole);
    setName(newName);
    setStaffId('demo-staff-id'); // Hardcoded for demo
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
