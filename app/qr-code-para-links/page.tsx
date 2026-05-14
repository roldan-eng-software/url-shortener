import type { Metadata } from 'next';
import { EditorialGuide } from '@/components/EditorialGuide';

export const metadata: Metadata = {
  title: 'QR Code Para Links: Quando Usar e Como Testar',
  description:
    'Guia pratico para usar QR Code em links, materiais impressos, cardapios, eventos, embalagens e campanhas.',
  alternates: {
    canonical: '/qr-code-para-links',
  },
};

export default function QrCodeParaLinksPage() {
  return (
    <EditorialGuide
      eyebrow="Guia pratico"
      title="QR Code para links: quando usar, como testar e o que evitar"
      description="QR Codes conectam materiais fisicos a paginas digitais. Para funcionarem bem, precisam de destino claro, bom contraste, tamanho adequado e uma URL que continue valida depois da impressao."
      updatedAt="13 de maio de 2026"
      intro={[
        'Um QR Code economiza digitacao e ajuda a levar pessoas de um cartaz, mesa, embalagem ou apresentacao para uma pagina online. Ele funciona melhor quando o usuario entende o beneficio antes de abrir a camera.',
        'A URL curta ajuda porque simplifica o destino, facilita suporte e permite trocar a comunicacao ao redor do codigo sem expor uma URL longa e dificil de ler.',
      ]}
      checklistTitle="Antes de imprimir ou publicar"
      checklist={[
        'Teste em celulares Android e iPhone.',
        'Garanta contraste forte entre codigo e fundo.',
        'Inclua uma chamada clara perto do QR Code.',
        'Use uma pagina de destino responsiva.',
        'Evite encurtar paginas temporarias sem controle.',
        'Mantenha uma alternativa escrita para quem nao usa camera.',
      ]}
      sections={[
        {
          title: 'Quando o QR Code e uma boa escolha',
          body: [
            'O QR Code e ideal quando a pessoa esta fora do computador ou nao quer digitar uma URL. Ele combina bem com cardapios, catalogos, manuais, credenciais, brindes, vitrines, eventos e materiais de ponto de venda.',
            'Em canais digitais, um botao ou link clicavel geralmente e melhor. O QR Code faz mais sentido quando existe uma ponte entre o fisico e o online.',
          ],
        },
        {
          title: 'Como escrever a chamada ao redor do codigo',
          body: [
            'Um QR Code solto parece misterioso. Uma frase curta aumenta a taxa de leitura e reduz desconfiana. Diga exatamente o que vai acontecer apos o escaneamento.',
            'Evite chamadas vagas como "acesse aqui". Prefira mensagens especificas, como "ver cardapio atualizado", "baixar manual de instalacao" ou "confirmar presenca no evento".',
          ],
          bullets: [
            'Use verbos concretos: ver, baixar, confirmar, acompanhar, solicitar.',
            'Mostre o dominio ou a marca quando o contexto exigir confianca.',
            'Nao prometa desconto, premio ou acesso urgente sem explicacao.',
          ],
        },
        {
          title: 'Tamanho, contraste e distancia',
          body: [
            'O codigo precisa ser grande o suficiente para a distancia de leitura. Um QR Code em um cartao de visita pode ser pequeno, mas um cartaz precisa de dimensoes maiores.',
            'Contraste tambem importa. Fundo claro com codigo escuro costuma ser a escolha mais segura. Evite aplicar o codigo sobre fotos, texturas ou areas com muitas cores.',
          ],
        },
        {
          title: 'Por que testar a pagina de destino',
          body: [
            'O QR Code pode estar perfeito e ainda assim falhar se a pagina for pesada, confusa ou quebrada no celular. Antes de imprimir, abra o destino em rede movel, confira tempo de carregamento e veja se a acao principal aparece sem esforco.',
            'Se o material for permanente, evite apontar para paginas que dependem de campanhas curtas. Prefira destinos que possam continuar uteis ou receber atualizacoes.',
          ],
        },
        {
          title: 'Como a URL curta ajuda no suporte',
          body: [
            'Quando alguem tem dificuldade com o QR Code, uma URL curta pode ser ditada ou enviada por mensagem. Isso e util em atendimento, eventos e pontos de venda.',
            'Tambem fica mais facil identificar qual material esta sendo usado. Um alias claro, como cardapio-centro ou evento-maio, ajuda a equipe a entender o contexto sem abrir planilhas.',
          ],
        },
      ]}
      related={[
        {
          title: 'Seguranca em links curtos',
          href: '/seguranca-em-links-curtos',
          description: 'Entenda como mostrar contexto e reduzir riscos antes do clique.',
        },
        {
          title: 'Como funciona',
          href: '/como-funciona',
          description: 'Veja o passo a passo para criar um link curto no URLEncurta.',
        },
        {
          title: 'Boas praticas',
          href: '/boas-praticas-url-curta',
          description: 'Organize nomes, campanhas e revisoes de links.',
        },
      ]}
    />
  );
}
