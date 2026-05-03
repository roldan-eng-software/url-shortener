'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpRight,
  Eye,
  Link2,
  Loader2,
  MousePointerClick,
} from 'lucide-react';

interface PublicBioLink {
  id: string;
  title: string;
  url: string;
  clicksTotal: number;
}

interface PublicBioPageData {
  handle: string;
  title: string;
  description: string | null;
  viewsTotal: number;
  publicUrl: string;
  links: PublicBioLink[];
}

export function PublicBioPage({ handle }: { handle: string }) {
  const normalizedHandle = handle.replace(/^@/, '');
  const [bioPage, setBioPage] = useState<PublicBioPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadBioPage = async () => {
      try {
        const response = await fetch(`/api/bio/public/${normalizedHandle}`);

        if (!response.ok) {
          throw new Error('Página não encontrada');
        }

        const data = await response.json();

        if (mounted) {
          setBioPage(data.bioPage);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Página não encontrada');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadBioPage();

    return () => {
      mounted = false;
    };
  }, [normalizedHandle]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !bioPage) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4">
        <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
          <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-red-500" />
          <h1 className="text-xl font-bold text-red-800 dark:text-red-200">Página não encontrada</h1>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            Esta bio ainda não existe ou está desativada.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-hover"
          >
            Criar meus links
          </Link>
        </div>
      </div>
    );
  }

  const totalClicks = bioPage.links.reduce((acc, link) => acc + link.clicksTotal, 0);

  return (
    <div className="mx-auto min-h-[74vh] max-w-lg px-2 py-6">
      <section className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-3xl font-extrabold text-white shadow-lg shadow-indigo-500/20">
          {bioPage.title.slice(0, 1).toUpperCase()}
        </div>
        <p className="mt-4 text-sm font-bold text-primary">@{bioPage.handle}</p>
        <h1 className="mt-2 text-3xl font-extrabold text-title">{bioPage.title}</h1>
        {bioPage.description && (
          <p className="mx-auto mt-3 max-w-md text-sm text-text">{bioPage.description}</p>
        )}

        <div className="mt-5 flex justify-center gap-2 text-xs font-semibold text-text-secondary">
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1">
            <Eye className="h-3.5 w-3.5" />
            {bioPage.viewsTotal.toLocaleString('pt-BR')} visitas
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1">
            <MousePointerClick className="h-3.5 w-3.5" />
            {totalClicks.toLocaleString('pt-BR')} cliques
          </span>
        </div>
      </section>

      <section className="mt-8 space-y-3">
        {bioPage.links.length > 0 ? (
          bioPage.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              className="flex min-h-[58px] items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3 font-bold text-title shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary hover:shadow-md"
            >
              <span className="min-w-0 break-words">{link.title}</span>
              <ArrowUpRight className="h-5 w-5 shrink-0" />
            </a>
          ))
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-5 text-center text-sm text-text">
            Nenhum link ativo por aqui ainda.
          </div>
        )}
      </section>

      <footer className="mt-8 text-center">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
          <Link2 className="h-3.5 w-3.5" />
          Feito com URLencurta
        </Link>
      </footer>
    </div>
  );
}
