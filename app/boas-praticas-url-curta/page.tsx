import type { Metadata } from 'next';
import { EditorialGuide } from '@/components/EditorialGuide';

export const metadata: Metadata = {
  title: 'Boas Praticas Para URL Curta: Nomes, Campanhas e Revisao',
  description:
    'Guia para criar URLs curtas mais claras, organizar campanhas, escolher aliases e evitar erros comuns ao compartilhar links.',
  alternates: {
    canonical: '/boas-praticas-url-curta',
  },
};

export default function BoasPraticasUrlCurtaPage() {
  return (
    <EditorialGuide
      eyebrow="Organizacao"
      title="Boas praticas para URL curta: nomes, campanhas e revisao"
      description="Uma URL curta deve ser facil de compartilhar, mas tambem precisa ser facil de entender e manter. Veja criterios simples para nomear links, revisar destinos e organizar campanhas."
      updatedAt="13 de maio de 2026"
      intro={[
        'Encurtar uma URL e simples. O trabalho que realmente melhora a experiencia esta em escolher bons nomes, revisar destinos e manter o contexto de cada campanha.',
        'Quando a equipe usa um padrao claro, os links ficam mais confiaveis para quem clica e mais faceis de gerenciar para quem publica.',
      ]}
      checklistTitle="Padrao minimo recomendado"
      checklist={[
        'Use nomes curtos e legiveis.',
        'Evite abreviacoes que so a equipe entende.',
        'Inclua campanha, canal ou data quando fizer sentido.',
        'Teste o destino antes de divulgar.',
        'Revise links usados em materiais permanentes.',
        'Remova ou substitua links que perderam contexto.',
      ]}
      sections={[
        {
          title: 'Escolha aliases que expliquem o destino',
          body: [
            'Um bom alias ajuda a pessoa a reconhecer o conteudo antes de clicar. Palavras simples como cardapio, inscricao, proposta, catalogo, suporte ou evento comunicam melhor que sequencias aleatorias.',
            'Quando o link e usado em uma campanha especifica, adicione um detalhe que diferencie a acao. Isso evita que varios materiais apontem para nomes parecidos demais.',
          ],
          bullets: [
            'Bom: /cardapio-centro',
            'Bom: /inscricao-workshop-maio',
            'Fraco: /xpto2026finalnovo',
          ],
        },
        {
          title: 'Evite nomes que envelhecem mal',
          body: [
            'Palavras como hoje, novo, ultima-chance e promocao podem perder sentido rapidamente. Se o link continuar circulando depois da campanha, o usuario pode cair em uma pagina sem contexto.',
            'Quando usar datas, escolha uma convencao facil de entender. Para campanhas recorrentes, prefira nomes que indiquem mes, produto ou canal.',
          ],
        },
        {
          title: 'Organize por canal de divulgacao',
          body: [
            'O mesmo destino pode ser compartilhado em Instagram, WhatsApp, email, panfleto e atendimento. Criar links separados por canal ajuda a entender onde a comunicacao funciona melhor.',
            'Essa separacao tambem facilita suporte. Se um QR Code impresso tiver problema, voce consegue identificar rapidamente qual material precisa ser corrigido.',
          ],
        },
        {
          title: 'Revise a pagina de destino',
          body: [
            'Um link curto bom nao compensa uma pagina ruim. Antes de divulgar, confirme se a pagina carrega, se a informacao prometida esta visivel e se o usuario consegue concluir a acao principal no celular.',
            'Tambem confira se a pagina nao exige login inesperado, nao mostra erro de estoque ou campanha encerrada e nao redireciona para outro lugar sem explicacao.',
          ],
        },
        {
          title: 'Mantenha uma rotina de limpeza',
          body: [
            'Links antigos acumulam rapidamente. Uma revisao mensal ou trimestral ajuda a remover destinos vencidos, corrigir paginas alteradas e padronizar nomes que ficaram confusos.',
            'Essa rotina e especialmente importante para negocios com cardapios, tabelas de preco, eventos, calendarios, landing pages e campanhas sazonais.',
          ],
        },
      ]}
      related={[
        {
          title: 'Como funciona',
          href: '/como-funciona',
          description: 'Aprenda o processo basico para encurtar uma URL.',
        },
        {
          title: 'Links para WhatsApp',
          href: '/links-para-whatsapp',
          description: 'Melhore mensagens, propostas e atendimento.',
        },
        {
          title: 'Seguranca em links',
          href: '/seguranca-em-links-curtos',
          description: 'Reduza riscos com contexto e verificacoes simples.',
        },
      ]}
    />
  );
}
