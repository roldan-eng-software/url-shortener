# Feature Specification: Instrumentação do Funil Anônimo → Premium

**Feature Branch**: `005-premium-conversion-funnel`  
**Created**: 2026-10-18  
**Status**: Draft  
**Input**: User description: "Instrumentação do funil de conversão anônimo → Premium: registrar cada etapa (visualizou a oferta, criou conta, iniciou trial, converteu, cancelou) com a origem, para medir a conversão de visitantes anônimos em assinantes." (corresponde à **Spec 01** do PRD [`../../docs/prd/feature-conversao-e-retencao.md`](../../docs/prd/feature-conversao-e-retencao.md))

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Enxergar o funil completo (Priority: P1)

Como responsável por produto e crescimento, quero ver quantos visitantes avançam em
cada etapa da jornada (resultado do encurtamento → oferta de assinatura vista →
conta criada → trial iniciado → assinatura efetivada → cancelamento), para saber
exatamente em qual ponto a conversão de anônimo para Premium trava.

**Why this priority**: é a base de todo o trabalho de conversão. Sem uma visão
confiável do funil, qualquer mudança de experiência vira palpite e não pode ser
validada. Sozinho, este item já entrega valor: revela onde está o abandono.

**Independent Test**: pode ser testado percorrendo manualmente a jornada (como
anônimo, como conta nova e como assinante) e verificando que cada etapa aparece
registrada uma única vez, com o valor esperado.

**Acceptance Scenarios**:

1. **Given** um visitante com consentimento de medição, **When** ele conclui cada
   etapa da jornada, **Then** a etapa correspondente do funil é registrada.
2. **Given** uma jornada em que o visitante abandona no meio, **When** o período é
   analisado, **Then** o abandono é visível na etapa onde parou.
3. **Given** um visitante que volta e repete a mesma etapa, **When** o funil é
   analisado, **Then** a mesma etapa não é contada como um novo avanço.

---

### User Story 2 - Atribuir a origem de cada conversão (Priority: P2)

Como responsável por marketing, quero saber de qual canal/origem veio cada avanço
(conteúdo editorial, busca, compartilhamento, campanha), para investir onde a
conversão realmente acontece.

**Why this priority**: sem atribuição, sabe-se que há conversão, mas não o que a
gera. Aumenta a utilidade do funil (US1) sem ser pré-requisito para ele.

**Independent Test**: chegar de origens diferentes (ex.: uma página editorial e a
home) e confirmar que os avanços ficam associados à origem correta.

**Acceptance Scenarios**:

1. **Given** um visitante que chega por um canal identificável, **When** ele
   avança no funil, **Then** a origem é registrada junto da etapa.
2. **Given** um visitante sem origem identificável, **When** ele avança, **Then** o
   avanço é registrado como origem desconhecida (não descartado).

---

### User Story 3 - Consolidar o ciclo de vida da assinatura (Priority: P3)

Como responsável financeiro, quero que trial, assinatura ativa, falha de pagamento
e cancelamento apareçam como etapas do mesmo funil, para medir conversão,
permanência e churn no mesmo lugar.

**Why this priority**: completa a leitura do funil do lado do dinheiro. Depende de
US1 existir, mas pode ser adicionado depois sem retrabalho.

**Independent Test**: simular os estados de assinatura fornecidos pelo provedor de
cobrança e confirmar que cada um aparece como a etapa correspondente.

**Acceptance Scenarios**:

1. **Given** um trial iniciado, **When** o status de assinatura muda, **Then** a
   etapa correspondente é registrada no funil.
2. **Given** um cancelamento, **When** ocorre, **Then** o funil permite distinguir
   trial→pago de pago→cancelado.

---

### Edge Cases

- **Sem consentimento**: o visitante usa o encurtador sem aceitar medição — nenhum
  evento de medição é registrado e a experiência não muda.
- **Bloqueio de scripts pelo usuário**: mesmo com consentimento, o envio pode ser
  bloqueado — a jornada continua normalmente e a ausência de evento não deve ser
  contada como abandono.
- **Mesma etapa repetida**: recarregar a página ou voltar não pode inflar o funil.
- **Identidade anônima → logada**: o visitante cria conta no meio da jornada — os
  avanços anteriores e posteriores devem poder pertencer à mesma pessoa.
- **Falha no registro**: se o registro de um evento falhar, a ação do usuário
  (encurtar, copiar, assinar) continua funcionando.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST register a named event for each funnel step: result
  viewed, premium offer viewed, account creation started, account created, trial
  started, subscription active, and subscription canceled.
- **FR-002**: Each event MUST carry the step it represents and the moment it
  happened.
- **FR-003**: Each event MUST carry the acquisition source/channel when it can be
  identified, and mark it as unknown otherwise.
- **FR-004**: System MUST NOT register any measurement event before the applicable
  consent is granted.
- **FR-005**: System MUST associate a visitor's earlier anonymous steps with the
  same person after they create an account, so the journey is not split.
- **FR-006**: System MUST NOT count the same step as a new advance when the visit
  simply repeats it (reload/back navigation).
- **FR-007**: System MUST reflect subscription lifecycle changes from the billing
  provider (trial, active, payment failed, canceled) as funnel steps.
- **FR-008**: System MUST NOT let a failure to register an event interrupt the
  user's task (shortening, copying, subscribing).
- **FR-009**: System MUST limit the data captured per event to what is necessary
  to measure the funnel (no sensitive personal data beyond the minimum needed).

### Monetization, Growth & Compliance Requirements _(mandatory when affected)_

- **MG-001**: This feature affects Premium conversion and analytics only. It does
  NOT change the free shortening flow, advertising surfaces, SEO pages, sharing
  loops, QR Codes, or bio links.
- **MG-002**: Advertising is not affected: no route becomes ad-eligible or
  ineligible, and blocked routes (APIs, private, legal, checkout, preview,
  redirect, user short-code) stay blocked.
- **MG-003**: No public content is added, so no search intent, sitemap, or
  canonical behavior changes.
- **MG-004**: Tracking/third-party scripts ARE affected: measurement must remain
  behind the existing consent choice, respect data minimization, and not add new
  data categories beyond the funnel steps and their source.
- **MG-005**: The redirect and public pages are not modified, so no performance
  budget changes; the feature MUST NOT add any client-side weight to the
  short-code redirect path.

### Key Entities _(include if feature involves data)_

- **Funnel Event**: a recorded step of the journey — which step, when it happened,
  the source/channel, and a visitor identifier that is anonymous before login and
  tied to the account after login. Not a system-design entity; represents the
  information needed to reconstruct the funnel.
- **Subscription State**: the lifecycle value supplied by the billing provider
  (trial, active, payment failed, canceled) that maps to a funnel step.
- **Visitor/User Identity**: the anonymous visitor before an account exists, and
  the account user afterwards; the feature must be able to relate the two along a
  single journey.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: It is possible to compute the conversion rate of each transition
  (anonymous → account → trial → paid → canceled) for any chosen period.
- **SC-002**: 100% of measurement events respect the visitor's consent — zero
  events are sent when consent is denied.
- **SC-003**: At least 90% of "trial started" and "subscription active" steps have
  a known source/channel attributed.
- **SC-004**: The time to complete the free shortening task does not increase in
  any measurable way for the visitor.
- **SC-005**: The difference between funnel-recorded conversions and the billing
  provider's own record is below 5% for the same period.

## Assumptions

- The existing consent mechanism already exists and is reused; no new consent
  category is required.
- The existing measurement and billing-provider event infrastructure are reused;
  no new third-party vendor is introduced.
- "Consent denied" and "script blocked" both result in missing events, and the
  funnel is interpreted accordingly (no false abandonment signal).
- Only the funnel steps listed in FR-001 are in scope; deeper behavioral analytics
  is out of scope.
- This specification covers measurement only — it does not change any user-facing
  experience, price, or plan.
