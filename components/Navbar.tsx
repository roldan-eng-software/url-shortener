'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/useTheme';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, cycleTheme, mounted } = useTheme();
  const [isPremium, setIsPremium] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check-premium');
        const data = await res.json();
        setIsPremium(data.isPremium || false);
        setIsLoggedIn(!!data.userId);
      } catch (err) {
        console.error('Error checking auth:', err);
      }
    };
    checkAuth();
  }, []);

  const getThemeIcon = () => {
    if (!mounted) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    }
    
    switch (theme) {
      case 'light':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'dark':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <>
      <nav className="bg-surface border-b border-border sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" 
                   style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <span className="text-xl font-bold text-title">URLEncurta</span>
              {isPremium && (
                <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full">
                  PRO
                </span>
              )}
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/como-funciona" className="text-text hover:text-primary transition-colors font-medium">
                Como Funciona
              </Link>
              <Link href="/premium" className="text-text hover:text-primary transition-colors font-medium">
                Premium
              </Link>
              
              <button
                onClick={cycleTheme}
                className="p-2.5 rounded-xl text-text hover:bg-border/50 hover:text-primary transition-all duration-300"
                aria-label="Mudar tema"
                title={theme === 'light' ? 'Modo claro' : theme === 'dark' ? 'Modo escuro' : 'Automático'}
              >
                {getThemeIcon()}
              </button>
              
              {isLoggedIn ? (
                <Link
                  href={isPremium ? "/dashboard" : "/login"}
                  className="px-5 py-2.5 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: isPremium ? 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}
                >
                  <span className="flex items-center gap-2">
                    <span>{isPremium ? '📊' : '👤'} {isPremium ? 'Dashboard' : 'Minha Conta'}</span>
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}
                >
                  Entrar
                </Link>
              )}
            </div>
            
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={cycleTheme}
                className="p-2.5 rounded-xl text-text hover:bg-border/50 hover:text-primary transition-all duration-300"
                aria-label="Mudar tema"
              >
                {getThemeIcon()}
              </button>
              
              <button 
                className="p-2 text-text hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col gap-4">
                <Link 
                  href="/como-funciona" 
                  className="text-text hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Como Funciona
                </Link>
                <Link 
                  href="/premium" 
                  className="text-text hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Premium
                </Link>
                <Link
                  href={isLoggedIn && isPremium ? "/dashboard" : "/login"}
                  className="px-5 py-3 text-white font-semibold rounded-xl text-center transition-all duration-300 hover:scale-[1.02]"
                  style={{ 
                    background: isLoggedIn && isPremium
                      ? 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' 
                      : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' 
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {isLoggedIn ? (isPremium ? '📊 Dashboard' : '👤 Minha Conta') : 'Entrar'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
