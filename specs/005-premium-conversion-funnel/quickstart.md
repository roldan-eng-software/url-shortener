# Quickstart: Instrumentação do Funil Anônimo → Premium

**Date**: 2026-10-18
**Feature**: Instrumentação do Funil Anônimo → Premium (005-premium-conversion-funnel)

Guia de **validação** da feature. Não contém implementação — detalhes de modelo em
[`data-model.md`](./data-model.md), de eventos em
[`contracts/analytics-events.md`](./contracts/analytics-events.md) e de leitura em
[`contracts/funnel-metrics.openapi.yaml`](./contracts/funnel-metrics.openapi.yaml).

## Pré-requisitos

- Node.js 18+ e dependências instaladas (`npm install`).
- `DATABASE_URL` (Neon), `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` configurados.
- `AUTH_SECRET` configurado: `next build`/`next start` falham sem ele
  (`AUTH_SECRET or NEXTAUTH_SECRET is required in production`). Verificado na
  validação da feature.
- Stripe CLI disponível para encaminhar webhooks em ambiente local
  (`stripe listen --forward-to localhost:3000/api/stripe/webhook`).
  **Pendência do ambiente de desenvolvimento:** o Stripe CLI **não** estava
  instalado no PATH durante a implementação; instale-o antes dos Cenários 1
  (passos 6–7) e 4.
- Migration `008_create_funnel_events.sql` aplicada (o número é `008`, não `006`,
  porque `006_add_processed_events.sql` e `007_all_pending.sql` já existiam).
- Playwright instalado **na revisão exigida pelo pacote**: já haviam browsers em
  `ms-playwright`, mas numa revisão diferente da esperada pela versão instalada
  (`@playwright/test` → chromium `1208`). Rodar `npx playwright install chromium`
  para baixar a revisão correta. Verificado na validação da feature.

## Setup

```bash
# 1. Aplicar a migration (Neon console ou drizzle-kit, conforme o fluxo do projeto)
#    migrations/008_create_funnel_events.sql

# 2. Subir a aplicação
npm run dev

# 3. (outro terminal) Encaminhar eventos do Stripe para o webhook local
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Cenários de validação

### Cenário 1 — Funil completo, com consentimento (P1 / SC-001, SC-003)

1. Abrir a home com `?utm_source=teste&utm_medium=quickstart` em uma janela anônima.
2. Aceitar cookies **com** analytics.
3. Encurtar uma URL → esperado: evento `result_viewed`.
4. Clicar na oferta Premium → esperado: `offer_viewed` com `surface`.
5. Criar conta → esperado: `account_created` com `user_id` e origem `teste`.
6. Iniciar assinatura em modo teste → esperado: `trial_started`.
7. Concluir o pagamento → esperado: `subscription_active`.

**Resultado esperado**: os 5 passos aparecem no mesmo funil, com a origem
`teste`; a taxa anônimo → conta é > 0.

### Cenário 2 — Sem consentimento (P1 / SC-002, FR-004)

1. Abrir a home em janela anônima e recusar cookies (ou não interagir).
2. Repetir os passos 3–7 do Cenário 1.

**Resultado esperado**: nenhum evento no GA e nenhuma linha correspondente a
passos de cliente; nenhuma requisição de rede para endpoints de analytics;
o cookie de visitante **não** é criado.

### Cenário 3 — Etapa repetida não infla (FR-006)

1. Com consentimento, encurtar uma URL, recarregar e voltar no histórico.
2. Consultar o funil.

**Resultado esperado**: a etapa não aparece duplicada para o mesmo visitante.

### Cenário 4 — Reentrega do webhook não duplica (FR-007)

1. Reenviar o mesmo evento Stripe (`stripe events resend <id>`).

**Resultado esperado**: nenhuma linha nova; `processed_events` contém o id.

### Cenário 5 — Falha de telemetria não quebra o produto (FR-008)

1. Simular indisponibilidade do banco para a tabela (ex.: apontar `DATABASE_URL`
   inválida apenas no caminho de registro).
2. Encurtar uma URL e criar conta.

**Resultado esperado**: as ações concluem normalmente; apenas log de erro.

### Cenário 6 — Leitura do funil no admin (SC-001)

```bash
curl -s "http://localhost:3000/api/admin/funnel?from=2026-10-01&groupBy=source" \
  -H "Cookie: session=<cookie-de-admin>"
```

**Resultado esperado**: JSON conforme
[`contracts/funnel-metrics.openapi.yaml`](./contracts/funnel-metrics.openapi.yaml),
com `conversionRates` e `unknownSourceShare`. Sem sessão de admin → `401`/`403`.

### Cenário 7 — Redirecionamento intacto (MG-005)

```bash
# Usar um short-code conhecido
curl -s -o /dev/null -w "%{http_code} %{time_total}\n" -L "http://localhost:3000/<codigo>"
```

**Resultado esperado**: redireciona normalmente; nenhum script novo carregado na
rota de redirecionamento (comparar com o comportamento antes da feature).

## Verificações automatizadas (Playwright)

```bash
npx playwright test
```

Cobertura mínima esperada:

- Cenário 1 (jornada completa com consentimento).
- Cenário 2 (ausência total de eventos sem consentimento).
- Regressão: encurtamento gratuito continua funcionando sem cadastro.

## Conferência de conformidade

```bash
npm run lint
npx tsc --noEmit
```

Checklist final:

- [ ] Nenhum evento sem consentimento (Cenário 2).
- [ ] Nenhuma PII no `metadata` (revisar `data-model.md`).
- [ ] Reentrega do Stripe não duplica (Cenário 4).
- [ ] Redirecionamento sem peso novo (Cenário 7).
- [ ] Funil legível no `/admin/funil`.

## Troubleshooting

| Sintoma                       | Causa provável                        | Ação                                                |
| ----------------------------- | ------------------------------------- | --------------------------------------------------- |
| Funil vazio com consentimento | Migration não aplicada                | Aplicar `008_create_funnel_events.sql`              |
| Só aparecem passos de cliente | Webhook não encaminhado               | Verificar `stripe listen` e `STRIPE_WEBHOOK_SECRET` |
| `source` sempre `unknown`     | UTM ausente na entrada                | Testar com `?utm_source=...`                        |
| 403 em `/api/admin/funnel`    | Usuário sem `is_admin`                | Marcar admin conforme spec 004                      |
| Passos anônimos soltos        | `visitorId` não propagado no cadastro | Conferir `contracts/analytics-events.md`            |

## Resultados da validação (2026-10-18)

Executado durante a implementação:

| Verificação               | Comando                                                 | Resultado                                      |
| ------------------------- | ------------------------------------------------------- | ---------------------------------------------- |
| Tipos                     | `npx tsc --noEmit`                                      | ✅ exit 0                                      |
| Lint (arquivos alterados) | `npx eslint <arquivos>`                                 | ✅ exit 0                                      |
| Build de produção         | `npm run build`                                         | ✅ exit 0 (com `AUTH_SECRET` + `DATABASE_URL`) |
| Testes E2E do funil       | `npx playwright test testsprite_tests/funnel-*.spec.ts` | ✅ 8 passed, 1 skipped                         |

Detalhe dos testes:

- `funnel-journey.spec.ts` — 3 passed (offer_viewed na home + cookie de visitante,
  offer_viewed na página Premium, account_creation_started no cadastro).
- `funnel-consent.spec.ts` — 3 passed (nenhum evento e nenhum cookie sem
  consentimento em `/`, `/premium`, `/register`).
- `funnel-attribution.spec.ts` — 2 passed (`utm_source` → `instagram/social`;
  sem origem → `unknown`).
- `funnel-subscription.spec.ts` — 1 **skipped** (requer `DATABASE_URL` e servidor
  local; valida a idempotência via `processed_events`).

Os Cenários 3, 4, 5, 6 e 7 (etapa repetida, reentrega do webhook, falha de
telemetria, leitura no admin e redirecionamento) permanecem **validação manual**
porque exigem banco real e Stripe CLI.

## Próximos passos

1. Aplicar `migrations/008_create_funnel_events.sql` no Neon.
2. Rodar os Cenários 3–7 do quickstart em ambiente com banco e Stripe CLI.
3. Monitorar `unknownSourceShare` no `/admin/funil` (SC-003 tolera até 10%).
