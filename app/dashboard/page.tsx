'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
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
  };

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
          ? { ...link, original_url: originalUrl, custom_alias: customAlias || null }
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
    } catch (err) {
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-title">Meus Links</h1>
          <p className="text-text">Gerencie seus links encurtados</p>
        </div>
        
        <Link
          href="/dashboard/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] bg-primary hover:bg-primary-hover"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Link
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 bg-surface border border-border rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-text">Total de Links</p>
              <p className="text-2xl font-bold text-title">{links.length}</p>
            </div>
          </div>
        </div>

        <div className="p-5 bg-surface border border-border rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-text">Total de Cliques</p>
              <p className="text-2xl font-bold text-title">{totalClicks.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </div>

        <div className="p-5 bg-surface border border-border rounded-2xl sm:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-text">Status</p>
              <p className="text-2xl font-bold text-title">Premium</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar links..."
            className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-title placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
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
