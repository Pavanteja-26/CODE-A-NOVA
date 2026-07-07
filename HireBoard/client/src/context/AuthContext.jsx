import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Quick verification if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          // We stored role and name in localStorage during login for quick access
          setUser({
            _id: decoded.id,
            role: localStorage.getItem('role'),
            name: localStorage.getItem('name'),
            email: localStorage.getItem('email'),
          });
        }
      } catch (err) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token, role, name, _id } = res.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    localStorage.setItem('email', res.data.email);
    
    setUser({ _id, role, name, email: res.data.email });
    return res.data;
  };

  const register = async (userData) => {
    const res = await axios.post(`${API_URL}/auth/register`, userData);
    const { token, role, name, _id, email } = res.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    
    setUser({ _id, role, name, email });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
