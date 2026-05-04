'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  Copy,
  Crown,
  History,
  Link2,
  QrCode,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { UrlForm } from '@/components/UrlForm';
import { AdSlotBottom, AdSlotMiddle, AdSlotTop } from '@/components/Adsense';
import { QrCodeModal } from '@/components/QrCodeModal';
import { useAuth } from '@/context/AuthContext';
import { cn, truncate } from '@/lib/utils';
import { UrlHistoryItem } from '@/types';

interface UserLinkResponse {
  short_code: string;
  original_url: string;
  created_at: string;
}

const trustSignals = [
  'Sem cadastro obrigatório',
  'QR Code grátis',
  'Histórico no navegador',
];

const benefits = [
  {
    icon: Zap,
    title: 'Gratuito e rápido',
    description: 'Crie links curtos sem cadastro obrigatório.',
  },
  {
    icon: QrCode,
    title: 'QR Code automático',
    description: 'Cada link pode ser compartilhado também por QR Code.',
  },
  {
    icon: History,
    title: 'Histórico simples',
    description: 'Acesse os últimos links criados no navegador.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Cole sua URL',
    description: 'Use o campo principal para inserir qualquer link válido.',
  },
  {
    number: '02',
    title: 'Clique em encurtar',
    description: 'O URLEncurta gera um link curto em segundos.',
  },
  {
    number: '03',
    title: 'Copie e compartilhe',
    description: 'Envie por mensagem, bio, anúncio ou QR Code.',
  },
];

const faqs = [
  {
    question: 'O URLEncurta é gratuito?',
    answer: 'Sim. Você pode criar links curtos grátis e sem cadastro obrigatório.',
  },
  {
    question: 'Preciso criar conta?',
    answer: 'Não para encurtar links. A conta é útil para histórico completo e recursos Premium.',
  },
  {
    question: 'Os links expiram?',
    answer: 'Os links gratuitos não têm uma data automática de expiração definida.',
  },
  {
    question: 'Posso gerar QR Code?',
    answer: 'Sim. Cada link curto pode ser compartilhado também por QR Code.',
  },
];

export function HomeRedesign() {
  const { isPremium, isLoggedIn, userId } = useAuth();
  const [history, setHistory] = useState<UrlHistoryItem[]>([]);
  const [userLinks, setUserLinks] = useState<UrlHistoryItem[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem('urlHistory');
        setHistory(stored ? JSON.parse(stored) : []);
      } catch {
        setHistory([]);
      }
    };

    loadHistory();
    window.addEventListener('urlHistoryUpdated', loadHistory);
    return () => window.removeEventListener('urlHistoryUpdated', loadHistory);
  }, []);

  useEffect(() => {
    const fetchUserLinks = async () => {
      if (!userId) {
        setUserLinks([]);
        return;
      }

      try {
        const linksRes = await fetch('/api/user/links?limit=100');
        const linksData = await linksRes.json();

        if (linksData.links) {
          setUserLinks(
            linksData.links.map((link: UserLinkResponse) => ({
              shortCode: link.short_code,
              shortUrl: `urlencurta.com.br/${link.short_code}`,
              originalUrl: link.original_url,
              createdAt: link.created_at,
            }))
          );
        }
      } catch (err) {
        console.error('Error fetching links:', err);
      }
    };

    fetchUserLinks();
  }, [userId]);

  const allLinks = useMemo(
    () => (isLoggedIn ? [...userLinks, ...history] : history),
    [history, isLoggedIn, userLinks]
  );
  const displayHistory = isPremium ? allLinks : allLinks.slice(0, 10);
  const hasMoreLinks = !isPremium && allLinks.length > 10;

  return (
    <div className="-mx-4 -my-8 bg-background">
      <HeroShortener />
      <AdSlotTop />
      <CoreBenefits />
      <HowItWorksCompact />

      {displayHistory.length > 0 && (
        <UrlHistorySection
          hasMoreLinks={hasMoreLinks}
          isPremium={isPremium}
          links={displayHistory}
        />
      )}

      <AdSlotMiddle />
      <FaqCompact />
      <PremiumMiniCta />
      <AdSlotBottom />
    </div>
  );
}

function HeroShortener() {
  return (
    <section className="py-10 md:py-14 lg:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <div className="text-center lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
            <Sparkles className="h-4 w-4" />
            Ferramenta gratuita
          </div>

          <h1 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-title md:text-5xl lg:mx-0">
            Encurte seu link grátis
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-text md:text-lg lg:mx-0">
            Cole uma URL e gere um link curto com QR Code em segundos.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-text lg:justify-start">
            {trustSignals.map((signal) => (
              <span key={signal} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-success" />
                {signal}
              </span>
            ))}
          </div>
        </div>

        <div
          id="encurtar"
          className="rounded-2xl border border-border bg-surface p-4 shadow-card md:p-6"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Link2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-title">Cole sua URL</h2>
              <p className="text-sm text-text">
                O formulário principal fica sempre antes dos conteúdos extras.
              </p>
            </div>
          </div>
          <UrlForm />
        </div>
      </div>
    </section>
  );
}

function CoreBenefits() {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-title md:text-3xl">
            Tudo que você precisa para compartilhar links
          </h2>
          <p className="mt-3 text-text">
            Uma experiência simples para criar, copiar e reutilizar seus links sem ruído.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.title}
                className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/40"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-title">{benefit.title}</h3>
                <p className="mt-2 text-sm text-text">{benefit.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorksCompact() {
  return (
    <section className="bg-surface py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-title md:text-3xl">
            Como funciona
          </h2>
          <p className="mt-3 text-text">Três passos curtos, sem telas intermediárias.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-xl border border-border bg-background p-5"
            >
              <span className="text-xs font-extrabold text-primary">{step.number}</span>
              <h3 className="mt-3 text-lg font-bold text-title">{step.title}</h3>
              <p className="mt-2 text-sm text-text">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function UrlHistorySection({
  hasMoreLinks,
  isPremium,
  links,
}: {
  hasMoreLinks: boolean;
  isPremium: boolean;
  links: UrlHistoryItem[];
}) {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-title">Seus links recentes</h2>
            <p className="text-sm text-text">
              Histórico carregado do navegador e da sua conta quando disponível.
            </p>
          </div>
          {isPremium && (
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
              <Crown className="h-3.5 w-3.5" />
              Premium
            </span>
          )}
        </div>

        <div className="space-y-3">
          {links.map((item) => (
            <CompactUrlCard key={`${item.shortCode}-${item.createdAt}`} item={item} />
          ))}
        </div>

        {hasMoreLinks && (
          <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Você atingiu o limite de 10 URLs no histórico gratuito.
              </p>
              <Link
                href="/premium"
                className="inline-flex items-center justify-center rounded-lg bg-yellow-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-yellow-600"
              >
                Ver Premium
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CompactUrlCard({ item }: { item: UrlHistoryItem }) {
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = item.shortUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <article className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="break-all text-sm font-extrabold text-primary sm:text-base">
              {item.shortUrl}
            </p>
            <p className="mt-1 text-sm text-text" title={item.originalUrl}>
              {truncate(item.originalUrl, 74)}
            </p>
            <p className="mt-2 text-xs text-text-secondary">
              {new Date(item.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-bold transition-colors',
                copied
                  ? 'bg-success text-white'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              )}
            >
              <Copy className="h-4 w-4" />
              <span className="hidden xs:inline">{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-background px-3 text-sm font-bold text-text transition-colors hover:text-title"
            >
              <QrCode className="h-4 w-4" />
              <span className="hidden xs:inline">QR Code</span>
            </button>
          </div>
        </div>
      </article>

      <QrCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        url={item.shortUrl}
      />
    </>
  );
}

function FaqCompact() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold text-title md:text-3xl">
            Dúvidas frequentes
          </h2>
          <p className="mt-3 text-text">O essencial antes de criar seu próximo link.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <article
              key={faq.question}
              className="overflow-hidden rounded-xl border border-border bg-surface"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
              >
                <span className="font-semibold text-title">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-text transition-transform',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openIndex === index ? 'max-h-32' : 'max-h-0'
                )}
              >
                <p className="px-4 pb-4 text-sm text-text">{faq.answer}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PremiumMiniCta() {
  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Premium
            </div>
            <h2 className="text-2xl font-extrabold text-title">
              Quer links com sua marca?
            </h2>
            <p className="mt-2 text-sm text-text md:text-base">
              No Premium você usa alias personalizado, histórico completo e estatísticas avançadas.
            </p>
          </div>

          <Link
            href="/premium"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-yellow-500 px-5 text-sm font-bold text-white transition-colors hover:bg-yellow-600"
          >
            Ver Premium
          </Link>
        </div>
      </div>
    </section>
  );
}
