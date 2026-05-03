import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  ExternalLink,
  Globe,
  Link2,
  MousePointerClick,
  ShieldCheck,
} from 'lucide-react';
import { findPublicLinkPreview } from '@/lib/data/links';

type PreviewPageProps = {
  params: Promise<{ shortCode: string }>;
};

function getUrlDetails(url: string) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, '');

    return {
      domain: hostname,
      origin: parsedUrl.origin,
      protocol: parsedUrl.protocol.replace(':', '').toUpperCase(),
      title: `Link para ${hostname}`,
      description: `Pré-visualização pública de um link encurtado que leva para ${hostname}.`,
    };
  } catch {
    return {
      domain: url,
      origin: url,
      protocol: 'URL',
      title: 'Link encurtado',
      description: 'Pré-visualização pública de um link encurtado.',
    };
  }
}

function formatClicks(clicks: number) {
  return clicks.toLocaleString('pt-BR');
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const { shortCode } = await params;
  const link = await findPublicLinkPreview(shortCode);

  if (!link || link.isExpired) {
    return {
      title: 'Link não encontrado',
      robots: { index: false, follow: false },
    };
  }

  const details = getUrlDetails(link.originalUrl);

  return {
    title: details.title,
    description: details.description,
    robots: { index: false, follow: true },
    openGraph: {
      title: `${details.title} | URLencurta`,
      description: details.description,
      type: 'website',
    },
  };
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { shortCode } = await params;

  if (!shortCode || shortCode.length > 10) {
    notFound();
  }

  const link = await findPublicLinkPreview(shortCode);

  if (!link || link.isExpired) {
    notFound();
  }

  const details = getUrlDetails(link.originalUrl);
  const accessHref = `/preview/${shortCode}/go`;

  return (
    <div className="mx-auto flex min-h-[68vh] max-w-3xl flex-col justify-center py-8">
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-slate-200/60 dark:shadow-black/20 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Pré-visualização do link
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <BadgeCheck className="h-3.5 w-3.5" />
            {details.protocol}
          </span>
        </div>

        <div className="space-y-5">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-text">
              <Globe className="h-4 w-4 text-primary" />
              {details.domain}
            </p>
            <h1 className="text-3xl font-extrabold tracking-normal text-title sm:text-4xl">
              {details.title}
            </h1>
            <p className="mt-3 text-base text-text sm:text-lg">
              {details.description}
            </p>
          </div>

          <div className="rounded-xl border border-border/80 bg-background p-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-text-secondary">
              <Link2 className="h-3.5 w-3.5" />
              Destino
            </p>
            <p className="break-all text-sm font-medium text-title">
              {link.originalUrl}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-text">
                <MousePointerClick className="h-4 w-4 text-primary" />
                Cliques registrados
              </p>
              <p className="text-2xl font-extrabold text-title">
                {formatClicks(link.clicks)}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-text">
                <BarChart3 className="h-4 w-4 text-primary" />
                Código curto
              </p>
              <p className="break-all font-mono text-2xl font-extrabold text-title">
                /{shortCode}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link
              href={accessHref}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
            >
              Acessar link
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={details.origin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold text-title transition hover:border-primary/50 hover:text-primary"
            >
              Ver domínio
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <p className="mt-5 text-center text-xs font-medium text-text-secondary">
        Feito com{' '}
        <Link href="/" className="font-bold text-primary hover:underline">
          URLencurta
        </Link>
        {' '}·{' '}
        <Link href="/" className="font-bold text-primary hover:underline">
          Encurte URLs grátis
        </Link>
      </p>
    </div>
  );
}
