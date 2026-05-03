'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  ExternalLink,
  Eye,
  GripVertical,
  Link2,
  Loader2,
  MousePointerClick,
  Plus,
  QrCode,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { QrCodeModal } from '@/components/QrCodeModal';

interface BioLink {
  id?: string;
  title: string;
  url: string;
  position: number;
  clicksTotal?: number;
  isActive: boolean;
}

interface BioPage {
  id?: string;
  handle: string;
  title: string;
  description: string | null;
  viewsTotal: number;
  isActive: boolean;
  links: BioLink[];
}

interface UserLink {
  original_url?: string | null;
  short_code?: string | null;
  custom_alias?: string | null;
}

const emptyLink = (): BioLink => ({
  title: '',
  url: '',
  position: 0,
  isActive: true,
});

function normalizeHandle(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+/, '')
    .replace(/--+/g, '-')
    .slice(0, 40);
}

export default function BioDashboardPage() {
  const [bioPage, setBioPage] = useState<BioPage>({
    handle: '',
    title: '',
    description: '',
    viewsTotal: 0,
    isActive: true,
    links: [emptyLink()],
  });
  const [userLinks, setUserLinks] = useState<UserLink[]>([]);
  const [origin, setOrigin] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  const publicUrl = useMemo(() => {
    if (!origin || !bioPage.handle) return '';
    return `${origin}/@${bioPage.handle}`;
  }, [origin, bioPage.handle]);

  const activeLinks = bioPage.links.filter((link) => link.isActive && link.title && link.url);
  const totalClicks = bioPage.links.reduce((acc, link) => acc + (link.clicksTotal || 0), 0);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 2500);
  };

  const loadBioPage = useCallback(async () => {
    try {
      const [bioResponse, linksResponse] = await Promise.all([
        fetch('/api/user/bio'),
        fetch('/api/user/links?limit=100'),
      ]);
      const bioData = await bioResponse.json();
      const linksData = await linksResponse.json();

      if (bioData.bioPage) {
        setBioPage({
          ...bioData.bioPage,
          description: bioData.bioPage.description || '',
          links: bioData.bioPage.links.length ? bioData.bioPage.links : [emptyLink()],
        });
      }

      setUserLinks(linksData.links || []);
    } catch {
      setError('Erro ao carregar sua página bio.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setOrigin(window.location.origin);
    loadBioPage();
  }, [loadBioPage]);

  const updateLink = (index: number, patch: Partial<BioLink>) => {
    setBioPage((current) => ({
      ...current,
      links: current.links.map((link, linkIndex) => (
        linkIndex === index ? { ...link, ...patch } : link
      )),
    }));
  };

  const addLink = (link?: Partial<BioLink>) => {
    setBioPage((current) => ({
      ...current,
      links: [
        ...current.links,
        {
          ...emptyLink(),
          ...link,
          position: current.links.length,
        },
      ],
    }));
  };

  const removeLink = (index: number) => {
    setBioPage((current) => {
      const nextLinks = current.links.filter((_, linkIndex) => linkIndex !== index);
      return {
        ...current,
        links: nextLinks.length ? nextLinks.map((link, position) => ({ ...link, position })) : [emptyLink()],
      };
    });
  };

  const moveLink = (index: number, direction: -1 | 1) => {
    setBioPage((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.links.length) return current;

      const links = [...current.links];
      const [link] = links.splice(index, 1);
      links.splice(nextIndex, 0, link);

      return {
        ...current,
        links: links.map((item, position) => ({ ...item, position })),
      };
    });
  };

  const addExistingLink = (link: UserLink) => {
    const shortCode = link.custom_alias || link.short_code;
    if (!shortCode || !origin) return;

    addLink({
      title: shortCode,
      url: `${origin}/${shortCode}`,
      isActive: true,
    });
  };

  const copyPublicUrl = async () => {
    if (!publicUrl) return;

    try {
      await navigator.clipboard.writeText(publicUrl);
    } catch {
      const input = document.createElement('input');
      input.value = publicUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }

    showToast('Link da bio copiado');
  };

  const saveBioPage = async () => {
    setSaving(true);
    setError('');

    try {
      const links = bioPage.links
        .filter((link) => link.title.trim() || link.url.trim())
        .map((link, position) => ({
          id: link.id,
          title: link.title.trim(),
          url: link.url.trim(),
          position,
          isActive: link.isActive,
        }));

      const response = await fetch('/api/user/bio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle: bioPage.handle,
          title: bioPage.title,
          description: bioPage.description || undefined,
          isActive: bioPage.isActive,
          links,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar bio');
      }

      setBioPage({
        ...data.bioPage,
        description: data.bioPage.description || '',
        links: data.bioPage.links.length ? data.bioPage.links : [emptyLink()],
      });
      showToast('Página bio salva');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar bio');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Link na bio
          </div>
          <h1 className="text-3xl font-bold text-title">Seu hub público de links</h1>
          <p className="text-text">Organize campanhas, WhatsApp, catálogo, redes e materiais em uma página `@`.</p>
        </div>
        <button
          type="button"
          onClick={saveBioPage}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {saving ? 'Salvando...' : 'Salvar bio'}
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="space-y-5">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="mb-4 text-lg font-bold text-title">Identidade da página</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-title">Handle público</span>
                <div className="flex rounded-xl border border-border bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40">
                  <span className="border-r border-border px-3 py-3 text-text-secondary">@</span>
                  <input
                    value={bioPage.handle}
                    onChange={(event) => setBioPage((current) => ({ ...current, handle: normalizeHandle(event.target.value) }))}
                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-title outline-none"
                    placeholder="seudominio"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-title">Título</span>
                <input
                  value={bioPage.title}
                  onChange={(event) => setBioPage((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-title outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                  placeholder="Nome, marca ou negócio"
                  maxLength={120}
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-bold text-title">Descrição curta</span>
              <textarea
                value={bioPage.description || ''}
                onChange={(event) => setBioPage((current) => ({ ...current, description: event.target.value }))}
                className="min-h-[96px] w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-title outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                placeholder="Conte em uma frase o que as pessoas encontram nos seus links."
                maxLength={280}
              />
            </label>

            <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-title">
              <input
                type="checkbox"
                checked={bioPage.isActive}
                onChange={(event) => setBioPage((current) => ({ ...current, isActive: event.target.checked }))}
                className="h-4 w-4 accent-primary"
              />
              Página pública ativa
            </label>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-title">Links da bio</h2>
                <p className="text-sm text-text">Adicione URLs livres ou reaproveite links curtos existentes.</p>
              </div>
              <button
                type="button"
                onClick={() => addLink()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-bold text-title transition hover:border-primary/50 hover:text-primary"
              >
                <Plus className="h-4 w-4" />
                Adicionar link
              </button>
            </div>

            {userLinks.length > 0 && (
              <div className="mb-5 rounded-xl border border-border bg-background p-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-text-secondary">
                  Adicionar dos meus links
                </p>
                <div className="flex flex-wrap gap-2">
                  {userLinks.slice(0, 8).map((link) => {
                    const shortCode = link.custom_alias || link.short_code;
                    return (
                      <button
                        key={`${shortCode}-${link.original_url}`}
                        type="button"
                        onClick={() => addExistingLink(link)}
                        className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-primary/20"
                      >
                        /{shortCode}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {bioPage.links.map((link, index) => (
                <div key={link.id || index} className="rounded-2xl border border-border bg-background p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-text">
                      <GripVertical className="h-4 w-4" />
                      Link {index + 1}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveLink(index, -1)}
                        disabled={index === 0}
                        className="rounded-lg p-2 text-text transition hover:bg-border hover:text-title disabled:cursor-not-allowed disabled:opacity-40"
                        title="Mover para cima"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveLink(index, 1)}
                        disabled={index === bioPage.links.length - 1}
                        className="rounded-lg p-2 text-text transition hover:bg-border hover:text-title disabled:cursor-not-allowed disabled:opacity-40"
                        title="Mover para baixo"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="rounded-lg p-2 text-text transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-[0.8fr_1.2fr]">
                    <input
                      value={link.title}
                      onChange={(event) => updateLink(index, { title: event.target.value })}
                      className="rounded-xl border border-border bg-surface px-4 py-3 text-title outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                      placeholder="Título do botão"
                      maxLength={120}
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(event) => updateLink(index, { url: event.target.value })}
                      className="rounded-xl border border-border bg-surface px-4 py-3 text-title outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-text">
                      <input
                        type="checkbox"
                        checked={link.isActive}
                        onChange={(event) => updateLink(index, { isActive: event.target.checked })}
                        className="h-4 w-4 accent-primary"
                      />
                      Link ativo
                    </label>
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-bold text-primary">
                      <MousePointerClick className="h-3.5 w-3.5" />
                      {(link.clicksTotal || 0).toLocaleString('pt-BR')} cliques
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-title">
              <Eye className="h-5 w-5 text-primary" />
              Página pública
            </h2>
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-text-secondary">URL da bio</p>
              <p className="mt-2 break-all text-lg font-bold text-primary">
                {publicUrl || 'Defina um @handle'}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={copyPublicUrl}
                disabled={!publicUrl}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Copy className="h-4 w-4" />
                Copiar
              </button>
              <Link
                href={publicUrl || '#'}
                target="_blank"
                className={`inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold transition ${
                  publicUrl ? 'text-title hover:border-primary/50 hover:text-primary' : 'pointer-events-none opacity-50'
                }`}
              >
                <ExternalLink className="h-4 w-4" />
                Abrir
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              disabled={!publicUrl}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-title transition hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <QrCode className="h-4 w-4" />
              QR Code da bio
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="flex items-center gap-2 text-lg font-bold text-title">
              <Link2 className="h-5 w-5 text-primary" />
              Resumo
            </h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between rounded-xl bg-background px-4 py-3">
                <span className="text-text">Links ativos</span>
                <strong className="text-title">{activeLinks.length}</strong>
              </div>
              <div className="flex justify-between rounded-xl bg-background px-4 py-3">
                <span className="text-text">Visitas</span>
                <strong className="text-title">{bioPage.viewsTotal.toLocaleString('pt-BR')}</strong>
              </div>
              <div className="flex justify-between rounded-xl bg-background px-4 py-3">
                <span className="text-text">Cliques</span>
                <strong className="text-title">{totalClicks.toLocaleString('pt-BR')}</strong>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5">
            <h2 className="text-lg font-bold text-title">Prévia mobile</h2>
            <div className="mt-4 rounded-[28px] border border-border bg-background p-4">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-extrabold text-white">
                  {(bioPage.title || 'B').slice(0, 1).toUpperCase()}
                </div>
                <p className="mt-3 text-xs font-bold text-primary">@{bioPage.handle || 'seudominio'}</p>
                <p className="mt-1 font-bold text-title">{bioPage.title || 'Sua marca'}</p>
                <p className="mt-1 text-xs text-text">{bioPage.description || 'Descrição curta da sua página.'}</p>
              </div>
              <div className="mt-4 space-y-2">
                {activeLinks.slice(0, 5).map((link, index) => (
                  <div key={`${link.title}-${index}`} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold text-title">
                    {link.title}
                  </div>
                ))}
                {activeLinks.length === 0 && (
                  <div className="rounded-xl border border-border bg-surface px-3 py-2 text-center text-sm text-text">
                    Seus botões aparecem aqui
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 font-semibold text-white shadow-lg">
          <Check className="h-5 w-5" />
          {toast}
        </div>
      )}

      {publicUrl && (
        <QrCodeModal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          url={publicUrl}
        />
      )}
    </div>
  );
}
