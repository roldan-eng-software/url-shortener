'use client';

import { useState } from 'react';
import { truncate, cn } from '@/lib/utils';
import { QrCodeModal } from '../QrCodeModal';
import { StatsModal } from './StatsModal';

interface DashboardLinkCardProps {
  id: string;
  shortCode: string;
  originalUrl: string;
  customAlias?: string | null;
  clicksTotal: number;
  createdAt: string;
  onEdit: (id: string, originalUrl: string, customAlias: string) => void;
  onDelete: (id: string) => void;
}

export function DashboardLinkCard({
  id,
  shortCode,
  originalUrl,
  customAlias,
  clicksTotal,
  createdAt,
  onEdit,
  onDelete,
}: DashboardLinkCardProps) {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const shortUrl = customAlias 
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/${customAlias}`
    : `${typeof window !== 'undefined' ? window.location.origin : ''}/${shortCode}`;

  const displayClicks = clicksTotal ?? 0;

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

  const handleDelete = () => {
    onDelete(id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="p-5 bg-surface border border-border rounded-2xl hover:shadow-glow transition-all duration-300">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-text mb-1">Original:</p>
              <p className="text-sm text-title break-all" title={originalUrl}>
                {truncate(originalUrl, 60)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
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

          <div className="flex items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm font-semibold text-title">{displayClicks}</span>
              </div>
              <p className="text-xs text-text">
                {new Date(createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowStatsModal(true)}
                className="p-2 text-text hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
                title="Ver estatísticas"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
              <button
                onClick={() => onEdit(id, originalUrl, customAlias || '')}
                className="p-2 text-text hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
                title="Editar link"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-text hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                title="Excluir link"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <QrCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        url={shortUrl}
      />

      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        linkId={id}
      />

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-surface border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-title mb-2">Confirmar exclusão</h3>
              <p className="text-sm text-text mb-6">
                Tem certeza que deseja excluir este link? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-title bg-border/50 hover:bg-border rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
