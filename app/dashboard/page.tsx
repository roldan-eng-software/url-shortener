'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  CalendarClock,
  CopyPlus,
  Crown,
  Link2,
  MousePointerClick,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { DashboardLinkCard } from '@/components/dashboard/DashboardLinkCard';
import { EditModal } from '@/components/dashboard/EditModal';

interface UserLink {
  id: string;
  original_url?: string | null;
  short_code?: string | null;
  custom_alias?: string | null;
  clicks_total?: number | null;
  created_at?: string | null;
}

export default function DashboardPage() {
  const [links, setLinks] = useState<UserLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<{ id: string; originalUrl: string; customAlias: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadLinks = useCallback(async () => {
    try {
      const res = await fetch('/api/user/links?limit=100');
      const data = await res.json();
      setLinks(data.links || []);
    } catch (err) {
      console.error('Error loading links:', err);
      showToast('error', 'Erro ao carregar links');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (id: string, originalUrl: string, customAlias: string) => {
    setEditingLink({ id, originalUrl, customAlias });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (id: string, originalUrl: string, customAlias: string) => {
    try {
      const res = await fetch(`/api/user/links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl, customAlias }),
      });
      
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setLinks(links.map(link => 
        link.id === id 
          ? {
              ...link,
              original_url: originalUrl,
              custom_alias: customAlias || null,
              ...(customAlias && { short_code: customAlias }),
            }
          : link
      ));
      
      showToast('success', 'Link atualizado com sucesso');
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/user/links/${id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setLinks(links.filter(link => link.id !== id));
      showToast('success', 'Link excluído com sucesso');
    } catch {
      showToast('error', 'Erro ao excluir link');
    }
  };

  const filteredLinks = links.filter(link => {
    const originalUrl = link.original_url || '';
    const shortCode = link.short_code || '';
    const customAlias = link.custom_alias || '';
    const query = searchQuery.toLowerCase();
    
    return (
      originalUrl.toLowerCase().includes(query) ||
      shortCode.toLowerCase().includes(query) ||
      customAlias.toLowerCase().includes(query)
    );
  });

  const totalClicks = links.reduce((acc, link) => acc + (link.clicks_total || 0), 0);
  const averageClicks = links.length > 0 ? Math.round(totalClicks / links.length) : 0;
  const linksWithoutClicks = links.filter((link) => (link.clicks_total || 0) === 0).length;
  const topLink = links.reduce<UserLink | null>((best, link) => {
    if (!best) return link;
    return (link.clicks_total || 0) > (best.clicks_total || 0) ? link : best;
  }, null);
  const newestLink = links[0];

  const statCards = [
    {
      label: 'Links ativos',
      value: links.length.toLocaleString('pt-BR'),
      helper: `${filteredLinks.length} na busca atual`,
      icon: Link2,
      tone: 'bg-primary/10 text-primary',
    },
    {
      label: 'Cliques totais',
      value: totalClicks.toLocaleString('pt-BR'),
      helper: `${averageClicks.toLocaleString('pt-BR')} por link`,
      icon: MousePointerClick,
      tone: 'bg-green-500/10 text-green-600',
    },
    {
      label: 'Melhor link',
      value: topLink ? (topLink.clicks_total || 0).toLocaleString('pt-BR') : '0',
      helper: topLink?.short_code ? `/${topLink.short_code}` : 'Aguardando dados',
      icon: TrendingUp,
      tone: 'bg-blue-500/10 text-blue-600',
    },
    {
      label: 'Sem cliques',
      value: linksWithoutClicks.toLocaleString('pt-BR'),
      helper: linksWithoutClicks ? 'Divulgue novamente' : 'Boa tração',
      icon: Target,
      tone: 'bg-amber-500/10 text-amber-600',
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary">
            <Crown className="h-3.5 w-3.5" />
            Dashboard Premium
          </div>
          <h1 className="text-3xl font-bold text-title">Central de performance</h1>
          <p className="text-text">Gerencie, copie, analise e priorize os links que trazem clientes.</p>
        </div>
        
        <Link
          href="/dashboard/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:bg-primary-hover"
        >
          <Plus className="h-5 w-5" />
          Novo Link
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.label} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-text">{card.label}</p>
                  <p className="mt-1 text-3xl font-bold text-title">{card.value}</p>
                  <p className="mt-1 text-xs font-medium text-text-secondary">{card.helper}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-title">Próxima melhor ação</h2>
              {links.length === 0 ? (
                <p className="mt-1 text-sm text-text">
                  Crie um link com alias de campanha e compartilhe no WhatsApp, Instagram e anúncios.
                </p>
              ) : linksWithoutClicks > 0 ? (
                <p className="mt-1 text-sm text-text">
                  Existem {linksWithoutClicks} links sem clique. Reposte os principais canais e troque o texto da chamada.
                </p>
              ) : (
                <p className="mt-1 text-sm text-text">
                  Seus links já têm tração. Abra as estatísticas do melhor link e replique o canal que mais converte.
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/dashboard/new"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-hover"
                >
                  <CopyPlus className="h-4 w-4" />
                  Criar campanha
                </Link>
                {topLink?.id && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery(topLink.short_code || topLink.custom_alias || '')}
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-bold text-title transition hover:border-primary/50 hover:text-primary"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Ver melhor link
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-title text-white">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-title">Link mais recente</h2>
              <p className="text-sm text-text">
                {newestLink?.short_code ? `/${newestLink.short_code}` : 'Nenhum link criado ainda'}
              </p>
            </div>
          </div>
          <p className="mt-4 break-all text-sm text-text">
            {newestLink?.original_url || 'Crie seu primeiro link para iniciar o histórico de campanhas.'}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-surface p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por URL, alias ou código curto..."
            className="w-full rounded-xl border border-border bg-background py-3 pl-12 pr-4 text-title placeholder:text-text/50 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="rounded-lg bg-border/50 px-3 py-1.5 text-xs font-semibold text-text transition hover:text-title"
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => {
              const zeroClickLink = links.find((link) => (link.clicks_total || 0) === 0);
              setSearchQuery(zeroClickLink?.short_code || '');
            }}
            disabled={!linksWithoutClicks}
            className="rounded-lg bg-border/50 px-3 py-1.5 text-xs font-semibold text-text transition hover:text-title disabled:cursor-not-allowed disabled:opacity-50"
          >
            Sem cliques
          </button>
          {topLink?.short_code && (
            <button
              type="button"
              onClick={() => setSearchQuery(topLink.short_code || '')}
              className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
            >
              Melhor link
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-title">Links da conta</h2>
          <p className="text-sm text-text">
            {filteredLinks.length.toLocaleString('pt-BR')} de {links.length.toLocaleString('pt-BR')} links exibidos
          </p>
        </div>
        <Link href="/dashboard/new" className="hidden text-sm font-bold text-primary hover:text-primary-hover sm:inline-flex">
          Criar novo
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredLinks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-border/50 flex items-center justify-center">
            <svg className="w-8 h-8 text-text/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-title mb-2">Nenhum link encontrado</h3>
          <p className="text-text mb-6">
            {searchQuery ? 'Tente buscar com outros termos' : 'Comece criando seu primeiro link'}
          </p>
          {!searchQuery && (
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] bg-primary hover:bg-primary-hover"
            >
              Criar Primeiro Link
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLinks.map((link) => (
            <DashboardLinkCard
              key={link.id}
              id={link.id}
              shortCode={link.short_code || ''}
              originalUrl={link.original_url || ''}
              customAlias={link.custom_alias}
              clicksTotal={link.clicks_total ?? 0}
              createdAt={link.created_at || new Date().toISOString()}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {editModalOpen && editingLink && (
        <EditModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingLink(null);
          }}
          linkId={editingLink.id}
          initialOriginalUrl={editingLink.originalUrl}
          initialCustomAlias={editingLink.customAlias}
          onSave={handleSaveEdit}
        />
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg z-50 ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
