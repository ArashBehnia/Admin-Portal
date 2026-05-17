export type UserRole = 'superadmin' | 'admin' | 'support' | 'reviewer' | 'content-editor';

export interface AuthContextType {
  role: UserRole | null;
  staffId: string | null;
  name: string | null;
  accessToken: string | null;
  login: (token: string, role: UserRole, name: string, staffId: string) => void;
  logout: () => void;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  'mfa-required': boolean;
  'session-token': string;
}

export interface MfaVerifyRequest {
  code: string;
  'session-token': string;
}

export interface MfaVerifyResponse {
  'access-token': string;
  'refresh-token': string;
  role: UserRole;
  name?: string;
  'staff-id'?: string;
  'expires-at': string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  message: string;
}
