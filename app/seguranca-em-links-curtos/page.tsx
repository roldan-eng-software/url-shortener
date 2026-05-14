import type { Metadata } from 'next';
import { EditorialGuide } from '@/components/EditorialGuide';

export const metadata: Metadata = {
  title: 'Segurança em Links Curtos: Como Verificar Antes de Clicar',
  description:
    'Aprenda como avaliar links curtos, identificar sinais de phishing, conferir domínios e compartilhar URLs com mais segurança.',
  alternates: {
    canonical: '/seguranca-em-links-curtos',
  },
};

export default function SegurancaEmLinksCurtosPage() {
  return (
    <EditorialGuide
      eyebrow="Guia de seguranca"
      title="Seguranca em links curtos: como verificar antes de clicar"
      description="Links curtos sao uteis, mas tambem exigem contexto. Veja como analisar o destino, reconhecer sinais de risco e reduzir problemas ao compartilhar URLs em campanhas, mensagens e materiais impressos."
      updatedAt="13 de maio de 2026"
      intro={[
        'Um link curto facilita a vida de quem compartilha, mas tambem esconde parte do endereco original. Por isso, a melhor experiencia nao e apenas encurtar: e mostrar contexto suficiente para que a pessoa entenda para onde esta indo.',
        'A seguranca comeca antes do clique. Conferir o dominio, observar o protocolo, desconfiar de urgencia exagerada e evitar links sem explicacao sao habitos simples que reduzem riscos para clientes, equipes e leitores.',
      ]}
      checklistTitle="Checklist rapido antes de compartilhar"
      checklist={[
        'Abra a URL original e confirme se a pagina esta correta.',
        'Prefira destinos HTTPS e dominios conhecidos.',
        'Escreva uma mensagem explicando o motivo do link.',
        'Evite promessas exageradas ou chamadas que parecam golpe.',
        'Teste o link curto em celular e desktop.',
        'Mantenha uma pagina de destino clara e atualizada.',
      ]}
      sections={[
        {
          title: 'Por que links curtos precisam de contexto',
          body: [
            'Quando alguem recebe uma URL longa, parte do destino fica visivel no proprio texto. Em um link curto, essa pista desaparece. Isso nao torna o link inseguro por si so, mas aumenta a responsabilidade de quem esta compartilhando.',
            'O ideal e nunca enviar um link isolado. Acrescente uma frase curta dizendo o que a pessoa vai encontrar, qual empresa ou projeto esta por tras e por que aquele acesso faz sentido naquele momento.',
          ],
          bullets: [
            'Bom exemplo: "Segue o link curto para confirmar sua inscricao no evento de quinta-feira."',
            'Exemplo fraco: "Clique agora antes que expire."',
          ],
        },
        {
          title: 'Como avaliar o dominio de destino',
          body: [
            'Antes de encurtar, abra a pagina original e observe o dominio com calma. Golpes costumam usar nomes parecidos com marcas conhecidas, letras trocadas, hifens desnecessarios ou subdominios confusos.',
            'Se voce divulga links para clientes, documente quais dominios sao oficiais. Isso ajuda atendimento, marketing e vendas a responderem duvidas com consistencia.',
          ],
          bullets: [
            'Confira se o dominio pertence a marca ou ao servico anunciado.',
            'Evite URLs com muitos redirecionamentos antes da pagina final.',
            'Desconfie de paginas que pedem senha, documento ou pagamento sem contexto.',
          ],
        },
        {
          title: 'HTTPS ajuda, mas nao resolve tudo',
          body: [
            'O cadeado do navegador indica que a conexao e criptografada, mas nao garante que o conteudo da pagina seja confiavel. Sites maliciosos tambem podem usar HTTPS.',
            'Mesmo assim, destinos HTTPS ainda sao preferiveis porque reduzem alertas no navegador e protegem melhor os dados em transito. Para campanhas profissionais, HTTP puro deve ser tratado como excecao.',
          ],
        },
        {
          title: 'Cuidados ao usar QR Code',
          body: [
            'QR Codes sao praticos em embalagens, panfletos, cartoes de visita e recepcoes. O problema e que a pessoa geralmente nao enxerga o endereco antes de escanear.',
            'Ao imprimir um QR Code, inclua tambem o dominio principal ou uma frase explicando o destino. Isso aumenta confianca e reduz suporte desnecessario.',
          ],
          bullets: [
            'Teste o QR Code em mais de um celular antes de imprimir.',
            'Evite colar QR Codes novos sobre materiais antigos sem controle.',
            'Use uma pagina de destino responsiva, rapida e objetiva.',
          ],
        },
        {
          title: 'Boas praticas para equipes',
          body: [
            'Em empresas, o problema mais comum nao e a ferramenta, mas a falta de padrao. Cada pessoa cria links com nomes diferentes, campanhas se misturam e fica dificil saber o que ainda esta em uso.',
            'Crie uma regra simples para nomes de campanhas, revise links antigos e mantenha uma lista dos destinos principais. Essa organizacao melhora seguranca e tambem facilita medir resultados.',
          ],
        },
      ]}
      related={[
        {
          title: 'QR Code para links',
          href: '/qr-code-para-links',
          description: 'Veja quando usar QR Code e como evitar erros em materiais fisicos.',
        },
        {
          title: 'Boas praticas de URL curta',
          href: '/boas-praticas-url-curta',
          description: 'Aprenda a nomear, testar e organizar links curtos.',
        },
        {
          title: 'Links para WhatsApp',
          href: '/links-para-whatsapp',
          description: 'Use links curtos em conversas, atendimento e campanhas.',
        },
      ]}
    />
  );
}
