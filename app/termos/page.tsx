import type { Metadata } from 'next';
import { CookieBanner } from '@/components/CookieBanner';

export const metadata: Metadata = {
  title: 'Termos de Uso - URLEncurta',
  description: 'Termos de Uso do URLEncurta. Leia as condições para uso do serviço.',
};

export default function TermsOfServicePage() {
  return (
    <>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Termos de Uso</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-gray-500 mb-8">
            <strong>Última atualização:</strong> 2 de março de 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Ao acessar e utilizar o URLEncurta, você (&quot;Usuário&quot;) concorda em cumprir e estar vinculado 
              a estes Termos de Uso (&quot;Termos&quot;). Se você não concordar com qualquer parte destes Termos, 
              não deverá utilizar nosso serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Descrição do Serviço</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              O URLEncurta é um serviço de encurtamento de URLs que permite transformar URLs longas 
              em links curtos e fáceis de compartilhar. O serviço é fornecido gratuitamente para uso 
              pessoal e comercial.
            </p>
            <p className="text-gray-700 leading-relaxed">
              O serviço inclui redirecionamento de URLs, estatísticas básicas de cliques e exibição 
              de anúncios publicitários para sustentação do serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Uso Permitido</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Você pode utilizar nosso serviço para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Encurtar URLs para compartilhamento em redes sociais</li>
              <li>Criar links curtos para campanhas de marketing</li>
              <li>Redirecionar visitantes para conteúdo legítimo</li>
              <li>Usar em comunicações pessoais ou profissionais</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Uso Proibido</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              É expressamente proibido utilizar nosso serviço para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Compartilhar conteúdo ilegal, violento, pornográfico ou indecente</li>
              <li>Criar links para phishing, malware ou software malicioso</li>
              <li>Violar direitos de propriedade intelectual de terceiros</li>
              <li>Spam ou envio massivo de links</li>
              <li>Atividades fraudulentas ou enganosas</li>
              <li>Redirecionar para conteúdo que viole leis brasileiras ou internacionais</li>
              <li>Tentar macular, sobrecarregar ou prejudicar nossos servidores</li>
              <li>Usar o serviço de forma automatizada sem autorização</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Isenção de Responsabilidade pelo Conteúdo</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>O URLEncurta não é responsável pelo conteúdo das URLs encurtadas</strong>. As URLs 
              inseridas pelos usuários são de total responsabilidade de quem as cria.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Não verificamos, validamos ou endorsementamos o conteúdo de links externos. Os usuários 
              devem clicar em links por sua própria conta e risco.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitação e Remoção de Links</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Reservamos o direito de:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Remover ou desativar qualquer link a qualquer tempo</li>
              <li>Bloquear acesso a usuários que violem estes Termos</li>
              <li>Limitar o uso do serviço em caso de abuso</li>
              <li>Compartilhar informações com autoridades quando exigido por lei</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Propriedade Intelectual</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              O URLEncurta, incluindo mas não limitado a:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Logo, marca e identidade visual</li>
              <li>Código-fonte e software</li>
              <li>Design e layout do site</li>
              <li>Banco de dados e algoritmos</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              São de nossa propriedade ou licenciados. É proibido copiar, modificar ou distribuir 
              qualquer parte do serviço sem autorização prévia por escrito.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Publicidade</h2>
            <p className="text-gray-700 leading-relaxed">
              O URLEncurta exibe anúncios publicitários para manter o serviço gratuito. Ao utilizar 
              nosso serviço, você concorda com a exibição de anúncios, incluindo anúncios do Google AdSense. 
              Não temos controle sobre o conteúdo específico dos anúncios exibidos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Isenção de Garantias</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              O serviço é fornecido &quot;como está&quot; e &quot;conforme disponível&quot;. Não garantimos que:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>O serviço estará sempre disponível ou livre de erros</li>
              <li>Os links redirecionarão corretamente indefinidamente</li>
              <li>O serviço atenderá às suas expectativas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Limitação de Responsabilidade</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Em nenhuma circunstância seremos responsáveis por:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Danos diretos, indiretos, incidentais ou consequenciais</li>
              <li>Perda de dados, receita ou oportunidades</li>
              <li>Danos causados por viruses ou malware em links externos</li>
              <li>Conteúdo de terceiros ou práticas de anunciantes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Indenização</h2>
            <p className="text-gray-700 leading-relaxed">
              Você concorda em indenizar, defender e isentar o URLEncurta e seus associados de qualquer 
              reclamação, demanda, dano, perda, custo ou despesa decorrente de sua violação destes Termos 
              ou uso indevido do serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Lei Aplicável</h2>
            <p className="text-gray-700 leading-relaxed">
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa 
              será resolvida no foro da Comarca de São Paulo, São Paulo, salvo disposição contrária mandatory.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Contato</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Para questões sobre estes Termos, entre em contato:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> juridico@urlencurta.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Disposições Finais</h2>
            <p className="text-gray-700 leading-relaxed">
              Se qualquer disposição destes Termos for considerada inválida ou inexequível, as demais 
              disposições permanecerão em vigor. Nosso failure em aplicar qualquer direito não constitui 
              waiver de tais direitos.
            </p>
          </section>
        </div>
      </div>
      <CookieBanner />
    </>
  );
}
