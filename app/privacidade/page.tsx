import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { PrivacyRequestForm } from '@/components/PrivacyRequestForm';

export const metadata: Metadata = {
  title: 'Política de Privacidade - URLEncurta',
  description: 'Política de Privacidade do URLEncurta, com informações sobre LGPD, cookies, anúncios, analytics e direitos do titular.',
};

const updatedAt = '14 de maio de 2026';

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-title">Política de Privacidade</h1>
        <p className="mt-3 text-sm text-text-secondary">
          Última atualização: {updatedAt}
        </p>
        <p className="mt-5 text-text">
          Esta política explica como o URLEncurta trata dados pessoais para operar o
          encurtador de links, contas Premium, páginas de bio, analytics, anúncios e
          comunicações comerciais, em conformidade com a Lei Geral de Proteção de Dados
          Pessoais (Lei nº 13.709/2018).
        </p>
      </div>

      <div className="space-y-9 text-text">
        <Section title="1. Controlador e contato">
          <p>
            O controlador dos dados é o URLEncurta, responsável por definir as finalidades
            e meios de tratamento dos dados pessoais tratados neste serviço.
          </p>
          <p>
            Para dúvidas ou solicitações LGPD, use o formulário ao final desta página ou
            envie email para <strong>privacidade@urlencurta.com.br</strong>.
          </p>
        </Section>

        <Section title="2. Dados tratados">
          <ul className="list-disc space-y-2 pl-6">
            <li>URLs originais, links curtos, aliases personalizados, QR Codes e contadores de cliques.</li>
            <li>Email, senha protegida por hash, identificador de usuário e status Premium.</li>
            <li>Dados de pagamento processados pela Stripe, como identificadores de cliente e assinatura.</li>
            <li>Dados de páginas de bio, incluindo handle, título, descrição, links e métricas de acesso.</li>
            <li>Dados enviados em formulários comerciais, como nome, email, empresa, telefone, interesse e mensagem.</li>
            <li>Dados técnicos e de segurança, como endereço IP, origem da requisição, navegador, dispositivo e eventos de abuso.</li>
            <li>Preferências de cookies salvas no navegador para analytics e publicidade.</li>
          </ul>
        </Section>

        <Section title="3. Finalidades e bases legais">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-title">
                  <th className="py-3 pr-4">Finalidade</th>
                  <th className="py-3 pr-4">Dados principais</th>
                  <th className="py-3">Base legal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <TableRow
                  basis="Execução de contrato ou procedimentos preliminares"
                  data="URL, código curto, QR Code, conta e links salvos"
                  purpose="Prestar o serviço de encurtamento, redirecionamento e recursos Premium"
                />
                <TableRow
                  basis="Legítimo interesse e prevenção a fraudes"
                  data="IP, origem, limites de uso, eventos técnicos e URLs suspeitas"
                  purpose="Proteger o domínio, evitar abuso, spam, phishing e indisponibilidade"
                />
                <TableRow
                  basis="Consentimento registrado nas preferências de cookies"
                  data="Eventos de navegação, páginas visitadas e conversões"
                  purpose="Medir uso do site com Google Analytics"
                />
                <TableRow
                  basis="Consentimento registrado nas preferências de cookies"
                  data="Identificadores publicitários e sinais de anúncio"
                  purpose="Carregar Adsterra em páginas editoriais elegíveis"
                />
                <TableRow
                  basis="Execução de contrato e cumprimento de obrigação legal"
                  data="Email, identificadores Stripe, assinatura e status de pagamento"
                  purpose="Processar assinatura Premium e obrigações relacionadas"
                />
                <TableRow
                  basis="Consentimento ou procedimentos solicitados pelo titular"
                  data="Nome, email, telefone, empresa, interesse e mensagem"
                  purpose="Responder contatos comerciais e pedidos de plano de campanha"
                />
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="4. Cookies e preferências">
          <p>
            Cookies necessários são usados para autenticação, segurança, tema e operação básica
            do site. Cookies de analytics e publicidade ficam desativados até que você os aceite.
          </p>
          <p>
            Você pode aceitar, rejeitar ou gerenciar as categorias no banner de cookies. Depois
            da primeira escolha, o botão &quot;Preferências de cookies&quot; permanece disponível no canto
            inferior da página para alterar ou revogar a autorização.
          </p>
        </Section>

        <Section title="5. Compartilhamento com terceiros">
          <ul className="list-disc space-y-2 pl-6">
            <li><strong>Google Analytics:</strong> usado somente se cookies de analytics forem aceitos.</li>
            <li><strong>Adsterra:</strong> usada somente se cookies de publicidade forem aceitos e apenas em superfícies editoriais elegíveis.</li>
            <li><strong>Stripe:</strong> processa checkout e assinaturas Premium.</li>
            <li><strong>Neon/Vercel:</strong> infraestrutura de banco de dados, hospedagem e execução da aplicação.</li>
          </ul>
          <p>
            Não vendemos dados pessoais. Compartilhamentos ocorrem para operar o serviço, cumprir
            obrigações legais, proteger contra abuso ou atender solicitações do titular.
          </p>
        </Section>

        <Section title="6. Retenção">
          <ul className="list-disc space-y-2 pl-6">
            <li>Links gratuitos e salvos: enquanto estiverem ativos ou até exclusão aplicável.</li>
            <li>Contas e recursos Premium: enquanto a conta existir e pelo prazo necessário a obrigações legais.</li>
            <li>Leads comerciais: até 24 meses ou até pedido de exclusão.</li>
            <li>Solicitações LGPD: pelo prazo necessário para comprovar atendimento e governança.</li>
            <li>Eventos técnicos e métricas agregadas: pelo tempo necessário para segurança, estatística e melhoria do serviço.</li>
          </ul>
        </Section>

        <Section title="7. Transferência internacional">
          <p>
            Alguns fornecedores podem processar dados fora do Brasil. Nesses casos, usamos
            fornecedores reconhecidos, contratos e medidas de segurança compatíveis com a LGPD.
          </p>
        </Section>

        <Section title="8. Direitos do titular">
          <p>Você pode solicitar:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Confirmação da existência de tratamento e acesso aos dados.</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos.</li>
            <li>Portabilidade, quando aplicável.</li>
            <li>Informações sobre compartilhamento com terceiros.</li>
            <li>Revogação de consentimento e oposição a tratamentos aplicáveis.</li>
          </ul>
        </Section>

        <Section title="9. Segurança">
          <p>
            Aplicamos medidas técnicas e administrativas, incluindo HTTPS, cookies de sessão
            protegidos, validação de URLs, limites contra abuso, hash de senhas e restrições de
            origem para operações sensíveis.
          </p>
        </Section>

        <Section title="10. Solicitação LGPD">
          <PrivacyRequestForm />
        </Section>
      </div>
    </div>
  );
}

function Section({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-title">{title}</h2>
      {children}
    </section>
  );
}

function TableRow({
  basis,
  data,
  purpose,
}: {
  basis: string;
  data: string;
  purpose: string;
}) {
  return (
    <tr>
      <td className="py-3 pr-4 align-top">{purpose}</td>
      <td className="py-3 pr-4 align-top">{data}</td>
      <td className="py-3 align-top">{basis}</td>
    </tr>
  );
}
