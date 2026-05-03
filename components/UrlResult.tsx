'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { QrCodeModal } from './QrCodeModal';
import { generateQrCodeDataUrl } from '@/lib/qr';

interface UrlResultProps {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  isPremium?: boolean;
}

interface LinkStats {
  clicks: number;
  clicksGeo?: Record<string, number>;
  clicksDevice?: Record<string, number>;
}

export function UrlResult({ shortCode, shortUrl, isPremium = false }: UrlResultProps) {
  const [copied, setCopied] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [stats, setStats] = useState<LinkStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loadingQrCode, setLoadingQrCode] = useState(true);
  const previewUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/preview/${shortCode}`;

  useEffect(() => {
    setLoadingQrCode(true);
    generateQrCodeDataUrl(shortUrl)
      .then(setQrCodeUrl)
      .catch(console.error)
      .finally(() => setLoadingQrCode(false));
  }, [shortUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = shortUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fetchStats = async () => {
    if (stats) return;
    setLoadingStats(true);
    try {
      const shortCode = shortUrl.split('/').pop();
      const res = await fetch(`/api/urls/${shortCode}/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleShowStats = () => {
    if (!showStats && !stats) {
      fetchStats();
    }
    setShowStats(!showStats);
  };

  const deviceLabels: Record<string, string> = {
    desktop: 'Desktop',
    mobile: 'Mobile',
    tablet: 'Tablet',
  };

  const geoLabels: Record<string, string> = {
    BR: 'Brasil',
    US: 'Estados Unidos',
    PT: 'Portugal',
    ES: 'Espanha',
  };

  return (
    <>
      <div className="space-y-4">
      <div className="p-4 bg-success/10 border border-success/30 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <p className="text-sm text-text mb-1">Sua URL encurtada:</p>
            <p className="text-lg font-bold text-primary break-all">{shortUrl}</p>
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              'px-4 py-2 rounded-xl font-bold transition-all duration-300 whitespace-nowrap hover:scale-[1.02]',
              copied
                ? 'bg-success text-white'
                : 'text-white hover:brightness-110'
            )}
            style={!copied ? { background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' } : undefined}
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-success/20">
          <div className="mb-4 grid gap-4 rounded-xl border border-success/20 bg-white/60 p-3 dark:bg-slate-900/30 sm:grid-cols-[116px_1fr]">
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="flex h-[116px] w-[116px] items-center justify-center rounded-xl border border-border bg-white p-2 transition hover:border-primary/50"
              aria-label="Ver QR Code"
            >
              {loadingQrCode ? (
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              ) : (
                <Image
                  src={qrCodeUrl}
                  alt="QR Code do link encurtado"
                  width={100}
                  height={100}
                  unoptimized
                  className="h-[100px] w-[100px]"
                />
              )}
            </button>
            <div className="flex min-w-0 flex-col justify-center">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">
                <QrCode className="h-4 w-4 text-primary" />
                QR Code automático
              </p>
              <p className="mt-2 text-sm text-text">
                Use em aulas, grupos, blogs, PDFs e materiais impressos.
              </p>
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="mt-3 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white transition hover:bg-primary-hover"
              >
                <QrCode className="h-4 w-4" />
                Ver QR Code
              </button>
            </div>
          </div>

          <div className="mb-4 rounded-xl border border-success/20 bg-white/60 p-3 dark:bg-slate-900/30">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">
              Página de prévia
            </p>
            <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="break-all text-sm font-bold text-title">{previewUrl}</p>
              <Link
                href={`/preview/${shortCode}`}
                target="_blank"
                className="shrink-0 text-sm font-bold text-primary hover:underline"
              >
                Ver prévia
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleShowStats}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>{showStats ? 'Ocultar' : 'Ver'} estatísticas</span>
            </button>

            <span className="text-sm font-medium text-text">
              {stats?.clicks || 0} cliques
            </span>
          </div>

          {showStats && (
            <div className="mt-4 space-y-4">
              {loadingStats ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {isPremium && stats?.clicksGeo && Object.keys(stats.clicksGeo).length > 0 ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-text-secondary mb-2">Por país:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(stats.clicksGeo).map(([code, count]) => (
                            <span key={code} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg">
                              {geoLabels[code] || code}: {count}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-text-secondary mb-2">Por dispositivo:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(stats.clicksDevice || {}).map(([device, count]) => (
                            <span key={device} className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-lg">
                              {deviceLabels[device] || device}: {count}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Upgrade para estatísticas avançadas
                        </p>
                        <Link
                          href="/premium"
                          className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg hover:scale-105 transition-transform"
                        >
                          Premium
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

      <QrCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        url={shortUrl}
      />
    </>
  );
}
