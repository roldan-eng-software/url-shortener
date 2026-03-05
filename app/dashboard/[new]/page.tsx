'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewLinkPage() {
  const router = useRouter();
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch('/api/user/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          originalUrl,
          customAlias: customAlias || undefined
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSuccess(data.shortUrl);
      setOriginalUrl('');
      setCustomAlias('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-text hover:text-title transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-title mb-2">Criar Novo Link</h1>
        <p className="text-text mb-8">Encurte uma URL agora mesmo</p>

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-700 dark:text-green-400 font-medium">Link criado com sucesso!</span>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="text-green-600 hover:text-green-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-3 p-3 bg-white dark:bg-green-900/30 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-300 font-mono break-all">{success}</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Ver todos os links →
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-title mb-2">
              URL Original <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-title placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="https://exemplo.com/pagina-longa"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-title mb-2">
              Alias Customizado <span className="text-text/50">(opcional)</span>
            </label>
            <div className="flex items-center">
              <span className="px-4 py-3 bg-border/30 border border-r-0 border-border rounded-l-xl text-sm text-text">
                urlencurta.com.br/
              </span>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="flex-1 px-4 py-3 bg-surface border border-border rounded-r-xl text-title placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder="meu-link-personalizado"
                maxLength={50}
              />
            </div>
            <p className="mt-2 text-xs text-text/70">
              Use apenas letras minúsculas, números e hifens. Mínimo 3 caracteres.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-5 py-3.5 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed bg-primary hover:bg-primary-hover"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando...
              </span>
            ) : (
              'Criar Link'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
