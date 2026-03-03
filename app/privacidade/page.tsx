import type { Metadata } from 'next';
import { CookieBanner } from '@/components/CookieBanner';

export const metadata: Metadata = {
  title: 'Política de Privacidade - URLEncurta',
  description: 'Política de Privacidade do URLEncurta. Veja como protegemos seus dados e respeitamos sua privacidade.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-gray-500 mb-8">
            <strong>Última atualização:</strong> 2 de março de 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introdução</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A URLEncurta (&quot;nós&quot;, &quot;nosso&quot;) respeita sua privacidade e está comprometida em proteger 
              seus dados pessoais. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e 
              protegemos suas informações.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Este site é operado em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Dados que Coletamos</h2>
            
            <h3 className="text-lg font-medium text-gray-800 mb-3">2.1 Dados fornecidos por você</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>URL original que você deseja encurtar</li>
              <li>Código personalizado (se aplicável)</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mb-3">2.2 Dados coletados automaticamente</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Endereço IP (anonimizado para estatísticas)</li>
              <li>Tipo de navegador e dispositivo</li>
              <li>Páginas visitadas e tempo de permanência</li>
              <li>URL de referência (referrer)</li>
              <li>Contador de cliques nos links</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Como Usamos Seus Dados</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Utilizamos seus dados para as seguintes finalidades:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Prestação do serviço:</strong> Redirecionar URLs encurtadas para seus destinos originais</li>
              <li><strong>Estatísticas:</strong> Contabilizar cliques e gerar estatísticas de acesso</li>
              <li><strong>Segurança:</strong> Prevenir fraudes, abuses e ataques</li>
              <li><strong>Melhoria do serviço:</strong> Analisar uso para melhorar nossa plataforma</li>
              <li><strong>Publicidade:</strong> Exibir anúncios através do Google AdSense</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Base Legal para Tratamento</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Tratamos seus dados com base nas seguintes hipóteses legais da LGPD:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Execução de contrato (Art. 7º, V):</strong> Para prestar o serviço de encurtamento de URLs</li>
              <li><strong>Legítimo interesse (Art. 7º, IX):</strong> Para estatísticas, segurança e melhoria do serviço</li>
              <li><strong>Cumprimento de obrigação legal (Art. 7º, II):</strong> Para obrigações fiscais e jurídicas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Cookies e Tecnologias Semelhantes</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Utilizamos cookies e tecnologias semelhantes para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Cookies técnicos:</strong> Necessários para o funcionamento do site</li>
              <li><strong>Cookies de análise:</strong> Google Analytics para entender como o site é usado</li>
              <li><strong>Cookies de publicidade:</strong> Google AdSense para exibir anúncios</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Você pode controlar ou desativar cookies através das configurações do seu navegador.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Compartilhamento de Dados</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Compartilhamos dados com os seguintes terceiros:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Google AdSense</h3>
              <p className="text-sm text-gray-700">
                O Google AdSense utiliza cookies para exibir anúncios personalizados e medir tráfego. 
                O Google atua como controlador independente de dados. 
                <a 
                  href="https://policies.google.com/technologies/ads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  Política de Privacidade do Google
                </a>
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Google Analytics</h3>
              <p className="text-sm text-gray-700">
                Utilizamos Google Analytics para analisar o tráfego do site. Os dados de IP são anonimizados.
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  Política de Privacidade do Google
                </a>
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              Não vendemos, negociamos ou transferimos seus dados pessoais para terceiros.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Retenção de Dados</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Mantemos seus dados pelo tempo necessário para:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>URLs encurtadas:</strong> Enquanto o link estiver ativo ou até solicitação de exclusão</li>
              <li><strong>Dados de acesso:</strong> Até 12 meses para estatísticas e segurança</li>
              <li><strong>Dados fiscais:</strong> Pelo prazo legal mínimo de 5 anos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Seus Direitos (LGPD)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Você tem os seguintes direitos garantidos pela LGPD:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Confirmação:</strong> Receber confirmação sobre a existência de tratamento</li>
              <li><strong>Acesso:</strong> Solicitar acesso aos seus dados</li>
              <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou desatualizados</li>
              <li><strong>Anonimização:</strong> Solicitar anonimização de dados</li>
              <li><strong>Bloqueio:</strong> Solicitar bloqueio ou eliminação de dados desnecessários</li>
              <li><strong>Eliminação:</strong> Solicitar eliminação de dados tratados com consentimento</li>
              <li><strong>Portabilidade:</strong> Solicitar portabilidade dos dados</li>
              <li><strong>Informação:</strong> Receber informação sobre compartilhamento</li>
              <li><strong>Revogação:</strong> Revogar consentimento a qualquer tempo</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Como Exerc Seus Direitos</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Para exercer seus direitos ou esclarecer dúvidas, entre em contato conosco:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Email:</strong> privacidade@urlencurta.com
              </p>
              <p className="text-gray-700 mt-2">
                Responderemos sua solicitação em até 15 dias, conforme estabelecido pela LGPD.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Segurança</h2>
            <p className="text-gray-700 leading-relaxed">
              Implementamos medidas de segurança técnicas e administrativas para proteger seus dados contra 
              acesso não autorizado, alteração, divulgação ou destruição. Utilizamos criptografia SSL/TLS 
              para transmissões e armazenamos dados em servidores seguros.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Transferência Internacional</h2>
            <p className="text-gray-700 leading-relaxed">
              Alguns de nossos fornecedores (como Google) podem estar localizados fora do Brasil. 
              Garantimos que tais transferências comply com a LGPD e que os dados são protegidos adequadamente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Alterações nesta Política</h2>
            <p className="text-gray-700 leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente. Notifyaremos sobre alterações 
              публикуя a nova versão nesta página. Recomendamos que você revise esta política regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Encarregado de Proteção de Dados</h2>
            <p className="text-gray-700 leading-relaxed">
              Nosso Encarregado de Proteção de Dados (DPO) pode ser contactado através de 
              privacidade@urlencurta.com.
            </p>
          </section>
        </div>
      </div>
      <CookieBanner />
    </>
  );
}
