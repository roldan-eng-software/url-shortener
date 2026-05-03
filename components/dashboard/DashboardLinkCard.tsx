'use client';

import { useState } from 'react';
import {
  BarChart3,
  Check,
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  Link2,
  MousePointerClick,
  QrCode,
  Trash2,
} from 'lucide-react';
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
  const previewUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/preview/${customAlias || shortCode}`;

  const displayClicks = clicksTotal ?? 0;
  const createdLabel = new Date(createdAt).toLocaleDateString('pt-BR');

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
      <div className="rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-glow">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  <Link2 className="h-3.5 w-3.5" />
                  /{customAlias || shortCode}
                </span>
                {displayClicks === 0 && (
                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                    Repostar
                  </span>
                )}
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">Destino</p>
              <p className="mt-1 break-all text-sm text-title" title={originalUrl}>
                {truncate(originalUrl, 60)}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                onClick={handleCopy}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition-all duration-300',
                  copied
                    ? 'bg-success text-white'
                    : 'bg-primary text-white hover:bg-primary-hover'
                )}
                title="Copiar link curto"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-border px-3 py-2 text-text transition hover:border-primary/50 hover:text-primary"
                title="Abrir link curto"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div className="rounded-xl border border-border/70 bg-background px-4 py-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">Link curto</p>
                <p className="mt-1 break-all text-sm font-bold text-primary">{shortUrl}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">Prévia pública</p>
                <p className="mt-1 break-all text-sm font-bold text-title">{previewUrl}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border/50 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 font-semibold text-primary">
                <MousePointerClick className="h-4 w-4" />
                {displayClicks.toLocaleString('pt-BR')} cliques
              </div>
              <p className="text-xs font-medium text-text">Criado em {createdLabel}</p>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowStatsModal(true)}
                className="rounded-lg p-2 text-text transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                title="Ver estatísticas"
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg p-2 text-text transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                title="Ver página de prévia"
              >
                <Eye className="h-4 w-4" />
              </a>
              <button
                onClick={() => setShowQrModal(true)}
                className="rounded-lg p-2 text-text transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                title="Gerar QR Code"
              >
                <QrCode className="h-4 w-4" />
              </button>
              <button
                onClick={() => onEdit(id, originalUrl, customAlias || '')}
                className="rounded-lg p-2 text-text transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                title="Editar link"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-lg p-2 text-text transition-all duration-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                title="Excluir link"
              >
                <Trash2 className="h-4 w-4" />
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
