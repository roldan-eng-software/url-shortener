# PRD — Conversão Anônimo → Premium (URLEncurta)

> Tipo: PRD de feature · Data: 2026-10-18
> **Status:** Aguardando implementação
>
> <!-- Valores possíveis: "Aguardando implementação" | "Implementada". Atualize para "Implementada" quando todas as specs estiverem concluídas. -->

## 1. Visão geral

O URLEncurta hoje entrega uma ferramenta gratuita excelente e "terminal": o
visitante anônimo encurta, copia, gera QR Code e vai embora — sem nunca tocar no
valor que o plano Premium oferece. Este PRD define as melhorias para transformar
esse uso pontual em assinatura recorrente, **sem interromper o fluxo gratuito**
(exigência da constituição do projeto).

O recorte **não** é "reformular o site". É construir uma ponte explícita entre a
tarefa gratuita e o valor pago, instrumentar o funil para saber onde o visitante
trava, ativar melhor quem entra no trial e adicionar recursos que justifiquem
continuar pagando.

### 1.1 Estado atual verificado no código (baseline)

Fatos confirmados por leitura do código em 2026-10-18:

**Fluxo gratuito (sem cadastro)**

- Encurta URL válida e devolve código curto; qualquer pessoa usa sem conta.
- Gera QR Code grátis e oferece mensagens prontas de compartilhamento.
- Histórico fica no navegador (localStorage) e é **cortado em 10 itens** para
  quem não é Premium, com um aviso de upsell que só aparece **depois** de
  ultrapassar o limite.

**Plano Premium (plano único, mensal)**

- Preço de R$ 29,90/mês com **7 dias de teste**, cartão via Stripe
  (checkout + webhook de ciclo de vida).
- Entrega: alias personalizado, métricas por **país (top 5), dispositivo e
  origem de tráfego (top 10)**, QR Code ilimitado, histórico salvo na conta e
  **página de bio** (mini link-in-bio) com handle, views e cliques por link.

**Aquisição e medição**

- Home redesenhada + 5 páginas editoriais de SEO e páginas de privacidade/termos.
- FAQ, selo de confiança e um CTA "mini Premium" na home.
- Captura de leads na home (tabela `marketing_leads`).
- Google Analytics carregado só após consentimento, com eventos de conversão já
  existentes no checkout (ex.: `checkout_login_required`, `checkout_started`) e
  atributos genéricos de rastreio de clique.

**Guardrails já vigentes**

- Anúncios (Adsterra) apenas em home e páginas editoriais, e só após
  consentimento de publicidade.
- Banner de cookies granular, política/termos e canal de direitos (LGPD).
- Redirecionamento tratado como hot path crítico (meta de latência protegida).

**Lacunas observadas (a causa deste PRD)**

1. O anônimo nunca vê uma amostra do valor Premium **no contexto** do uso.
2. A única "parede" para o anônimo é o limite de histórico — e ela é tardia e
   pouco convincente sozinha.
3. Não existe caminho leve anônimo → conta: para sentir o Premium é preciso
   login **e** assinatura de uma vez.
4. O plano é um só (mensal), sem opção anual ou degrau intermediário.
5. As métricas ricas (país/dispositivo/origem) são o argumento de venda mais
   forte e estão subutilizadas fora do dashboard.

**Fontes verificadas:** [`../project-overview.md`](../project-overview.md),
[`../architecture.md`](../architecture.md), [`../../README.md`](../../README.md),
[`../../specs/README.md`](../../specs/README.md) e a constituição em
[`../../.specify/memory/constitution.md`](../../.specify/memory/constitution.md).

## 2. Problema que resolve

O produto gera uso gratuito (valor de aquisição) mas **não gera percepção de
valor pago no momento em que ela importaria**. O visitante resolve a tarefa e
sai; o único gatilho de conversão é um limite de histórico que aparece tarde e
explica pouco. Resultado: muito tráfego, pouca assinatura — o funil "gratuito →
Premium" não existe como caminho desenhado, apenas como uma página de vendas
isolada.

## 3. Público-alvo

Foco desta rodada (decisão fechada com o solicitante):

- **Marketers e agências:** rodam campanhas e precisam de alias de marca,
  comparação de canais e origem de tráfego para decidir onde investir.
- **Criadores e social media:** vivem de bio link e de saber o que gera cliques.

Fica **fora** desta rodada o segmento de **pequenos negócios/atendimento via
WhatsApp** (ver seção 6), embora o fluxo gratuito continue atendendo a todos.

## 4. Objetivo do recorte atual

Aumentar a conversão de **visitantes anônimos em assinantes Premium**, tornando o
valor pago visível e desejável no momento certo, e sustentando esse valor com
recursos novos. O sucesso é medido em checkout iniciado/concluído e em ativação
pós-trial (ver seção 9), não em "melhorar o site" de forma genérica.

## 5. Funcionalidades

**Essenciais (esta rodada):**

- Funil instrumentado de ponta a ponta (anônimo → conta → trial → pago), com
  eventos por etapa para saber onde o visitante trava.
- Demonstração de valor Premium **no contexto** do uso gratuito (amostra de
  métricas/alias sem bloquear o encurtamento).
- Ponte leve anônimo → conta: guardar os links já criados ao criar uma conta,
  sem exigir assinatura.
- Página de assinatura orientada a resultado, por segmento (marketers/criadores),
  com prova e comparação clara.
- Onboarding de ativação após o trial começar (primeira vitória em minutos).
- Relatório exportável das métricas do Premium (levar dados para fora do produto).

**Desejáveis (esta rodada, em fase posterior):**

- Resumo periódico por e-mail (o valor "volta" sem o usuário lembrar de entrar).
- Plano anual com desconto e/ou degrau intermediário de plano.
- Personalização visual do QR Code.
- Experimentos controlados de preço/trial.

## 6. Fora do escopo

- Recursos para o segmento de pequenos negócios/atendimento via WhatsApp.
- Crescimento por anúncios/SEO como objetivo (é secundário aqui).
- Domínio próprio/branded links (infra pesada — reavaliar em outro recorte).
- Redesenho visual completo ou rebranding.
- Troca da stack de autenticação ou de banco.
- Área administrativa (`/admin`) e qualquer alteração nela.

## 7. Regras de negócio

- **R1 — Gratuito é intocável:** nenhuma melhoria pode bloquear, atrasar ou
  condicionar a criação do link gratuito.
- **R2 — Sem anúncio em superfície sensível:** anúncios continuam proibidos em
  API, dashboard, login/registro, checkout/premium, páginas legais, preview e
  rota de link curto.
- **R3 — Consentimento antes de terceiros (LGPD):** qualquer mecanismo de
  medição ou provedor novo só carrega após o consentimento aplicável.
- **R4 — Hot path protegido:** nenhuma mudança pode degradar a latência do
  redirecionamento nem a estabilidade de layout das páginas monetizadas.
- **R5 — Amostra não é bloqueio:** a demonstração de valor Premium é sempre
  informativa; nunca impede o uso gratuito.
- **R6 — Preço/planos podem mudar, mas isolados:** mudanças comerciais valem
  após o núcleo de conversão estar medido.
- **R7 — Um valor por vez:** a assinatura continua com um único "produto
  Premium", mesmo que passe a ter mais de uma forma de pagamento.

## 8. Fluxos principais

### Fluxo 1 — Anônimo encurta e descobre o Premium

1. Visitante cola a URL e encurta (sem cadastro).
2. Recebe o link curto e o QR Code, como hoje.
3. Vê, no próprio resultado, uma amostra do que o Premium mostraria (métricas,
   alias) — sem perder o resultado gratuito.
4. Se houver interesse, é convidado a **criar conta para salvar** os links
   criados; a assinatura é oferecida depois, em outro momento.

### Fluxo 2 — Anônimo cria conta e ativa

1. Cria conta a partir do resultado (os links já criados são preservados).
2. No painel, vê o que ainda falta para o Premium e uma oferta contextual.
3. Inicia o trial pelo checkout com cartão.

### Fluxo 3 — Assinante ativa e vê valor

1. Após o checkout, um guia de primeiros passos conduz à primeira vitória
   (criar um alias, ver a primeira métrica).
2. Recebe um resumo do desempenho que reforça o valor antes de a cobrança
   recorrente acontecer.

### Fluxo 4 — Assinante exporta/compartilha dados

1. Escolhe um link ou período.
2. Exporta o relatório e usa os dados fora do produto (planilha, cliente).

## 9. Critérios de aceite

- O anônimo continua encurtando sem cadastro, com o mesmo número de passos.
- O sistema mostra uma amostra de valor Premium no contexto, sem bloquear nada
  (R5).
- O sistema registra cada etapa do funil (visualizou oferta, criou conta, iniciou
  trial, converteu, cancelou).
- Ao criar conta a partir do resultado, os links já criados no dispositivo
  permanecem acessíveis na conta.
- O sistema não deve inserir anúncio em nenhuma superfície proibida (R2).
- O sistema não deve carregar medição/provedor sem consentimento (R3).
- Quando o trial começa, o usuário recebe um caminho de ativação com uma meta
  clara de "primeira vitória".
- O assinante consegue exportar as métricas de seus links.
- O sistema não deve degradar o redirecionamento nem introduzir layout shift
  relevante (R4).

## 10. Stack

Reaproveita integralmente o que o projeto já usa: Next.js (App Router) +
TypeScript + Tailwind no front/back, banco PostgreSQL gerenciado com Drizzle,
autenticação existente, Stripe para assinatura e Google Analytics (após
consentimento) para medição. Recursos novos que exijam algo a mais **não devem**
introduzir fornecedor incompatível com esse conjunto.

## 11. Justificativa da stack

A conversão anônimo → Premium é um problema de **produto e medição**, não de
tecnologia. Trocar de stack adicionaria risco sem resolver a causa raiz. Reusar
o que existe permite iterar rápido no funil, reaproveitar os dados de métricas já
coletados e manter os guardrails (LGPD, anúncios, performance) sem reescrever
nada.

## 12. Fases de construção

### Fase 1 — Medição (base)

Objetivo: saber onde o visitante trava antes de mexer na experiência.
Specs:

- Spec 01 — Instrumentação do funil anônimo → Premium

### Fase 2 — Ponte de valor (núcleo da conversão)

Objetivo: mostrar o valor pago no contexto e abrir um caminho leve para a conta.
Specs:

- Spec 02 — Amostra de valor Premium no resultado do encurtamento
- Spec 03 — Salvar meus links na conta (cadastro leve)

### Fase 3 — Ativação e apresentação

Objetivo: converter melhor e fazer o trial virar uso real.
Specs:

- Spec 04 — Onboarding de ativação pós-checkout
- Spec 05 — Página de assinatura orientada a segmento

### Fase 4 — Recursos Premium

Objetivo: dar motivos concretos para continuar pagando.
Specs:

- Spec 06 — Relatórios do Premium (exportação + resumo periódico)

### Fase 5 — Comercial (isolada)

Objetivo: aumentar o valor por assinante com controle de risco.
Specs:

- Spec 07 — Plano anual e estrutura de planos

## 13. Specs funcionais detalhadas

> Cada spec é autossuficiente: um agente de codificação deve conseguir planejar e
> implementar lendo só esta spec (mais as dependências citadas). O "como" técnico
> é decisão da etapa de codificação — aqui descrevemos comportamento e intenção.

### Spec 01 — Instrumentação do funil anônimo → Premium

- **Fase:** 1 — Medição
- **Objetivo (o quê):** registrar de forma confiável cada etapa do caminho
  anônimo → conta → trial → pago, com origem e contexto.
- **Intenção (por quê):** sem medir onde o visitante abandona, qualquer mudança
  de conversão vira palpite. Esta spec cria a linha de base para provar que as
  demais specs funcionaram.
- **Contexto:** a medição já existe parcialmente (eventos de checkout e
  atributos de clique nas páginas). O consentimento de cookies e o bloqueio de
  scripts antes do aceite também já existem e devem ser respeitados.
- **Atores:** visitante anônimo, usuário logado, assinante (eventos do Stripe).
- **Descrição do comportamento:** o sistema registra eventos nomeados para:
  visualizou o resultado do encurtamento; viu uma oferta/conteúdo Premium;
  clicou em "criar conta"; concluiu cadastro; iniciou checkout; concluiu
  assinatura; cancelou; e a origem/canal de cada passo. Eventos só são enviados
  quando o consentimento de medição permite.
- **Entradas e saídas:** entram ações do usuário e eventos do Stripe; saem
  registros de evento com nome, contexto (página, origem, tipo de link) e
  momento.
- **Dados/entidades envolvidos (conceitual):** evento do funil (nome, etapa,
  origem, identificador anônimo/sessão, data); associação opcional ao usuário
  quando há login.
- **Estados e transições:** Não se aplica (é registro, não fluxo de estado).
- **Regras de negócio:** R3 (nada de medição sem consentimento).
- **Validações:** todo evento deve ter nome conhecido e etapa válida; eventos
  sem consentimento não são enviados.
- **Fluxo do usuário (passo a passo):** não há UI nova; os eventos disparam a
  partir de ações existentes e novas.
- **Casos de borda e erros:** consentimento negado (nenhum evento de medição);
  múltiplas visualizações do mesmo passo (não contar como avanço); falha de
  envio (não impactar a navegação).
- **Impacto no existente:** reaproveita a camada de medição existente; não altera
  comportamento visível.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um visitante sem consentimento, Quando ele usa o encurtador, Então
    nenhum evento de medição é enviado.
  - Dado um visitante com consentimento, Quando ele conclui cada etapa, Então
    o evento correspondente é registrado com origem.
  - Dado um checkout concluído, Quando o Stripe confirma, Então a conversão é
    registrada e atribuída à origem quando possível.
- **Definição de pronto:** é possível responder, por um painel de Analytics,
  quantos anônimos viram conta e quantos viram assinantes, com origem.
- **Dependências:** Nenhuma.
- **Fora do escopo desta spec:** mudanças de interface e de preço.

### Spec 02 — Amostra de valor Premium no resultado do encurtamento

- **Fase:** 2 — Ponte de valor
- **Objetivo (o quê):** mostrar, logo após o encurtamento, uma amostra do que o
  Premium revela (métricas por país/dispositivo/origem e alias de marca), sem
  bloquear nem atrasar o resultado gratuito.
- **Intenção (por quê):** o anônimo não sabe o que perde. Ver uma prévia do valor
  no exato momento em que acabou de usar a ferramenta é o gatilho mais barato e
  mais honesto de conversão.
- **Contexto:** o resultado do encurtamento já exibe link curto, copiar e QR
  Code, e o histórico gratuito é limitado. As métricas reais só existem para
  links Premium após cliques; a amostra deve deixar claro quando um dado é
  ilustrativo versus real.
- **Atores:** visitante anônimo e usuário logado sem Premium.
- **Descrição do comportamento:** no resultado, o sistema apresenta um bloco
  informativo com os tipos de informação que o Premium entrega, deixando evidente
  que se trata de uma demonstração quando não há dados reais. É sempre possível
  ignorar e usar o resultado gratuito normalmente.
- **Entradas e saídas:** entra o link recém-criado e o estado do usuário
  (anônimo/logado/Premium); saem o bloco de amostra e um convite contextual.
- **Dados/entidades envolvidos (conceitual):** link curto, estado de assinatura,
  e dados de métricas quando existirem de verdade.
- **Estados e transições:** Premium vê dados reais; não-Premium vê amostra
  rotulada como demonstração.
- **Regras de negócio:** R1 (não bloquear) e R5 (amostra nunca é bloqueio).
- **Validações:** nunca exibir número inventado como se fosse real do link do
  usuário; rotular amostra/demonstração.
- **Fluxo do usuário (passo a passo):**
  1. Usuário encurta a URL.
  2. O resultado aparece como hoje.
  3. Abaixo, aparece um bloco "o que o Premium mostra neste link".
  4. Se Premium, o bloco mostra dados reais; se não, mostra amostra rotulada.
- **Casos de borda e erros:** link sem cliques (amostra, não zero seco);
  usuário Premium (sem oferta); falha ao carregar amostra (bloco simplesmente
  não aparece, sem quebrar o resultado).
- **Impacto no existente:** toca o resultado do encurtamento e o histórico da
  home; não altera as regras de criação de link.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um anônimo que acabou de encurtar, Quando o resultado aparece, Então
    ele continua copiando/gerando QR normalmente.
  - Dado um não-Premium, Quando vê a amostra, Então está rotulada como
    demonstração.
  - Dado um Premium, Quando abre o resultado, Então vê dados reais, não amostra.
- **Definição de pronto:** o bloco aparece sem bloquear o fluxo e sem número
  enganoso, e o evento de "viu oferta" é registrado (Spec 01).
- **Dependências:** Spec 01 (medição da oferta).
- **Fora do escopo desta spec:** mudança de preço e nova página de vendas.

### Spec 03 — Salvar meus links na conta (cadastro leve)

- **Fase:** 2 — Ponte de valor
- **Objetivo (o quê):** permitir que o anônimo crie uma conta a partir do
  resultado e **preserve na conta** os links já criados no dispositivo, sem
  exigir assinatura.
- **Intenção (por quê):** o maior salto do funil hoje é "anônimo → conta". Um
  ganho imediato e não-pago (não perder o que já criou) reduz esse salto e cria
  o usuário logado que depois poderá assinar.
- **Contexto:** o histórico gratuito vive no navegador e é limitado; a conta já
  existe para Premium. O cadastro atual é um caminho separado, sem relação com o
  que o visitante acabou de fazer.
- **Atores:** visitante anônimo que acabou de criar um ou mais links.
- **Descrição do comportamento:** o sistema oferece "criar conta para salvar
  seus links". Ao criar a conta, os links criados naquele dispositivo passam a
  aparecer na conta do usuário. A funcionalidade continua gratuita; o Premium é
  oferecido depois, em contexto separado.
- **Entradas e saídas:** entram os links locais do dispositivo e os dados de
  cadastro; saem os links associados à conta e a confirmação do usuário.
- **Dados/entidades envolvidos (conceitual):** usuário, link do usuário, e a
  marcação de quais links locais foram importados.
- **Estados e transições:** anônimo → conta criada (links importados) →
  (opcional) Premium.
- **Regras de negócio:** R1 (não bloquear o gratuito); a importação não pode
  sobrescrever links existentes na conta nem gerar duplicidade.
- **Validações:** impedir código curto duplicado; validar e-mail/senha conforme
  o cadastro atual; limitar abuso de importação repetida.
- **Fluxo do usuário (passo a passo):**
  1. Anônimo cria um link.
  2. Vê o convite "salve seus links criando uma conta".
  3. Cadastra-se; seus links locais aparecem na conta.
  4. É apresentado ao painel, onde o Premium é oferecido depois.
- **Casos de borda e erros:** código já existente na conta; e-mail já cadastrado
  (levar ao login e então importar); nenhum link local (criar conta normalmente).
- **Impacto no existente:** integra o cadastro existente com o histórico local;
  não altera a forma de encurtar.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um anônimo com links no dispositivo, Quando ele cria conta, Então os
    links ficam disponíveis na conta sem duplicar.
  - Dado um anônimo sem interesse, Quando ignora o convite, Então continua
    encurtando normalmente.
  - Dado um e-mail já cadastrado, Quando tenta criar conta, Então é levado ao
    login e os links são importados após entrar.
- **Definição de pronto:** um anônimo consegue transformar o histórico local em
  links de conta, sem assinatura, sem perda de dados.
- **Dependências:** Spec 01 (medir o passo).
- **Fora do escopo desta spec:** cobrança/assinatura nesta tela.

### Spec 04 — Onboarding de ativação pós-checkout

- **Fase:** 3 — Ativação e apresentação
- **Objetivo (o quê):** conduzir o novo assinante à primeira vitória dentro do
  trial (criar um alias e ver a primeira métrica), reduzindo o churn antes da
  cobrança.
- **Intenção (por quê):** assinar e não usar = cancelar. O trial só converte se o
  usuário sentir valor nos primeiros minutos.
- **Contexto:** já existem página de sucesso pós-checkout e painel com criar/editar
  link e estatísticas. O que falta é um caminho guiado, não telas novas do zero.
- **Atores:** usuário que acabou de iniciar o trial Premium.
- **Descrição do comportamento:** após o checkout, o sistema apresenta um guia
  curto de primeiros passos: criar um link com alias de campanha, copiar,
  compartilhar e abrir as estatísticas. O guia mostra progresso e desaparece
  quando concluído; um lembrete contextual reaparece se o usuário não voltar.
- **Entradas e saídas:** entra o estado da assinatura (trial ativo) e as ações do
  usuário; saem o progresso do onboarding e as primeiras métricas reais.
- **Dados/entidades envolvidos (conceitual):** assinatura (status/trial), usuário,
  link do usuário, evento de conclusão de passo.
- **Estados e transições:** trial iniciado → passos concluídos (total ou
  parcial) → onboarding encerrado; se inativo por vários dias, lembrete.
- **Regras de negócio:** R2 (sem anúncio na área Premium) e R5 (não travar o uso).
- **Validações:** só exibir para quem tem assinatura ativa; não exibir para
  assinantes antigos que já usam o produto.
- **Fluxo do usuário (passo a passo):**
  1. Conclui o checkout.
  2. Vê a página de sucesso com o guia de primeiros passos.
  3. Cria um link com alias.
  4. Compartilha e abre as estatísticas do link.
  5. Conclui o guia.
- **Casos de borda e erros:** já tem links na conta (pular para métricas);
  checkout cancelado (não iniciar onboarding); usuário volta dias depois (retomar
  de onde parou).
- **Impacto no existente:** usa a página de sucesso e o painel já existentes;
  não altera checkout nem cobrança.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um trial recém-iniciado, Quando entra na área Premium, Então vê o guia
    de primeiros passos.
  - Dado que ele conclui os passos, Quando termina, Então o guia não reaparece.
  - Dado que ele abandona, Quando retorna, Então o guia retoma do ponto em que
    parou.
- **Definição de pronto:** um novo assinante consegue chegar a "ver a primeira
  métrica do meu link" seguindo um caminho guiado.
- **Dependências:** Spec 01 (medir ativação).
- **Fora do escopo desta spec:** mudanças de preço/planos.

### Spec 05 — Página de assinatura orientada a segmento

- **Fase:** 3 — Ativação e apresentação
- **Objetivo (o quê):** reposicionar a página de assinatura para falar de
  resultado (o que o usuário consegue fazer) para marketers/agências e
  criadores, com comparação clara e prova.
- **Intenção (por quê):** a página atual lista recursos corretamente, mas vende
  "features" e não o resultado que o segmento-alvo busca (decidir onde investir,
  medir canais, ter link de marca).
- **Contexto:** a página já existe com tabela de comparação, FAQ, preço e
  checkout, e já registra eventos de conversão. O trabalho é de mensagem e
  organização, não de reinvenção.
- **Atores:** visitante anônimo e usuário logado sem Premium.
- **Descrição do comportamento:** a página apresenta o valor por cenário
  (campanha, perfil social), comparação gratuito x Premium, prova (exemplos/
  depoimentos) e uma chamada clara; mantém transparência sobre trial e cobrança.
- **Entradas e saídas:** entra a intenção do visitante (origem/campanha); sai a
  decisão de iniciar o checkout.
- **Dados/entidades envolvidos (conceitual):** conteúdo de marketing da página,
  estado de assinatura, eventos de conversão.
- **Estados e transições:** Não se aplica (página informativa + checkout).
- **Regras de negócio:** R2 (sem anúncio), R6 (sem mudar preço nesta spec) e
  transparência sobre o trial.
- **Validações:** divergência de preço entre página e checkout deve ser zero.
- **Fluxo do usuário (passo a passo):**
  1. Chega à página (por menu, CTA ou conteúdo).
  2. Reconhece seu caso de uso.
  3. Compara e decide iniciar o trial.
- **Casos de borda e erros:** não logado (levar ao login e voltar); checkout
  cancelado (mensagem clara, como hoje).
- **Impacto no existente:** altera conteúdo da página de assinatura; não altera
  o fluxo de pagamento.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um visitante de campanha, Quando lê a página, Então entende o resultado
    entregue, não só a lista de recursos.
  - Dado que ele decide assinar, Quando não está logado, Então faz login e volta
    ao checkout.
  - Dado preço exibido, Quando abre o checkout, Então o valor confere.
- **Definição de pronto:** a página comunica resultado por segmento e a taxa de
  checkout iniciado por visita sobe (medida na Spec 01).
- **Dependências:** Spec 01.
- **Fora do escopo desta spec:** alterar preço ou criar novos planos.

### Spec 06 — Relatórios do Premium (exportação + resumo periódico)

- **Fase:** 4 — Recursos Premium
- **Objetivo (o quê):** permitir exportar as métricas dos links e receber um
  resumo periódico por e-mail.
- **Intenção (por quê):** é o recurso que mais justifica continuar pagando: os
  dados saem do produto e voltam como valor recorrente sem o usuário precisar
  entrar. Também responde ao pedido de "plano com mais recursos".
- **Contexto:** as métricas por país/dispositivo/origem já são coletadas e
  exibidas por link no dashboard. Falta levá-las para fora e torná-las
  recorrentes.
- **Atores:** assinante Premium.
- **Descrição do comportamento:** o assinante escolhe um link (ou todos) e/ou um
  período e exporta um arquivo com o desempenho. Além disso, recebe por e-mail um
  resumo com os principais números do período.
- **Entradas e saídas:** entram o estado de assinatura e os dados de cliques;
  saem um arquivo exportado e um e-mail de resumo.
- **Dados/entidades envolvidos (conceitual):** link do usuário (cliques totais,
  por país, por dispositivo, por origem), período, destinatário do resumo.
- **Estados e transições:** exportação (solicitada → pronta/baixada); resumo
  (agendado → enviado).
- **Regras de negócio:** R2 (exportar/summar não introduz anúncio), R3 (envio por
  e-mail respeita consentimento/base legal).
- **Validações:** só o dono dos links exporta; período válido; e-mail do próprio
  assinante.
- **Fluxo do usuário (passo a passo):**
  1. No painel, escolhe link/período.
  2. Exporta o arquivo.
  3. Recebe, periodicamente, o resumo por e-mail.
- **Casos de borda e erros:** link sem cliques (exporta vazio, sem erro);
  período sem dados (mensagem clara); não Premium (não exporta, mostra convite).
- **Impacto no existente:** adiciona ações na área do dashboard já existente;
  não altera a coleta de métricas.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um assinante, Quando exporta um link, Então recebe os dados daquele
    link.
  - Dado um não-Premium, Quando tenta exportar, Então é convidado ao Premium.
  - Dado um assinante ativo, Quando o período fecha, Então recebe o resumo.
- **Definição de pronto:** um assinante consegue levar os dados para fora e
  recebe o resumo sem precisar pedir.
- **Dependências:** Spec 01 (medir uso do recurso).
- **Fora do escopo desta spec:** domínio próprio e novos formatos de anúncio.

### Spec 07 — Plano anual e estrutura de planos

- **Fase:** 5 — Comercial
- **Objetivo (o quê):** oferecer uma forma anual (com desconto) e, se fizer
  sentido, um degrau intermediário de plano.
- **Intenção (por quê):** aumentar o valor por assinante e reduzir churn,
  respondendo ao pedido de "assinaturas com mais recursos" sem depender só de
  tráfego novo.
- **Contexto:** hoje há um plano único mensal de R$ 29,90 com trial, cobrado via
  Stripe. Mudanças comerciais exigem tratamento cuidadoso de cobrança.
- **Atores:** visitante, novo assinante, assinante mensal que migra para anual.
- **Descrição do comportamento:** o sistema passa a oferecer mais de uma forma de
  assinatura (ex.: mensal e anual com desconto). A página de assinatura exibe as
  opções com clareza; a gestão de ciclo de vida da assinatura continua confiável.
- **Entradas e saídas:** entram a escolha do plano e os dados de cobrança; saem a
  assinatura criada/alterada e o estado Premium correspondente.
- **Dados/entidades envolvidos (conceitual):** plano (nome, período, preço),
  assinatura (status, renovação, trial), usuário.
- **Estados e transições:** sem assinatura → trial → ativa; mensal → anual;
  ativo → cancelado → expirado.
- **Regras de negócio:** R6 (mudança comercial isolada) e R7 (um único produto
  Premium, várias formas de pagamento); licenças e permissões Premium são as
  mesmas em qualquer forma.
- **Validações:** preço do plano exibido = preço cobrado; migração de mensal para
  anual não deve cobrar em duplicidade nem perder o período já pago.
- **Fluxo do usuário (passo a passo):**
  1. O visitante escolhe mensal ou anual.
  2. Inicia o trial/assinatura pelo checkout.
  3. O assinante mensal pode migrar para o anual.
- **Casos de borda e erros:** falha de pagamento; cancelamento; troca de plano no
  meio do ciclo; trial já usado.
- **Impacto no existente:** toca checkout, webhook e estado Premium — as partes
  mais sensíveis; deve ser implementada por último e de forma isolada.
- **Critérios de aceite (Dado/Quando/Então):**
  - Dado um visitante, Quando escolhe o anual, Então o valor cobrado corresponde
    ao anunciado.
  - Dado um mensal ativo, Quando migra para anual, Então não há cobrança
    duplicada e o acesso Premium permanece.
  - Dado qualquer forma de pagamento, Quando o acesso é verificado, Então as
    permissões Premium são as mesmas.
- **Definição de pronto:** existem duas formas de assinatura funcionando com
  cobrança e acesso consistentes.
- **Dependências:** Spec 05 (página que apresenta os planos).
- **Fora do escopo desta spec:** moedas/regiões diferentes e planos por assento.

## 14. Ordem recomendada de implementação

1. **Spec 01 — Instrumentação.** Sem baseline de funil, não se sabe se as outras
   melhorias funcionaram. É base para todas.
2. **Spec 02 — Amostra de valor.** Ato de maior impacto e menor risco: mostra o
   valor sem tocar no gratuito nem no pagamento.
3. **Spec 03 — Salvar meus links.** Converte anônimo em conta, criando o público
   certo para o Premium.
4. **Spec 04 — Onboarding de ativação.** Só faz sentido depois que há mais gente
   entrando no trial (Refs 02/03).
5. **Spec 05 — Página por segmento.** Melhora a decisão de compra com o funil já
   medido.
6. **Spec 06 — Relatórios do Premium.** Adiciona o motivo de permanência.
7. **Spec 07 — Plano anual.** Parte comercial, isolada e mais sensível; por
   último, com o núcleo de conversão já medido e estável.

Seguir esta ordem evita implementar partes fora de contexto e respeita as
dependências: medição antes de otimização, produto antes de preço.
