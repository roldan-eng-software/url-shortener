import { Building2, Megaphone, MessageCircle, Store, TrendingUp, Users } from 'lucide-react';

const useCases = [
  {
    icon: MessageCircle,
    title: 'WhatsApp e atendimento',
    description: 'Envie links curtos em mensagens, propostas e status sem parecer improvisado.',
  },
  {
    icon: Megaphone,
    title: 'Anuncios e campanhas',
    description: 'Separe cada canal com um link próprio e descubra onde o clique vira interesse.',
  },
  {
    icon: Store,
    title: 'Comercio local',
    description: 'Coloque QR Codes em balcão, cardápio, embalagem e panfleto com destino editável.',
  },
  {
    icon: Users,
    title: 'Influencers e criadores',
    description: 'Transforme bio, stories e publis em links simples de memorizar e compartilhar.',
  },
  {
    icon: Building2,
    title: 'Times comerciais',
    description: 'Padronize links de vendedores e acompanhe quais materiais geram mais cliques.',
  },
  {
    icon: TrendingUp,
    title: 'Growth e performance',
    description: 'Use alias de campanha para comparar tráfego orgânico, pago, QR Code e social.',
  },
];

export function UseCases() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-[0.12em] text-primary">
            Feito para vender mais
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-title">
            Cada link pode virar uma campanha mensurável
          </h2>
          <p className="mt-4 text-lg text-text">
            O URLEncurta ajuda quem precisa publicar rápido, testar canais e entender de onde vêm os melhores cliques.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary/40 hover:shadow-glow"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-title">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
