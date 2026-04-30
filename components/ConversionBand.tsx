import Link from 'next/link';
import { ArrowRight, BarChart3, Link2, ShieldCheck } from 'lucide-react';
import { LeadCaptureForm } from './LeadCaptureForm';

const bullets = [
  { icon: Link2, text: 'Links com alias de marca' },
  { icon: BarChart3, text: 'Histórico e métricas por link' },
  { icon: ShieldCheck, text: 'URLs validadas e seguras' },
];

export function ConversionBand() {
  return (
    <section className="bg-title py-14 text-white md:py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.12em] text-primary-light">
              Pronto para campanha
            </span>
            <h2 className="mt-3 max-w-3xl text-3xl font-bold md:text-4xl">
              Pare de divulgar links longos. Publique URLs curtas, bonitas e rastreáveis.
            </h2>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/80">
              {bullets.map((item) => {
                const Icon = item.icon;

                return (
                  <span key={item.text} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                    <Icon className="h-4 w-4 text-primary-light" />
                    {item.text}
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <LeadCaptureForm />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a
                href="#encurtar"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-title transition-all hover:scale-[1.02]"
              >
                Criar meu link
                <ArrowRight className="h-5 w-5" />
              </a>
              <Link
                href="/premium"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-bold text-white transition-all hover:bg-white/10"
              >
                Ver premium
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
