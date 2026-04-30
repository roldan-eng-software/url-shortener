'use client';

import { useState, useEffect } from 'react';
import { UrlResult } from './UrlResult';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Clipboard, Crown, Link2, Loader2, Wand2 } from 'lucide-react';
import { trackConversionEvent } from './GoogleAnalytics';

const exampleUrls = [
  'https://wa.me/5511999999999',
  'https://instagram.com/suaempresa',
  'https://sua-loja.com/promocao',
];

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
  const { isPremium } = useAuth();
  const [showCustomAlias, setShowCustomAlias] = useState(false);
  const [aliasLocked, setAliasLocked] = useState(false);

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
      trackConversionEvent('short_link_created', {
        link_type: isPremium ? 'premium' : 'free',
        custom_alias: Boolean(payload.customCode),
      });
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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setError('');
      }
    } catch {
      setError('Não foi possível ler a área de transferência.');
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex min-h-[52px] items-stretch rounded-xl border border-border bg-surface shadow-glow focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
            <div className="hidden sm:flex w-12 items-center justify-center border-r border-border text-primary">
              <Link2 className="h-5 w-5" />
            </div>
            <input
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Cole seu link aqui"
              className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-title placeholder-text-secondary focus:outline-none sm:rounded-none"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handlePaste}
              disabled={loading}
              className="hidden sm:inline-flex items-center gap-2 border-l border-border px-4 text-sm font-semibold text-text transition-colors hover:text-primary disabled:opacity-50"
            >
              <Clipboard className="h-4 w-4" />
              Colar
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            data-track="form_submit"
            data-track-category="url"
            data-track-label="home_shortener"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-success px-6 py-3 font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Encurtando...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" />
                Encurtar grátis
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {exampleUrls.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setUrl(example)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-text transition-colors hover:border-primary/50 hover:text-primary"
            >
              {example.replace('https://', '')}
            </button>
          ))}
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
            <Crown className="h-4 w-4" />
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
          <div className="flex flex-col gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Use links com sua marca no Premium.
            </p>
            <Link
              href="/premium"
              data-track="cta_click"
              data-track-category="url"
              data-track-label="alias_locked_upgrade"
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
