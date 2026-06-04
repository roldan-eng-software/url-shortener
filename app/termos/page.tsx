import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Termos de Uso - URLEncurta',
  description: 'Termos de Uso do URLEncurta. Leia as condições para uso do encurtador de links.',
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-title">Termos de Uso</h1>
        <p className="mt-3 text-sm text-text-secondary">
          Última atualização: 14 de maio de 2026
        </p>
      </div>

      <div className="space-y-8 text-text">
        <Section title="1. Aceitação">
          <p>
            Ao usar o URLEncurta, você concorda com estes Termos de Uso e com as
            regras aplicáveis ao serviço. Se não concordar, não utilize a plataforma.
          </p>
        </Section>

        <Section title="2. Serviço">
          <p>
            O URLEncurta permite criar links curtos, gerar QR Codes, redirecionar
            visitantes, acompanhar estatísticas básicas e usar recursos Premium quando
            contratados. O fluxo gratuito permanece disponível sem cadastro obrigatório.
          </p>
        </Section>

        <Section title="3. Uso permitido">
          <ul className="list-disc space-y-2 pl-6">
            <li>Encurtar URLs legítimas para compartilhamento pessoal ou profissional.</li>
            <li>Usar links em mensagens, redes sociais, campanhas, materiais impressos e páginas de bio.</li>
            <li>Criar conta para histórico, aliases, métricas, QR Codes e recursos Premium.</li>
          </ul>
        </Section>

        <Section title="4. Uso proibido">
          <ul className="list-disc space-y-2 pl-6">
            <li>Phishing, malware, spam, fraude, golpes ou redirecionamento enganoso.</li>
            <li>Conteúdo ilegal, abusivo, discriminatório, violento, sexualmente exploratório ou que viole direitos de terceiros.</li>
            <li>Automação abusiva, tentativa de contornar limites, prejudicar servidores ou afetar a reputação do domínio.</li>
            <li>Ocultar destino com finalidade de enganar usuários, anunciantes, buscadores ou sistemas de segurança.</li>
          </ul>
        </Section>

        <Section title="5. Remoção e limitação">
          <p>
            Podemos remover, bloquear ou limitar links, contas e acessos quando houver
            violação destes termos, risco de segurança, abuso, ordem legal, denúncia
            fundamentada ou ameaça à reputação do domínio.
          </p>
        </Section>

        <Section title="6. Privacidade, cookies e anúncios">
          <p>
            Tratamos dados pessoais conforme a nossa{' '}
            <Link href="/privacidade" className="font-semibold text-primary hover:underline">
              Política de Privacidade
            </Link>
            . Cookies necessários operam o serviço. Cookies de analytics e publicidade
            dependem das preferências informadas no banner de cookies.
          </p>
          <p>
            Anúncios da Adsterra podem aparecer em páginas editoriais elegíveis,
            nunca em APIs, dashboard, login, registro, checkout, preview, redirecionamento,
            páginas legais ou links curtos de usuários.
          </p>
        </Section>

        <Section title="7. Premium e pagamentos">
          <p>
            Recursos Premium podem incluir aliases, histórico persistente, métricas, QR
            Codes, páginas de bio e suporte. Pagamentos são processados pela Stripe, de
            acordo com os termos e políticas da própria Stripe.
          </p>
        </Section>

        <Section title="8. Conteúdo de terceiros">
          <p>
            As URLs encurtadas são fornecidas por usuários. Não endossamos nem controlamos
            o conteúdo dos destinos externos. Ao acessar links externos, avalie o domínio,
            a finalidade e os sinais de segurança do destino.
          </p>
        </Section>

        <Section title="9. Propriedade intelectual">
          <p>
            Marca, interface, textos, código e elementos visuais do URLEncurta pertencem
            ao serviço ou a seus licenciadores. É proibido copiar, modificar ou explorar
            esses elementos sem autorização.
          </p>
        </Section>

        <Section title="10. Disponibilidade e responsabilidade">
          <p>
            O serviço é fornecido conforme disponível. Trabalhamos para manter estabilidade
            e segurança, mas não garantimos disponibilidade contínua, manutenção permanente
            de todos os links ou ausência completa de erros.
          </p>
        </Section>

        <Section title="11. Lei aplicável e contato">
          <p>
            Estes termos são regidos pelas leis brasileiras. Para questões jurídicas,
            privacidade ou denúncias de abuso, entre em contato por
            <strong> juridico@urlencurta.com.br</strong> ou
            <strong> privacidade@urlencurta.com.br</strong>.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-title">{title}</h2>
      {children}
    </section>
  );
}
