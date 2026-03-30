import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const SESSION_KEY = 'welfare_shield_auth';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

// Mock government users (for development/demo only)
const MOCK_USERS = [
  { email: 'admin@gov.in', password: 'password123', role: 'admin', name: 'Admin User' },
  { email: 'auditor@gov.in', password: 'password123', role: 'auditor', name: 'Auditor User' },
  { email: 'officer@gov.in', password: 'password123', role: 'officer', name: 'Officer User' },
];

const AuthContext = createContext(null);

function getStoredSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.user?.email || !data?.expiresAt) return null;
    if (Date.now() > data.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function saveSession(user) {
  const data = {
    user: {
      email: user.email,
      role: user.role,
      name: user.name,
    },
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession());

  useEffect(() => {
    if (!session) return;
    const remaining = session.expiresAt - Date.now();
    if (remaining <= 0) {
      setSession(null);
      sessionStorage.removeItem(SESSION_KEY);
      return;
    }
    const timer = setTimeout(() => {
      setSession(null);
      sessionStorage.removeItem(SESSION_KEY);
    }, remaining);
    return () => clearTimeout(timer);
  }, [session]);

  const login = useCallback((email, password) => {
    const normalized = (email || '').trim().toLowerCase();
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === normalized && u.password === password
    );
    if (!user) return { success: false, message: 'Invalid credentials. Please try again.' };
    const sessionData = {
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
      },
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };
    saveSession(user);
    setSession(sessionData);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const value = {
    user: session?.user ?? null,
    isAuthenticated: !!session,
    login,
    logout,
    canWrite: session?.user?.role === 'admin' || session?.user?.role === 'officer',
    isAdmin: session?.user?.role === 'admin',
    isAuditor: session?.user?.role === 'auditor',
    isOfficer: session?.user?.role === 'officer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
