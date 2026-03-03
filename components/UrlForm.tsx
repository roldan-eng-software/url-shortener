'use client';

import { useState, useEffect } from 'react';
import { UrlResult } from './UrlResult';
import Link from 'next/link';

export function UrlForm() {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    shortCode: string;
    shortUrl: string;
    originalUrl: string;
  } | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [showCustomAlias, setShowCustomAlias] = useState(false);
  const [aliasLocked, setAliasLocked] = useState(false);

  useEffect(() => {
    const checkPremium = async () => {
      try {
        const res = await fetch('/api/auth/check-premium');
        const data = await res.json();
        setIsPremium(data.isPremium || false);
      } catch (err) {
        console.error('Error checking premium:', err);
      }
    };
    checkPremium();
  }, []);

  useEffect(() => {
    if (!isPremium) {
      setShowCustomAlias(false);
      setCustomCode('');
    }
  }, [isPremium]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!url.trim()) {
      setError('Por favor, insira uma URL');
      return;
    }

    setLoading(true);

    try {
      const payload: { originalUrl: string; customCode?: string } = { originalUrl: url };
      if (customCode.trim() && isPremium) {
        payload.customCode = customCode.trim();
      }

      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao criar URL');
        return;
      }

      setResult(data);
      setUrl('');
      setCustomCode('');

      const history = JSON.parse(localStorage.getItem('urlHistory') || '[]');
      const newHistory = [
        {
          shortCode: data.shortCode,
          shortUrl: data.shortUrl,
          originalUrl: data.originalUrl,
          createdAt: new Date().toISOString(),
        },
        ...history.slice(0, 9),
      ];
      localStorage.setItem('urlHistory', JSON.stringify(newHistory));
      window.dispatchEvent(new Event('urlHistoryUpdated'));
    } catch {
      setError('Erro ao criar URL. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCustomAlias = () => {
    if (isPremium) {
      setShowCustomAlias(!showCustomAlias);
      if (showCustomAlias) {
        setCustomCode('');
      }
    } else {
      setAliasLocked(true);
      setTimeout(() => setAliasLocked(false), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Cole seu link aqui (WhatsApp, Instagram, etc)"
            className="w-full sm:w-96 px-4 py-3 rounded-xl border border-border bg-surface text-title placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 shadow-glow"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
          >
            {loading ? 'Encurtando...' : '🔥 Encurtar Grátis'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center">
          <button
            type="button"
            onClick={toggleCustomAlias}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
              showCustomAlias
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-surface text-text hover:border-primary/50'
            } ${aliasLocked ? 'animate-pulse' : ''}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-sm font-medium">
              {showCustomAlias ? 'Código personalizado' : 'Adicionar alias'}
            </span>
            {!isPremium && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                PRO
              </span>
            )}
          </button>

          {showCustomAlias && isPremium && (
            <div className="flex-1 w-full">
              <div className="flex items-center bg-surface rounded-xl border border-primary overflow-hidden">
                <span className="px-2 sm:px-3 py-2.5 text-text-secondary bg-primary/10 border-r border-primary/30 text-xs whitespace-nowrap">
                  urlencurta.com.br/
                </span>
                <input
                  id="customCode"
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase())}
                  placeholder="seu-alias"
                  maxLength={50}
                  className="flex-1 px-2 sm:px-3 py-2.5 bg-surface text-title placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300 text-xs min-w-0"
                  disabled={loading}
                />
              </div>
            </div>
          )}
        </div>

        {!isPremium && aliasLocked && (
          <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Alias personalizado é exclusivo para membros Premium!
            </p>
            <Link
              href="/premium"
              className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg hover:scale-105 transition-transform"
            >
              Upgrade
            </Link>
          </div>
        )}
      </form>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-error">
          {error}
        </div>
      )}

      {result && <UrlResult shortCode={result.shortCode} shortUrl={result.shortUrl} originalUrl={result.originalUrl} isPremium={isPremium} />}
    </div>
  );
}
