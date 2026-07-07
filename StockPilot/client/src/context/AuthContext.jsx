import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('stockpilot_token'));
  const [user, setUser]   = useState(() => {
    const u = localStorage.getItem('stockpilot_user');
    return u ? JSON.parse(u) : null;
  });

  const login = (tokenValue, userData) => {
    localStorage.setItem('stockpilot_token', tokenValue);
    localStorage.setItem('stockpilot_user', JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('stockpilot_token');
    localStorage.removeItem('stockpilot_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
