import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Planos Premium - URLEncurta | Recursos Avançados',
  description: 'Descubra os planos Premium do URLEncurta. URLs customizadas, estatísticas avançadas, QR codes e muito mais.',
};

export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
