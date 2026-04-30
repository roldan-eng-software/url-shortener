'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  Check,
  Clipboard,
  Copy,
  ExternalLink,
  Link2,
  Loader2,
  Megaphone,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { QrCodeModal } from '@/components/QrCodeModal';

const campaignExamples = [
  'promo-black-friday',
  'whatsapp-vendas',
  'catalogo-2026',
  'agenda-consultoria',
];

function normalizeAlias(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-')
    .slice(0, 50);
}

function getAliasSeeds(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '').split('.')[0] || 'campanha';
    const path = parsed.pathname.split('/').filter(Boolean).slice(-1)[0] || 'oferta';
    const cleanHost = normalizeAlias(host);
    const cleanPath = normalizeAlias(path);

    return [
      `${cleanHost}-${cleanPath}`,
      `${cleanHost}-whatsapp`,
      `${cleanHost}-promo`,
    ].filter((alias, index, aliases) => alias.length >= 3 && aliases.indexOf(alias) === index);
  } catch {
    return campaignExamples;
  }
}

export default function NewLinkPage() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [createdUrl, setCreatedUrl] = useState('');
  const [copiedValue, setCopiedValue] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aliasSuggestions = useMemo(() => getAliasSeeds(originalUrl), [originalUrl]);
  const previewPath = customAlias || aliasSuggestions[0] || 'sua-campanha';
  const previewUrl = `urlencurta.com.br/${previewPath}`;
  const shareCopy = createdUrl
    ? `Confira aqui: ${createdUrl}`
    : `Confira aqui: https://${previewUrl}`;

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const input = document.createElement('input');
      input.value = value;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }

    setCopiedValue(value);
    setTimeout(() => setCopiedValue(''), 2000);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setCreatedUrl('');
    setLoading(true);

    try {
      const res = await fetch('/api/user/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalUrl,
          customAlias: customAlias || undefined,
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setCreatedUrl(data.shortUrl);
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
          className="inline-flex items-center gap-2 text-text transition-colors hover:text-title"
        >
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section>
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Campanha premium
            </div>
            <h1 className="text-3xl font-bold text-title">Criar link de campanha</h1>
            <p className="mt-2 max-w-2xl text-text">
              Monte um link curto com alias de marca, pronto para copiar, divulgar e acompanhar no dashboard.
            </p>
          </div>

          {createdUrl && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/20">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-2 flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Check className="h-5 w-5" />
                    <span className="font-bold">Link criado com sucesso</span>
                  </div>
                  <p className="break-all font-mono text-sm text-green-900 dark:text-green-100">{createdUrl}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(createdUrl)}
                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700"
                  >
                    {copiedValue === createdUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copiedValue === createdUrl ? 'Copiado' : 'Copiar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-green-300 px-4 py-2 text-sm font-bold text-green-700 transition hover:bg-green-100 dark:border-green-700 dark:text-green-200 dark:hover:bg-green-900/40"
                  >
                    <QrCode className="h-4 w-4" />
                    QR Code
                  </button>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-green-300 px-4 py-2 text-sm font-bold text-green-700 transition hover:bg-green-100 dark:border-green-700 dark:text-green-200 dark:hover:bg-green-900/40"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-5 md:p-6">
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-title">URL de destino</span>
                <span className="relative block">
                  <Link2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="url"
                    value={originalUrl}
                    onChange={(event) => setOriginalUrl(event.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-3.5 pl-12 pr-4 text-title transition-all placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="https://suaempresa.com/oferta"
                    required
                  />
                </span>
              </label>

              <div>
                <label className="mb-2 block text-sm font-bold text-title">
                  Alias da campanha <span className="font-medium text-text-secondary">(opcional)</span>
                </label>
                <div className="flex flex-col sm:flex-row">
                  <span className="rounded-t-xl border border-border bg-border/30 px-4 py-3 text-sm text-text sm:rounded-l-xl sm:rounded-tr-none sm:border-r-0">
                    urlencurta.com.br/
                  </span>
                  <input
                    type="text"
                    value={customAlias}
                    onChange={(event) => setCustomAlias(normalizeAlias(event.target.value))}
                    className="min-w-0 flex-1 rounded-b-xl border border-border bg-background px-4 py-3 text-title transition-all placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 sm:rounded-r-xl sm:rounded-bl-none"
                    placeholder="nome-da-campanha"
                    maxLength={50}
                  />
                </div>
                <p className="mt-2 text-xs text-text/70">
                  Use um nome fácil de falar, digitar e reconhecer nos relatórios.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {aliasSuggestions.map((alias) => (
                    <button
                      key={alias}
                      type="button"
                      onClick={() => setCustomAlias(alias)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary/20"
                    >
                      <Wand2 className="h-3.5 w-3.5" />
                      {alias}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCustomAlias(aliasSuggestions[Math.floor(Math.random() * aliasSuggestions.length)] || '')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-border/50 px-3 py-1.5 text-xs font-bold text-text transition hover:text-title"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Sugerir
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-bold text-white transition-all hover:scale-[1.01] hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Megaphone className="h-5 w-5" />}
                {loading ? 'Criando link...' : 'Criar link de campanha'}
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-title">
              <ExternalLink className="h-5 w-5 text-primary" />
              Preview
            </h2>
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-text-secondary">Link curto</p>
              <p className="mt-2 break-all text-lg font-bold text-primary">{previewUrl}</p>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-text">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                URL validada antes de salvar
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                Métricas ficam no dashboard
              </div>
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-amber-600" />
                QR Code disponível após criar
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-title">
              <Clipboard className="h-5 w-5 text-primary" />
              Copy rápida
            </h2>
            <p className="mt-2 text-sm text-text">
              Use este texto em WhatsApp, Instagram, anúncios ou email.
            </p>
            <div className="mt-4 rounded-xl border border-border bg-background p-4 text-sm text-title">
              {shareCopy}
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(shareCopy)}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-title transition hover:border-primary/50 hover:text-primary"
            >
              {copiedValue === shareCopy ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiedValue === shareCopy ? 'Copy copiada' : 'Copiar copy'}
            </button>
          </div>
        </aside>
      </div>

      {createdUrl && (
        <QrCodeModal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          url={createdUrl}
        />
      )}
    </div>
  );
}
