'use client';

import { useState } from 'react';
import { truncate, cn } from '@/lib/utils';
import { QrCodeModal } from './QrCodeModal';

interface UrlCardProps {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
}

export function UrlCard({ shortUrl, originalUrl, createdAt }: UrlCardProps) {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

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

  return (
    <>
      <div className="p-4 bg-surface border border-border rounded-2xl hover:shadow-glow transition-all duration-300">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text mb-1">Original:</p>
              <p className="text-sm text-title break-all" title={originalUrl}>
                {truncate(originalUrl, 50)}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text mb-1">Encurtada:</p>
              <p className="text-sm font-bold text-primary break-all">{shortUrl}</p>
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                'px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-300 shrink-0',
                copied
                  ? 'bg-success text-white'
                  : 'bg-primary/10 text-primary hover:bg-primary/20 hover:scale-[1.02]'
              )}
            >
              {copied ? 'OK!' : 'Copiar'}
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-text">
              {new Date(createdAt).toLocaleDateString('pt-BR')}
            </p>
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-border/50 text-text hover:bg-border hover:text-title transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              QR Code
            </button>
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
