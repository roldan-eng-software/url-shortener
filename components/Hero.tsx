import Link from 'next/link';
import { BarChart3, Check, Link2, MousePointerClick, QrCode, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { UrlForm } from '@/components/UrlForm';

const trustSignals = [
  'Sem cadastro para começar',
  'QR Code em todos os links',
  'Pronto para campanhas',
];

const proofItems = [
  { value: '50K+', label: 'links encurtados' },
  { value: '1M+', label: 'cliques monitorados' },
  { value: '99.9%', label: 'disponibilidade' },
  { value: '3s', label: 'para criar um link' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden py-12 md:py-20 aurora-bg">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-10 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-5 flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                <Sparkles className="h-4 w-4" />
                Encurte, rastreie e venda mais com links melhores
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-title mb-6 leading-tight">
              Links curtos que transformam cliques em clientes
            </h1>
            <p className="text-lg md:text-xl font-semibold text-text mb-8 max-w-2xl mx-auto lg:mx-0">
              Crie URLs curtas para WhatsApp, Instagram, TikTok, anúncios e campanhas. Use QR Code, histórico e métricas para saber quais canais realmente trazem resultado.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-8">
              <a
                href="#encurtar"
                data-track="cta_click"
                data-track-category="home"
                data-track-label="hero_create_link"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white transition-all hover:bg-primary-hover hover:scale-[1.02]"
              >
                <Zap className="h-5 w-5" />
                Criar link agora
              </a>
              <Link
                href="/premium"
                data-track="cta_click"
                data-track-category="home"
                data-track-label="hero_premium"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 font-bold text-title transition-all hover:border-primary/50 hover:text-primary"
              >
                <BarChart3 className="h-5 w-5" />
                Ver plano premium
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm text-text">
              {trustSignals.map((signal) => (
                <div key={signal} className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  <span>{signal}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div id="encurtar" className="bg-surface rounded-2xl shadow-card-xl p-5 md:p-7 border border-border transition-all duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-primary/10">
                <Link2 className="w-6 h-6 text-primary" />
              </div>
              <div className="inline-block px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full mb-3">
                Sem cadastro obrigatório
              </div>
              <h2 className="text-xl font-bold text-title">Cole sua URL e publique melhor</h2>
              <p className="text-text text-sm mt-1">Ideal para bio, WhatsApp, flyers, anúncios e propostas.</p>
            </div>
            <UrlForm />
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-text">
              <span className="rounded-lg bg-background px-2 py-2"><MousePointerClick className="mx-auto mb-1 h-4 w-4 text-primary" />Cliques</span>
              <span className="rounded-lg bg-background px-2 py-2"><QrCode className="mx-auto mb-1 h-4 w-4 text-primary" />QR Code</span>
              <span className="rounded-lg bg-background px-2 py-2"><ShieldCheck className="mx-auto mb-1 h-4 w-4 text-primary" />Seguro</span>
            </div>
          </div>
        </div>
        
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {proofItems.map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">{item.value}</div>
              <div className="text-text text-xs sm:text-sm">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
