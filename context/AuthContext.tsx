'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  isPremium: boolean;
  userId: string | null;
  email: string | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/check-premium');
      const data = await res.json();
      
      setIsLoggedIn(!!data.userId);
      setIsPremium(data.isPremium || false);
      setUserId(data.userId || null);
      setEmail(data.email || null);
    } catch (err) {
      console.error('Error checking auth:', err);
      setIsLoggedIn(false);
      setIsPremium(false);
      setUserId(null);
      setEmail(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setIsPremium(false);
      setUserId(null);
      setEmail(null);
      window.location.href = '/';
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      isPremium,
      userId,
      email,
      loading,
      checkAuth,
      logout
    }}>
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
