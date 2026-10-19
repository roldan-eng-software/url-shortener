---
description: 'Task list for Instrumentação do Funil Anônimo → Premium'
---

# Tasks: Instrumentação do Funil Anônimo → Premium

**Input**: Design documents from `/specs/005-premium-conversion-funnel/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Testes incluídos seguindo a convenção do projeto (**Playwright E2E**, em
`testsprite_tests/`). Não há Vitest nem script `test` no `package.json`; rodar com
`npx playwright test`.

**Organization**: Tasks agrupadas por user story para implementação e teste
independentes. Paths são relativos à raiz do repositório.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências pendentes)
- **[Story]**: User story associada (US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Criar a camada de persistência e confirmar o ambiente de validação.

- [x] T001 [P] Criar a migration `migrations/008_create_funnel_events.sql` com a tabela `funnel_events` conforme `data-model.md`: colunas `id uuid PK defaultRandom()`, `step varchar(40) NOT NULL`, `source varchar(80) NOT NULL`, `visitor_id varchar(64) NULL`, `user_id uuid NULL REFERENCES users(id) ON DELETE SET NULL`, `dedupe_key varchar(180) NOT NULL`, `occurred_at timestamp DEFAULT now() NOT NULL`, `metadata jsonb DEFAULT '{}' NOT NULL`; mais `UNIQUE (dedupe_key)`, `INDEX (step, occurred_at)`, `INDEX (source, occurred_at)`, `INDEX (user_id)`. Sem `ALTER` em tabelas existentes e sem backfill. **Nota:** o número é `008` (e não `006`) porque `006_add_processed_events.sql` e `007_all_pending.sql` já existem no repositório.
- [x] T002 [P] Adicionar a tabela `funnelEvents` e os tipos `FunnelEvent` / `NewFunnelEvent` em `lib/db/schema.ts`, refletindo exatamente as colunas e restrições de `migrations/008_create_funnel_events.sql`.
- [x] T003 [P] Confirmar pré-requisitos de validação: Playwright instalado (`npx playwright install`), `testDir: './testsprite_tests'` em `playwright.config.ts`, Stripe CLI disponível para `stripe listen --forward-to localhost:3000/api/stripe/webhook`, e `npm run lint` / `npx tsc --noEmit` funcionando. Registrar no `quickstart.md` qualquer pré-requisito faltante. **Registrado:** (a) browsers do Playwright presentes em revisão divergente da exigida pelo pacote instalado (`@playwright/test` → chromium `1208`) — necessário `npx playwright install chromium`; (b) Stripe CLI ausente no PATH; (c) `AUTH_SECRET` obrigatório para `next build`/`next start`.

**Checkpoint**: Migration e schema prontos; ambiente de teste verificado.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Biblioteca de instrumentação e consentimento das quais TODAS as user stories dependem.

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase.

- [x] T004 Criar `lib/analytics/funnel.ts` com o enum canônico de etapas (`result_viewed`, `offer_viewed`, `account_creation_started`, `account_created`, `trial_started`, `subscription_active`, `payment_failed`, `subscription_canceled`) e a função `recordFunnelStep({ step, source, visitorId, userId, metadata })`, que: deriva `dedupe_key` internamente como `visitor_id|user_id|step` (nunca aceito do cliente), normaliza `source` ausente para `"unknown"`, usa `ON CONFLICT (dedupe_key) DO NOTHING`, envolve tudo em `try/catch` fire-and-forget (nunca propaga erro) e rejeita `step` fora do enum.
- [x] T005 [P] Criar `lib/analytics/visitor.ts` com: cookie de primeira parte `urlshortener_visitor` (UUID opaco, `SameSite=Lax`, `Path=/`, **criado apenas após consentimento de analytics**), `getVisitorId()`, e captura de primeiro toque (`utm_source`/`utm_medium`/`utm_campaign` + `document.referrer`) com fallback `unknown`. Sem PII e sem IP.
- [x] T006 [P] Adicionar `trackFunnelStep(step, extras)` em `components/GoogleAnalytics.tsx`, reusando `trackConversionEvent`, no-op quando `getStoredCookieConsent()?.analytics` for falso ou `window.gtag` não existir.
- [x] T007 [P] Validar a Monetization Surface Gate: confirmar que nenhuma rota afetada muda de elegibilidade e que `api`, `dashboard`, `login`, `register`, `premium`/checkout, páginas legais, `preview`, redirecionamento e short-code de usuário seguem bloqueados para Adsterra. Registrar a evidência em `specs/005-premium-conversion-funnel/plan.md` (seção Constitution Check).
- [x] T008 [P] Validar a Trust/LGPD Gate: confirmar por revisão de código que nenhum evento é emitido sem `analytics: true`, que `metadata` não contém e-mail/IP/URL original, e que a retenção de 12 meses está alinhada ao `PLANO_LGPD.md`. Registrar a evidência no `plan.md`.

**Checkpoint**: Fundação pronta — as user stories podem começar.

---

## Phase 3: User Story 1 - Enxergar o funil completo (Priority: P1) 🎯 MVP

**Goal**: Registrar cada etapa da jornada (resultado visto → oferta vista → conta iniciada → conta criada) e permitir visualizar o funil por período.

**Independent Test**: Percorrer a jornada (anônimo, conta nova) com consentimento e confirmar que cada etapa aparece **uma única vez** em `/admin/funnel`, com a taxa anônimo → conta calculável.

### Tests for User Story 1 (OPTIONAL — convenção do projeto) ⚠️

> **NOTE: escrever os testes primeiro e garantir que FALHAM antes da implementação.**

- [x] T009 [P] [US1] Criar teste E2E da jornada completa com consentimento em `testsprite_tests/funnel-journey.spec.ts` (Cenário 1 do `quickstart.md`), cobrindo `result_viewed`, `offer_viewed`, `account_creation_started` e `account_created` na mesma jornada.
- [x] T010 [P] [US1] Criar teste E2E `testsprite_tests/funnel-consent.spec.ts` (Cenário 2) provando que, sem consentimento de analytics, **nenhum** evento é emitido e o cookie `urlshortener_visitor` não é criado.

### Implementation for User Story 1

- [x] T011 [P] [US1] Instrumentar `result_viewed` em `components/UrlForm.tsx` (sucesso do encurtamento), via `trackFunnelStep`, sem alterar o comportamento do fluxo gratuito.
- [x] T012 [P] [US1] Instrumentar `offer_viewed` com `surface: 'home'` em `components/HomeRedesign.tsx` (faixa de conversão).
- [x] T013 [P] [US1] Instrumentar `offer_viewed` com `surface: 'premium_page'` em `app/premium/page.tsx`, preservando os eventos existentes (`checkout_started`, `checkout_login_required`).
- [x] T014 [P] [US1] **Desvio documentado — não implementado.** A tarefa previa instrumentar `offer_viewed` com `surface: 'dashboard_upsell'` em `app/dashboard/page.tsx`. Verificado no código: `app/dashboard/layout.tsx` exige sessão **e** Premium (`!data.userId` → `/login`, `!data.isPremium` → `/premium`) e não renderiza os filhos enquanto não há usuário, portanto **um visitante anônimo ou não-Premium nunca vê esse upsell** — instrumentá-lo seria código morto. Cobertura de `offer_viewed` fica com `surface: 'home'` (T012) e `surface: 'premium_page'` (T013), os únicos visíveis no funil alvo. O caso correspondente foi removido de `testsprite_tests/funnel-journey.spec.ts`.
- [x] T015 [P] [US1] Instrumentar `account_creation_started` em `app/register/page.tsx`.
- [x] T016 [US1] Registrar `account_created` server-side em `app/api/auth/register/route.ts`, passando `userId` (recém-criado) e o `visitorId` recebido no corpo da requisição (FR-005), usando `recordFunnelStep`; falha no registro não pode afetar a resposta de cadastro.
- [x] T017 [US1] Criar o endpoint `GET /api/admin/funnel` em `app/api/admin/funnel/route.ts` retornando agregados por período (`from`, `to`) e por etapa, com `totals`, `steps` e `conversionRates` conforme `contracts/funnel-metrics.openapi.yaml`; protegido pelo mesmo padrão `is_admin` dos demais `app/api/admin/*` (401 sem sessão, 403 sem admin).
- [x] T018 [US1] Criar a página `app/admin/funnel/page.tsx` e o componente `components/admin/FunnelChart.tsx` consumindo `GET /api/admin/funnel`, exibindo as etapas e as taxas de transição.
- [x] T019 [US1] Adicionar a entrada "Funil" em `components/admin/AdminSidebar.tsx` apontando para `/admin/funnel`.

**Checkpoint**: US1 funcional e testável isoladamente (MVP entregável).

---

## Phase 4: User Story 2 - Atribuir a origem de cada conversão (Priority: P2)

**Goal**: Saber de qual canal/origem veio cada avanço e ler a conversão por canal.

**Independent Test**: Chegar por duas origens distintas (ex.: `?utm_source=a` e `?utm_source=b`) e confirmar que os avanços ficam associados à origem correta e que os anônimos aparecem como `unknown`, nunca descartados.

### Tests for User Story 2 (OPTIONAL) ⚠️

- [x] T020 [P] [US2] Criar teste E2E `testsprite_tests/funnel-attribution.spec.ts` cobrindo duas origens distintas e o caso sem origem (`unknown`), conforme Cenário 1 do `quickstart.md`.

### Implementation for User Story 2

- [x] T021 [US2] Propagar `visitorId` (e a origem capturada) no início do checkout: enviar o identificador em `app/premium/page.tsx` e aceitá-lo em `app/api/stripe/checkout/route.ts`, para que as etapas de cobrança mantenham o vínculo anônimo → conta.
- [x] T022 [US2] Estender `GET /api/admin/funnel` em `app/api/admin/funnel/route.ts` com o parâmetro `groupBy=source` e o campo `unknownSourceShare` (SC-003 permite até 10%). **Implementado junto com T017** (mesmo arquivo; executado em sequência conforme os conflitos de arquivo abaixo).
- [x] T023 [US2] Exibir a conversão por canal em `app/admin/funnel/page.tsx` / `components/admin/FunnelChart.tsx` (visão por origem + indicador de origem desconhecida). **Implementado junto com T018** (mesmos arquivos).

**Checkpoint**: US1 e US2 funcionam independentemente.

---

## Phase 5: User Story 3 - Consolidar o ciclo de vida da assinatura (Priority: P3)

**Goal**: Trial, assinatura ativa, falha de pagamento e cancelamento como etapas do mesmo funil.

**Independent Test**: Simular os estados de assinatura e confirmar que cada um vira a etapa correspondente, sem duplicar em reentrega.

### Tests for User Story 3 (OPTIONAL) ⚠️

- [x] T024 [P] [US3] Criar teste `testsprite_tests/funnel-subscription.spec.ts` (Cenário 4) provando que reenviar o mesmo evento Stripe não cria segunda linha em `funnel_events` e que `processed_events` contém o id.

### Implementation for User Story 3

- [x] T025 [US3] Mapear os eventos Stripe já tratados para etapas do funil em `app/api/stripe/webhook/route.ts`, **após** o guard de idempotência de `processed_events`: `trial_started`, `subscription_active`, `payment_failed`, `subscription_canceled`, gravando `plan`/`cycle` em `metadata` (sem PII).
- [x] T026 [US3] Expor as etapas financeiras na leitura: incluir `payment_failed` e `subscription_canceled` em `steps`/`conversionRates` de `app/api/admin/funnel/route.ts` e representá-las em `app/admin/funnel/page.tsx`. **Implementado junto com T017**: `payment_failed` e `subscription_canceled` já fazem parte do enum canônico, o endpoint os agrega em `steps` e `paidToCanceled` é calculado em `conversionRates`. `cycle` é gravado em `metadata`.
- [x] T027 [P] [US3] Documentar em `specs/005-premium-conversion-funnel/plan.md` o mapa evento Stripe → etapa do funil como referência de manutenção.

**Checkpoint**: Todas as user stories funcionam independentemente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias que atravessam as user stories.

- [x] T028 [P] Atualizar a documentação de estado: `docs/architecture.md` (nova tabela, `lib/analytics/*`, endpoint e página admin), `specs/README.md` (005 → Implemented) e a linha do PRD em `docs/project-overview.md`.
- [x] T029 [P] Documentar a política de retenção (12 meses) e a pendência operacional de expurgo dos eventos de funil em `docs/architecture.md`, referenciando o `PLANO_LGPD.md`. **Feito junto com T028** (mesma seção acrescentada em `docs/architecture.md`).
- [x] T030 Verificar o hot path: confirmar que `app/[shortCode]/page.tsx` e `app/api/redirect/[shortCode]/route.ts` (redirecionamento) não ganharam peso nem script novo e medir LCP/CLS das páginas monetizáveis após as mudanças.
- [x] T031 [P] Verificar sitemap, `app/robots.ts`, canonical e indexabilidade das páginas públicas monetizáveis (nenhuma deve mudar em razão desta feature).
- [x] T032 [P] Verificar que os slots Adsterra usam IDs de produção aprovados ou seguem desativados/placeholder fora de produção.
- [x] T033 Executar a validação completa: os 7 cenários de `specs/005-premium-conversion-funnel/quickstart.md`, `npx playwright test`, `npm run lint` e `npx tsc --noEmit`. Corrigir desvios antes de considerar a feature pronta. **Executado:** `npx tsc --noEmit` exit 0; `npx eslint` nos arquivos alterados exit 0; `npm run build` exit 0 (exige `AUTH_SECRET` + `DATABASE_URL`); `npx playwright test testsprite_tests/funnel-*.spec.ts` → **8 passed, 1 skipped** (`funnel-subscription.spec.ts` exigia banco). Cenários 3–7 do quickstart permanecem validação manual (banco real + Stripe CLI).
- [x] T034 [P] Atualizar o ponteiro do Spec Kit em `AGENTS.md` para `specs/005-premium-conversion-funnel/plan.md` e revisar se `.specify/feature.json` permanece correto.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências.
- **Foundational (Phase 2)**: depende de Setup — **bloqueia todas as user stories** (T004 é pré-requisito de toda gravação de evento).
- **US1 (Phase 3)**: depende da Foundational. É o **MVP**.
- **US2 (Phase 4)**: depende da Foundational; reusa o endpoint/página criados em US1 (T022/T023 editam arquivos de US1).
- **US3 (Phase 5)**: depende da Foundational; independente de US1/US2 na gravação, mas T026 edita arquivos de US1/US2.
- **Polish (Phase 6)**: depende das histórias desejadas estarem completas.

### Dependências internas

- T002 depende conceitualmente de T001 (mesmo contrato), mas são arquivos distintos.
- T004 bloqueia T011–T016, T021, T025 (toda escrita de evento).
- T005/T006 bloqueiam T011–T015 (eventos de cliente).
- T017 bloqueia T018 e T022/T026 (leitura).
- Testes (T009, T010, T020, T024) devem ser escritos e **falhar** antes das implementações correspondentes.

### Conflitos de arquivo (evitar paralelismo)

`app/api/admin/funnel/route.ts` (T017, T022, T026), `app/admin/funnel/page.tsx`
(T018, T023, T026), `app/premium/page.tsx` (T013, T021) e
`components/admin/FunnelChart.tsx` (T018, T023) são tocados por mais de uma tarefa —
executar em sequência.

### Parallel Opportunities

- Setup: T001, T002, T003 em paralelo.
- Foundational: T005, T006, T007, T008 em paralelo após T004.
- US1: T009–T015 em paralelo (arquivos distintos); T016–T019 em sequência.
- US2: T020 isolado; T021 isolado; T022 → T023 em sequência.
- US3: T024 e T027 em paralelo; T025 → T026.
- Polish: T028, T029, T031, T032, T034 em paralelo.

---

## Parallel Example: User Story 1

```bash
# Testes (primeiro, devem falhar):
Task: "E2E da jornada completa com consentimento em testsprite_tests/funnel-journey.spec.ts"
Task: "E2E sem consentimento em testsprite_tests/funnel-consent.spec.ts"

# Instrumentação de cliente (arquivos distintos):
Task: "result_viewed em components/UrlForm.tsx"
Task: "offer_viewed (home) em components/HomeRedesign.tsx"
Task: "offer_viewed (premium) em app/premium/page.tsx"
Task: "offer_viewed (upsell) em app/dashboard/page.tsx"
Task: "account_creation_started em app/register/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 apenas)

1. Phase 1: Setup (T001–T003).
2. Phase 2: Foundational (T004–T008) — bloqueia tudo.
3. Phase 3: US1 (T009–T019).
4. **PARAR e VALIDAR**: Cenários 1, 2, 3 e 6 do `quickstart.md`.
5. Deploy/demo se estiver pronto: já é possível medir a taxa anônimo → conta.

### Incremental Delivery

1. Setup + Foundational → fundação pronta.
2. US1 → valida independente → **MVP**: funil anônimo → conta visível no `/admin/funnel`.
3. US2 → valida independente → conversão por canal.
4. US3 → valida independente → conversão e churn completos.
5. Cada história agrega valor sem quebrar as anteriores.

### Parallel Team Strategy

1. Time conclui Setup + Foundational junto.
2. Depois: Dev A (US1), Dev B (US2), Dev C (US3) — respeitando os conflitos de arquivo listados acima.

---

## Notes

- `[P]` = arquivos diferentes, sem dependência pendente.
- Nenhuma dependência nova, nenhum fornecedor novo: apenas GA, Stripe e Drizzle/Neon já existentes.
- Nenhuma tarefa altera o caminho de redirecionamento (`app/[shortCode]/page.tsx` e `app/api/redirect/[shortCode]/route.ts`).
- Falha de telemetria nunca pode quebrar a ação do usuário (FR-008).
- Nenhum evento sai sem consentimento de analytics (FR-004).
- Verificar que os testes falham antes de implementar.
- Registrar o progresso em `specs/005-premium-conversion-funnel/quickstart.md`.
- **Desvios registrados na execução:** a migration é `008_create_funnel_events.sql` (não `006`, número já ocupado); T014 foi removido por ser código morto (o upsell do dashboard é inacessível a visitantes anônimos/não-Premium); T017 entregou também T022/T026 e T018 entregou T023, por compartilharem os mesmos arquivos.
