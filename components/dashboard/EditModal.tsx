'use client';

import { useState, useEffect } from 'react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkId: string;
  initialOriginalUrl: string;
  initialCustomAlias: string;
  onSave: (id: string, originalUrl: string, customAlias: string) => Promise<void>;
}

export function EditModal({ 
  isOpen, 
  onClose, 
  linkId, 
  initialOriginalUrl, 
  initialCustomAlias,
  onSave 
}: EditModalProps) {
  const [originalUrl, setOriginalUrl] = useState(initialOriginalUrl);
  const [customAlias, setCustomAlias] = useState(initialCustomAlias);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setOriginalUrl(initialOriginalUrl);
      setCustomAlias(initialCustomAlias);
      setError(null);
    }
  }, [isOpen, initialOriginalUrl, initialCustomAlias]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSave(linkId, originalUrl, customAlias);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-surface border border-border rounded-2xl max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-lg font-bold text-title">Editar Link</h3>
          <button
            onClick={onClose}
            className="p-2 text-text hover:text-title hover:bg-border/50 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-title mb-2">
              URL Original
            </label>
            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-title placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="https://exemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-title mb-2">
              Alias Customizado (opcional)
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2.5 bg-border/30 border border-r-0 border-border rounded-l-xl text-sm text-text">
                urlencurta.com.br/
              </span>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="flex-1 px-4 py-2.5 bg-background border border-border rounded-r-xl text-title placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="meu-link"
                maxLength={50}
              />
            </div>
            <p className="mt-1.5 text-xs text-text/70">
              Apenas letras minúsculas, números e hifens
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-title bg-border/50 hover:bg-border rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
