import Link from 'next/link';
import { ArrowRight, BarChart3, CheckCircle2, Clock3, Crown, Link2, QrCode, ShieldCheck } from 'lucide-react';

const nextSteps = [
  {
    icon: Link2,
    title: 'Crie seu primeiro link Premium',
    text: 'Use um alias com nome da campanha para divulgar com mais confiança.',
  },
  {
    icon: QrCode,
    title: 'Gere QR Codes',
    text: 'Leve seus links para flyers, lojas físicas, eventos e propostas.',
  },
  {
    icon: BarChart3,
    title: 'Acompanhe os cliques',
    text: 'Veja quais canais trazem mais tráfego para suas ofertas.',
  },
];

export default function PremiumSuccessPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <section className="rounded-3xl border border-green-200 bg-surface p-6 text-center shadow-2xl shadow-green-500/10 md:p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500 text-white">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            <Crown className="h-4 w-4" />
            Premium ativado
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-title md:text-5xl">
            Parabéns, sua compra foi concluída.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-text">
            Seu acesso Premium está sendo liberado. Em alguns casos, a confirmação do Stripe pode levar alguns segundos enquanto o webhook atualiza sua conta.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-bold text-white transition hover:bg-primary-hover"
            >
              Criar link Premium
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3.5 font-bold text-title transition hover:border-primary/50 hover:text-primary"
            >
              Ir para o dashboard
            </Link>
          </div>

          <div className="mx-auto mt-6 flex max-w-2xl items-center justify-center gap-2 rounded-2xl bg-background p-4 text-sm text-text">
            <Clock3 className="h-5 w-5 shrink-0 text-primary" />
            Se o dashboard ainda pedir Premium, aguarde alguns segundos e atualize a página.
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {nextSteps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.title} className="rounded-2xl border border-border bg-surface p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-bold text-title">{step.title}</h2>
                <p className="mt-2 text-sm leading-6 text-text">{step.text}</p>
              </div>
            );
          })}
        </section>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
            <div>
              <h2 className="font-bold text-title">Confirmação e recibo</h2>
              <p className="mt-1 text-sm leading-6 text-text">
                A Stripe envia os detalhes do pagamento para o email usado no checkout. A assinatura também fica registrada na sua conta assim que o webhook for processado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
