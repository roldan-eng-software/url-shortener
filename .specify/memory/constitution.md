<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Template placeholder -> I. Utilidade Gratuita como Motor de Viralizacao
- Template placeholder -> II. Monetizacao AdSense Sem Interromper o Fluxo
- Template placeholder -> III. Crescimento Organico por Conteudo e Compartilhamento
- Template placeholder -> IV. Confianca, LGPD e Seguranca de Destino
- Template placeholder -> V. Performance do Redirecionamento e da Receita
Added sections:
- Modelo de Monetizacao e Produto
- Fluxo de Planejamento Futuro
Removed sections:
- Placeholder SECTION_2_NAME
- Placeholder SECTION_3_NAME
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
- ✅ .specify/templates/commands/*.md (diretorio ausente; sem atualizacao necessaria)
- ✅ DIRETRIZ.md
Follow-up TODOs: none
-->
# URLEncurta Constitution

## Core Principles

### I. Utilidade Gratuita como Motor de Viralizacao
O URLEncurta MUST preservar um fluxo gratuito, rapido e sem cadastro obrigatorio
para criar links curtos, copiar o resultado e gerar QR Code quando aplicavel.
Qualquer mudanca futura MUST proteger esse caminho como a principal fonte de
distribuicao organica, lembranca de marca e aquisicao de trafego recorrente.

Rationale: o produto ja opera como utilidade publica de baixa friccao. A receita
por AdSense depende de volume qualificado e repeticao de uso; portanto, bloquear
o uso basico atras de cadastro, pagamento ou telas intermediarias reduz o motor
de crescimento que sustenta a monetizacao.

### II. Monetizacao AdSense Sem Interromper o Fluxo
Anuncios Google AdSense MUST aparecer somente em superficies apropriadas para
conteudo ou descoberta, como paginas editoriais, guias e rotas informativas
explicitamente liberadas. Anuncios MUST NOT aparecer em APIs, dashboard, login,
registro, checkout, paginas legais, preview, rotas de redirecionamento, links
curtos de usuario ou qualquer tela em que confundam a acao principal.

Rationale: o codigo atual ja restringe AdSense a paginas monetizaveis e evita
rotas sensiveis. Essa separacao protege aprovacao do AdSense, experiencia do
usuario e confianca no dominio, sem sacrificar receita em paginas feitas para
consumo de conteudo.

### III. Crescimento Organico por Conteudo e Compartilhamento
Toda evolucao planejada MUST identificar como contribui para pelo menos uma das
alavancas de crescimento organico: paginas indexaveis, compartilhamento de links,
QR Codes, modelos de mensagem, paginas de bio, casos de uso por canal ou
retencao de historico. Conteudos editoriais MUST ser uteis, originais,
relacionados ao uso real do encurtador e conectados ao produto por chamadas
claras, sem depender de clickbait ou conteudo raso.

Rationale: a base de ganho proposta vem de viralizacao gratuita e AdSense. O
website MUST crescer por utilidade compartilhavel e SEO de longo prazo, nao por
interrupcoes artificiais ou aquisicao paga que torne a receita de anuncios
antieconomica.

### IV. Confianca, LGPD e Seguranca de Destino
O produto MUST manter paginas de privacidade, termos, banner de cookies,
politicas compativeis com LGPD e transparencia sobre Google AdSense, Google
Analytics, Stripe e demais terceiros. Recursos de links curtos MUST validar URLs,
proteger contra aliases reservados, respeitar limites de abuso e evitar que
publicidade ou tracking exponham dados alem do necessario para operacao,
seguranca, estatisticas e monetizacao.

Rationale: encurtadores escondem parte do destino e dependem de reputacao de
dominio. Conformidade, transparencia e controles antiabuso preservam o valor do
trafego organico, reduzem risco de bloqueio por navegadores e sustentam a
elegibilidade para AdSense.

### V. Performance do Redirecionamento e da Receita
O redirecionamento de links MUST permanecer tratado como hot path critico, com
meta de p95 abaixo de 150ms sempre que a infraestrutura permitir. Paginas
monetizadas MUST carregar rapido, reservar espaco estavel para anuncios, evitar
layout shift relevante e nao degradar a criacao de links. Mudancas que adicionem
scripts, tracking, anuncios ou conteudo pesado MUST justificar o impacto em LCP,
TTFB, CLS e taxa de conversao do fluxo gratuito.

Rationale: a receita de AdSense depende de paginas vistas, mas a marca depende
da velocidade. Um encurtador lento perde compartilhamento, retorno e confianca;
uma pagina editorial lenta perde SEO, Core Web Vitals e rendimento de anuncios.

## Modelo de Monetizacao e Produto

O modelo constitucional do URLEncurta e freemium com receita publicitaria. A
camada gratuita MUST maximizar uso recorrente, compartilhamento e indexacao; a
camada AdSense MUST monetizar intencoes informativas e paginas editoriais; a
camada Premium MUST capturar usuarios com necessidades de campanha, alias,
metricas, QR Codes, paginas de bio, historico persistente e suporte.

Futuras adequacoes MUST seguir estas regras:

- O homepage e o formulario de encurtamento permanecem orientados a acao direta.
- Paginas editoriais podem receber AdSense quando forem indexaveis, seguras,
  publicas e conectadas ao tema de links, QR Code, WhatsApp, campanhas ou
  seguranca.
- Rotas privadas, transacionais, legais e de redirecionamento permanecem sem
  anuncios.
- Slots de AdSense MUST ter IDs reais antes de producao e placeholders MUST
  ficar restritos a ambientes de teste.
- Novas paginas monetizaveis MUST entrar no sitemap quando forem publicas e
  uteis para SEO.
- O Premium complementa a monetizacao, mas MUST NOT remover o valor essencial do
  uso gratuito.

## Fluxo de Planejamento Futuro

Toda spec futura que tocar crescimento, monetizacao, SEO, compartilhamento,
analytics, anuncios, paginas publicas, dashboard, checkout ou redirecionamento
MUST declarar:

- Qual principio desta constituicao e afetado.
- Qual superficie recebe ou nao recebe AdSense.
- Como a mudanca aumenta trafego organico, retencao, compartilhamento ou receita.
- Quais riscos existem para LGPD, reputacao do dominio, seguranca de destino e
  politicas do Google AdSense.
- Quais metricas validam sucesso, incluindo ao menos uma metrica de produto e
  uma metrica tecnica quando houver impacto em performance.

Planos de implementacao MUST passar pelo Constitution Check antes de pesquisa
tecnica e novamente apos o desenho da solucao. Violacoes so podem seguir com
justificativa explicita, alternativa mais simples rejeitada e plano de mitigacao.

## Governance

Esta constituicao supersede diretrizes conflitantes para monetizacao,
viralizacao, anuncios, compliance, performance e planejamento de produto do
URLEncurta. Alteracoes MUST ser documentadas em `.specify/memory/constitution.md`
com Sync Impact Report atualizado e propagacao para templates Spec Kit e docs
operacionais relevantes.

Versionamento segue SemVer:

- MAJOR quando principios forem removidos, invertidos ou redefinidos de forma
  incompativel com planos anteriores.
- MINOR quando novos principios, secoes ou gates obrigatorios forem adicionados
  ou materialmente expandidos.
- PATCH para esclarecimentos, correcao de texto e refinamentos sem mudar regras.

Compliance review MUST ocorrer em toda feature planejada via Spec Kit. Revisoes
MUST verificar se o fluxo gratuito permanece simples, se AdSense esta restrito
a superficies aprovadas, se LGPD e seguranca foram consideradas e se performance
continua adequada para redirecionamento e paginas monetizadas.

**Version**: 1.0.0 | **Ratified**: 2026-05-14 | **Last Amended**: 2026-05-14
