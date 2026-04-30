'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  Clock3,
  Crown,
  Download,
  Headphones,
  Link2,
  Loader2,
  QrCode,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const premiumFeatures = [
  { icon: Link2, text: 'Aliases personalizados para campanhas e marca' },
  { icon: BarChart3, text: 'Métricas por país, dispositivo e origem de tráfego' },
  { icon: QrCode, text: 'QR Codes ilimitados para materiais físicos e eventos' },
  { icon: Download, text: 'Histórico salvo para acompanhar performance no tempo' },
  { icon: Headphones, text: 'Suporte prioritário para manter campanhas no ar' },
  { icon: ShieldCheck, text: 'URLs validadas com proteção contra destinos inseguros' },
];

const comparisonRows = [
  { label: 'Links encurtados', free: 'Ilimitados', premium: 'Ilimitados' },
  { label: 'Alias personalizado', free: 'Não incluso', premium: 'Incluso' },
  { label: 'Dashboard de performance', free: 'Básico', premium: 'Completo' },
  { label: 'QR Code', free: 'Limitado', premium: 'Ilimitado' },
  { label: 'Histórico por link', free: 'Limitado', premium: 'Salvo na conta' },
  { label: 'Suporte', free: 'Padrão', premium: 'Prioritário' },
];

const outcomes = [
  'Troque links longos por URLs fáceis de falar, lembrar e medir.',
  'Descubra quais canais realmente trazem cliques para suas ofertas.',
  'Crie links de campanha em segundos e copie direto para WhatsApp, Instagram ou anúncios.',
];

const faqs = [
  {
    question: 'Tem teste grátis?',
    answer: 'Sim. O checkout cria uma assinatura com 7 dias de teste antes da cobrança recorrente.',
  },
  {
    question: 'Meus links param se eu cancelar?',
    answer: 'Não. Links já criados continuam redirecionando. Você perde apenas os recursos premium ativos.',
  },
  {
    question: 'Preciso cadastrar cartão?',
    answer: 'O checkout é processado pela Stripe e usa cartão para ativar a assinatura com teste.',
  },
];

export default function PremiumPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  const handleCheckout = async () => {
    setError('');

    if (!isLoggedIn) {
      router.push('/login?redirect=/premium');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || 'Erro ao processar pagamento');
        return;
      }

      window.location.href = data.url;
    } catch {
      setError('Erro ao conectar com o checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {(success || canceled || error) && (
        <div className="container mx-auto max-w-6xl px-4 pt-4">
          {success && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
              Checkout iniciado. Verifique seu email e finalize a confirmação da assinatura.
            </div>
          )}
          {canceled && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
              Checkout cancelado. Sua conta continua no plano atual.
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}
        </div>
      )}

      <section className="py-14 md:py-20">
        <div className="container mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              <Crown className="h-4 w-4" />
              Premium para quem divulga links todos os dias
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-title md:text-5xl">
              Transforme cada link em uma campanha mensurável.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-text">
              Pare de compartilhar URLs genéricas. Use links curtos com alias de marca, QR Code e métricas para saber o que realmente gera cliques.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-white transition hover:scale-[1.02] hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                {loading ? 'Abrindo checkout...' : 'Começar 7 dias grátis'}
              </button>
              <a
                href="mailto:suporte@urlencurta.com.br?subject=Plano%20Empresarial%20URLEncurta"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3.5 font-bold text-title transition hover:border-primary/50 hover:text-primary"
              >
                <Users className="h-5 w-5" />
                Falar com vendas
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-text">
              <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2">
                <Clock3 className="h-4 w-4 text-primary" />
                7 dias grátis
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                Checkout seguro Stripe
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2">
                <X className="h-4 w-4 text-red-500" />
                Cancele quando quiser
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-primary/20 bg-surface p-6 shadow-2xl shadow-primary/10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-primary">Plano recomendado</p>
                <h2 className="mt-2 text-3xl font-bold text-title">Premium</h2>
              </div>
              <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-white">
                Mais vendido
              </span>
            </div>

            <div className="rounded-2xl bg-background p-5">
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold text-title">R$ 29,90</span>
                <span className="pb-2 text-text">/mês</span>
              </div>
              <p className="mt-2 text-sm text-text">Teste por 7 dias antes da primeira cobrança.</p>
            </div>

            <div className="mt-6 space-y-3">
              {premiumFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div key={feature.text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-text">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              {loading ? 'Processando...' : 'Assinar Premium'}
            </button>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-12">
        <div className="container mx-auto grid max-w-6xl gap-4 px-4 md:grid-cols-3">
          {outcomes.map((outcome, index) => (
            <div key={outcome} className="rounded-2xl border border-border bg-background p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {index === 0 ? <Link2 className="h-5 w-5" /> : index === 1 ? <Target className="h-5 w-5" /> : <MegaphoneIcon />}
              </div>
              <p className="text-sm leading-6 text-text">{outcome}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-title">Grátis ajuda. Premium vende melhor.</h2>
            <p className="mt-3 text-text">A diferença aparece quando você precisa repetir campanhas e entender o resultado.</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr] border-b border-border bg-background px-4 py-3 text-sm font-bold text-title">
              <span>Recurso</span>
              <span>Grátis</span>
              <span>Premium</span>
            </div>
            {comparisonRows.map((row) => (
              <div key={row.label} className="grid grid-cols-[1.3fr_0.8fr_0.8fr] border-b border-border px-4 py-4 text-sm last:border-b-0">
                <span className="font-semibold text-title">{row.label}</span>
                <span className="text-text">{row.free}</span>
                <span className="inline-flex items-center gap-2 font-bold text-primary">
                  <Check className="h-4 w-4" />
                  {row.premium}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-title py-14 text-white md:py-16">
        <div className="container mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-primary-light">Próxima campanha</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold md:text-4xl">
              Crie links curtos, rastreáveis e prontos para venda ainda hoje.
            </h2>
          </div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-title transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
            Começar agora
          </button>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-center text-3xl font-bold text-title">Perguntas rápidas</h2>
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-border bg-surface p-5">
                <h3 className="flex items-center gap-2 font-bold text-title">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-text">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function MegaphoneIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 15.5v3.25a1.25 1.25 0 0 1-2.4.49L6 15.5m4 0H6m4 0 7.5 3.5V5L10 8.5m0 7V8.5m0 0H5.75A2.75 2.75 0 0 0 3 11.25v1.5a2.75 2.75 0 0 0 2.75 2.75H6" />
    </svg>
  );
}
