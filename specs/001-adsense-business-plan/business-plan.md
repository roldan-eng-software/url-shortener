# Plano de Negócios: Viralização Gratuita e Google AdSense

**Produto**: URLEncurta  
**Versão do plano**: 1.0  
**Data**: 2026-05-14  
**Referência constitucional**: `.specify/memory/constitution.md`  
**Status**: Plano canônico para orientar specs futuras

## 1. Executive summary

O URLEncurta deve crescer como uma utilidade gratuita de baixa fricção: o usuário
cola uma URL, recebe um link curto, copia, compartilha e pode usar QR Code sem
cadastro obrigatório. Essa experiência gratuita é o motor de viralização e
aquisição.

A monetização principal deste plano é Google AdSense aplicado a páginas públicas
informativas e editoriais que tenham intenção real de busca, conexão direta com
links curtos e contexto suficiente para publicidade. A publicidade não deve
interromper criação de links, redirecionamento, login, registro, dashboard,
checkout, páginas legais, preview, APIs ou rotas de short code de usuários.

Premium permanece como segunda camada de receita para usuários com necessidade
de alias, campanhas, métricas, QR Codes ampliados, bio links, histórico salvo e
suporte. O Premium deve capturar valor avançado sem reduzir o valor essencial da
camada gratuita.

## 2. Free product promise

O compromisso gratuito do URLEncurta é:

- Criar links curtos rapidamente, sem cadastro obrigatório.
- Manter QR Code e cópia do link como recursos de compartilhamento.
- Preservar redirecionamento confiável e rápido.
- Manter a home e o formulário principal focados na ação de encurtar.
- Evitar anúncios ou upsells que bloqueiem, confundam ou atrasem o fluxo básico.

Esse compromisso é protegido porque cada link compartilhado carrega a marca,
gera retorno potencial ao domínio e aumenta a base de tráfego que sustenta SEO,
AdSense e conversão Premium futura.

## 3. Revenue model

| Camada | Papel | Como gera valor | Limite constitucional |
|--------|-------|-----------------|-----------------------|
| Gratuito | Aquisição e viralização | Links curtos, QR Codes, histórico local e compartilhamento recorrente | Não pode virar uma experiência bloqueada por cadastro, pagamento ou anúncios intrusivos |
| AdSense | Receita sobre intenção informativa | Monetiza guias, páginas editoriais e conteúdos úteis sobre links, QR Code, WhatsApp, campanhas, bio e segurança | Só pode aparecer em superfícies públicas apropriadas e explicitamente permitidas |
| Premium | Receita por necessidade avançada | Alias, métricas, histórico persistente, bio links, QR Codes ampliados, suporte e controle de campanha | Deve complementar o gratuito, não remover seu valor essencial |

Decisão estratégica: priorizar tráfego orgânico qualificado antes de aumentar
densidade de anúncios. Receita publicitária que reduz criação de links,
confiança ou performance deve ser revisada ou pausada.

## 4. Monetization surface matrix

| Surface | User intent | Ad status | Business role | Policy risk | Privacy/trust note | Performance note | Decision owner |
|---------|-------------|-----------|---------------|-------------|--------------------|------------------|----------------|
| `/como-funciona` | Entender o serviço e aprender a usar | Allowed | SEO, educação e AdSense | Baixo, se anúncios forem rotulados e não confundirem CTAs | Deve manter contexto claro do produto | Reservar espaço de anúncio e preservar LCP/CLS | Product owner |
| `/boas-praticas-url-curta` | Aprender boas práticas de campanhas e aliases | Allowed | SEO, AdSense e qualificação Premium | Baixo a médio; evitar conteúdo raso criado só para anúncios | Deve orientar uso legítimo e responsável | Conteúdo deve carregar rápido e ser legível | Product owner |
| `/links-para-whatsapp` | Compartilhar links em mensagens | Allowed | SEO, AdSense e viralização por WhatsApp | Médio; evitar incentivo a spam | Deve reforçar contexto e consentimento em mensagens | Anúncios não podem interromper leitura mobile | Product owner |
| `/qr-code-para-links` | Usar QR Code em materiais físicos | Allowed | SEO, AdSense e uso offline-online | Baixo | Deve orientar teste do destino antes de imprimir | Imagens/ads não devem causar shift em mobile | Product owner |
| `/seguranca-em-links-curtos` | Avaliar segurança de links curtos | Allowed | Confiança, SEO e AdSense | Baixo se conteúdo for educativo e original | Deve reforçar destino claro e prevenção de abuso | Priorizar leitura e estabilidade visual | Product owner |
| `/` home | Encurtar URL imediatamente | Review-required | Aquisição, criação de link e conversão | Médio; anúncios podem reduzir conclusão da tarefa | Evitar confusão entre formulário e anúncio | Não inserir anúncio antes do formulário sem teste | Product owner |
| Novas páginas editoriais | Resolver intenção de busca ligada ao produto | Review-required | SEO, AdSense e aquisição | Depende do tema e qualidade | Exige conexão real com encurtador | Exige critérios de LCP/CLS antes de liberar | Product owner |
| Páginas de bio públicas | Visitar links de um usuário Premium | Review-required | Valor Premium, tráfego e retenção | Médio; anúncios podem confundir autoria | Exige distinção entre conteúdo do usuário e publicidade | Evitar degradar cliques nos links da bio | Product + trust review |
| `/premium` | Avaliar assinatura | Forbidden | Conversão Premium | Médio; anúncios competem com checkout | Evitar terceiros em fluxo comercial sensível | Preservar clareza do plano | Product owner |
| `/premium/success` | Confirmar assinatura | Forbidden | Pós-compra | Alto para confiança | Não expor etapa transacional a anúncios | Preservar confirmação rápida | Product owner |
| `/login` e `/register` | Entrar ou criar conta | Forbidden | Autenticação | Alto para confiança e segurança | Não misturar publicidade com credenciais | Preservar foco e carregamento rápido | Product owner |
| `/dashboard/*` | Gerenciar links e bio | Forbidden | Produto privado e Premium | Alto para privacidade | Área de dados do usuário | Não inserir scripts publicitários | Product owner |
| `/privacidade` e `/termos` | Ler políticas legais | Forbidden | Confiança e compliance | Alto; anúncios podem reduzir seriedade legal | Deve ser texto legal claro | Sem distrações comerciais | Product + legal |
| `/preview/*` | Conferir destino antes de abrir | Forbidden | Segurança e confiança | Alto; anúncio pode confundir destino | Superfície sensível de destino | Priorizar clareza | Product + trust review |
| `/[shortCode]` | Ser redirecionado | Forbidden | Hot path e reputação | Crítico | Não criar interstitial publicitário | p95 abaixo de 150ms quando possível | Product + engineering |
| `/api/*` | Operação de sistema | Forbidden | Serviço interno | Crítico | Nunca exibir anúncios | Sem scripts publicitários | Engineering |

## 5. Organic growth and content roadmap

| Topic | Audience | Search intent | Product connection | User action | Ad eligibility | Success metric |
|-------|----------|---------------|--------------------|-------------|----------------|----------------|
| Como encurtar URL para WhatsApp | Pequenos negócios e atendimento | Enviar links limpos em mensagens | Criar link curto e copiar texto pronto | Encurtar URL e copiar mensagem | Allowed | Cliques no formulário a partir da página |
| URL curta para Instagram bio | Criadores, social media e pequenos negócios | Melhorar links em perfis sociais | Link curto, bio links e Premium | Criar link ou avaliar Premium bio | Review-required | Cliques em criação e Premium |
| QR Code para cardápio ou catálogo | Restaurantes, lojas e eventos | Conectar material físico a página online | QR Code automático do link | Criar link e baixar/usar QR | Allowed | Uso de QR Code por origem editorial |
| Boas práticas para nomear links de campanha | Marketers e agências | Escolher alias claro e mensurável | Alias Premium e organização de campanha | Ver Premium ou criar link padrão | Allowed | Cliques em Premium e criação |
| Segurança em links curtos | Usuários gerais e empresas | Identificar riscos antes de clicar | Preview, contexto e domínio confiável | Ler guia e usar encurtador com contexto | Allowed | Tempo de leitura e criação pós-leitura |
| Link curto para panfleto impresso | Eventos, comércio local e educação | Usar URL fácil de digitar em material físico | Link curto e QR Code | Criar link para material impresso | Review-required | Criações vindas do conteúdo |
| Como medir cliques em campanhas simples | Pequenos negócios | Entender origem e performance | Métricas Premium e histórico | Avaliar Premium ou criar campanha | Review-required | Cliques em Premium |
| Links curtos para propostas e orçamentos | Vendas e atendimento | Enviar materiais sem URLs longas | Link curto em WhatsApp/email | Criar link e copiar mensagem | Allowed | Criações e compartilhamentos |
| Bio links para pequenos negócios | Lojas, profissionais e creators | Organizar vários links em uma página | Bio Premium | Avaliar Premium bio | Review-required | Leads/trials Premium |
| Checklist antes de imprimir QR Code | Eventos e materiais físicos | Evitar erro em QR impresso | QR Code e URL curta alternativa | Criar link e testar QR | Allowed | Engajamento com QR e formulário |
| Links curtos para anúncios pagos | Marketers | Melhorar clareza e acompanhamento | Alias e métricas Premium | Ver Premium | Review-required | Conversões Premium |
| Encurtador de URL brasileiro | Usuários BR e negócios locais | Encontrar ferramenta nacional simples | Home gratuita e confiança LGPD | Encurtar URL | Allowed | Criações orgânicas |

Critérios editoriais:

- Cada página deve responder uma intenção real de busca.
- Cada página deve conectar o tema ao uso do encurtador.
- Cada página deve ter uma ação clara: encurtar, copiar, gerar QR, ler guia ou avaliar Premium.
- Conteúdo sem relação direta com links, QR Code, compartilhamento, campanha, bio ou segurança deve ser rejeitado.

## 6. Growth loops

| Loop | Trigger | User action | Distribution mechanism | Measurement | Risk |
|------|---------|-------------|------------------------|-------------|------|
| Link curto gratuito | Usuário precisa compartilhar URL longa | Cria e copia link | Link circula em WhatsApp, redes, email e materiais | Criações, cópias, redirects | Abuso ou destino inseguro |
| QR Code | Usuário precisa ligar físico ao digital | Gera ou usa QR do link | QR impresso ou exibido em ponto físico | Aberturas por QR e criação pós-guia | QR sem contexto pode reduzir confiança |
| Conteúdo SEO | Usuário pesquisa solução | Lê guia e usa ferramenta | Busca orgânica e compartilhamento do artigo | Page views, criação pós-leitura | Conteúdo raso para anúncios |
| Mensagens prontas | Usuário quer enviar link com contexto | Copia template e link | Mensagens compartilhadas com marca/domínio | Copiar template, criar link | Spam ou mensagens sem consentimento |
| Bio Premium | Usuário precisa agregar links | Cria página bio | Perfil social divulga página | Visitas da bio, cliques, Premium | Confusão entre autoria e publicidade |
| Histórico e retorno | Usuário usa links com frequência | Retorna para reutilizar/gerenciar | Navegação direta e conta Premium | Retorno, login, dashboard | Upsell excessivo reduzir uso gratuito |

## 7. Premium complement strategy

Premium deve ser posicionado como controle e mensuração, não como barreira para o
uso básico. A proposta Premium deve enfatizar:

- Alias personalizado para campanhas e marca.
- Histórico persistente e gestão de links.
- Métricas úteis para canais, campanhas e materiais.
- Bio links para consolidar presença social.
- QR Codes e suporte para materiais físicos.
- Suporte prioritário para campanhas.

Regras:

- Não remover criação gratuita ilimitada como promessa central.
- Não bloquear QR Code básico se ele continuar sendo motor de viralização.
- Não inserir anúncio em checkout ou área Premium logada.
- Usar conteúdo editorial para educar sobre quando Premium faz sentido.

## 8. Compliance, trust, and LGPD guardrails

O plano depende de confiança. Todo novo item de monetização deve registrar:

- Dados pessoais ou comportamentais afetados.
- Terceiros envolvidos: Google AdSense, Google Analytics, Stripe, lead capture ou outros.
- Necessidade de atualização em política de privacidade, termos ou banner de cookies.
- Risco de tráfego inválido, clique acidental ou posicionamento enganoso.
- Risco de destino inseguro, phishing, malware, spam ou abuso.
- Evidência de que o usuário entende quando está vendo publicidade.

Superfícies legais e sensíveis devem permanecer sem anúncios. Páginas públicas
monetizadas devem preservar rótulo de publicidade, conteúdo original e navegação
clara.

## 9. Performance and user experience guardrails

Metas e regras:

- Redirecionamento deve continuar como hot path crítico, com meta p95 abaixo de 150ms quando a infraestrutura permitir.
- Publicidade não deve aparecer em rota de redirect ou preview.
- Páginas monetizadas devem reservar espaço visual para anúncios e evitar layout shift relevante.
- O formulário gratuito deve aparecer antes de qualquer experiência que possa confundir ou atrasar a criação.
- Mudanças com scripts, anúncios ou tracking devem registrar impacto esperado em LCP, CLS e conclusão da tarefa principal.

## 10. Metrics baseline

| Metric | Business question answered | Baseline source or collection approach | Review cadence | Decision threshold or expected use |
|--------|----------------------------|----------------------------------------|----------------|------------------------------------|
| Free link creations | O gratuito está crescendo? | Eventos de criação de URL | Semanal | Queda após anúncios exige revisão |
| Creation completion rate | Usuários concluem a tarefa principal? | Form submit versus sucesso | Semanal | Queda relevante exige pausa/revisão |
| Public page views | O SEO editorial atrai audiência? | Analytics por página pública | Semanal/mensal | Priorizar clusters com tráfego qualificado |
| Ad-eligible page share | Quanto tráfego pode monetizar? | Page views em superfícies allowed/review | Mensal | Aumentar via conteúdo, não via rotas sensíveis |
| Sharing actions | Links e QR Codes circulam? | Copiar link, abrir QR, templates | Semanal | Medir viralização gratuita |
| Premium interest | Conteúdo gera demanda avançada? | Cliques Premium, leads, checkout iniciado | Semanal/mensal | Ajustar CTAs e conteúdo |
| Trust signals | Há risco de reputação? | Erros, denúncias, suporte, links removidos | Semanal | Picos exigem revisão de abuso |
| Performance signals | Monetização degradou UX? | Redirect p95, LCP, CLS, criação | Semanal | Regressão exige rollback ou redução de anúncios |
| Decision throughput | O plano acelera decisões? | Tempo para go/revise/reject | Por proposta | Meta: decisão em até 15 minutos |

## 11. Decision workflow

Para qualquer nova ideia de monetização:

1. Descrever superfície, usuário e objetivo de negócio.
2. Classificar AdSense como allowed, forbidden ou review-required.
3. Identificar crescimento orgânico: SEO, compartilhamento, QR, bio, retenção ou Premium.
4. Registrar impacto em LGPD, terceiros, confiança e reputação do domínio.
5. Registrar impacto em performance e tarefa principal.
6. Associar ao menos uma métrica de produto e uma métrica técnica quando aplicável.
7. Decidir:
   - `go`: atende constituição, política de superfície, crescimento, privacidade, confiança e performance.
   - `revise`: tem valor, mas precisa de ajuste antes do planejamento.
   - `reject`: conflita com constituição, danifica fluxo gratuito, cria risco inaceitável ou não tem valor claro.

## 12. Risks and pause rules

Pausar ou revisar uma monetização quando:

- Uma rota proibida for marcada como ad-eligible.
- Houver aumento de clique acidental, tráfego inválido ou posicionamento enganoso.
- Conteúdo for raso, duplicado, não original ou desconectado do produto.
- A criação gratuita perder clareza ou conclusão.
- O redirect, preview ou rotas privadas receberem script publicitário.
- Páginas legais, checkout, login, registro ou dashboard passarem a exibir anúncios.
- Mudança exigir atualização legal/privacidade e ela ainda não tiver sido feita.
- LCP, CLS ou redirect p95 ficarem fora dos limites definidos para a experiência.

Gatilhos de atualização legal/privacidade:

- Novo terceiro de anúncios, analytics, pagamento ou lead capture.
- Nova coleta de dados pessoais ou comportamentais.
- Mudança de cookies, consentimento ou personalização de anúncios.
- Nova superfície pública que misture conteúdo do usuário e publicidade.

## 13. Future implementation backlog

1. Trocar slots placeholder por IDs reais de unidades AdSense aprovadas, mantendo placeholders desativados em produção.
2. Criar dashboard simples de métricas de negócio para free creations, page views, ad-eligible share, sharing actions e Premium interest.
3. Criar specs específicas para novos clusters editoriais priorizados.
4. Criar revisão de copy das páginas legais para corrigir trechos mistos de idioma e alinhar domínio de contato.
5. Definir processo de revisão de abuso e remoção de links de alto risco.
6. Definir política operacional para AdSense limitado, suspenso ou não aprovado.
7. Criar checklist de publicação editorial com SEO, AdSense, LGPD e performance.
8. Avaliar página bio pública como superfície review-required antes de qualquer monetização.
