# Contract: Taxonomia de Eventos do Funil

**Date**: 2026-10-18
**Feature**: Instrumentação do Funil Anônimo → Premium (005-premium-conversion-funnel)

Este contrato define **o que** cada superfície emite e **onde** cada evento nasce.
É o acordo entre o cliente, o servidor e o consumidor dos dados (admin).

## Regras gerais

1. **Consentimento primeiro**: nenhum evento é emitido antes de
   `getStoredCookieConsent()?.analytics === true`. Vale para eventos de cliente.
2. **Nunca bloquear**: emitir evento nunca pode interromper, atrasar ou falhar a
   ação do usuário (FR-008).
3. **Nome canônico**: `step` sempre pertencente ao enum abaixo; valor fora do enum é
   rejeitado na escrita server-side.
4. **Sem PII**: nenhum evento carrega e-mail, IP, URL original ou texto do usuário
   (FR-009).
5. **Origem sempre presente**: quando não identificável, `source = "unknown"`
   (nunca omitir, FR-003).
6. **Deduplicação**: eventos server-side usam `dedupe_key` único; reentrega não
   duplica (FR-006, FR-007).

## Enum canônico de `step`

| `step`                     | Canal        | Superfície emissora                                                             | Payload permitido         |
| -------------------------- | ------------ | ------------------------------------------------------------------------------- | ------------------------- |
| `result_viewed`            | Cliente (GA) | `components/UrlForm.tsx` (sucesso do encurtamento)                              | `source`                  |
| `offer_viewed`             | Cliente (GA) | `components/HomeRedesign.tsx`, `app/premium/page.tsx`, `app/dashboard/page.tsx` | `source`, `surface`       |
| `account_creation_started` | Cliente (GA) | `app/register/page.tsx`                                                         | `source`                  |
| `account_created`          | Servidor     | `app/api/auth/register/route.ts`                                                | `source`, `visitor_id`    |
| `trial_started`            | Servidor     | `app/api/stripe/webhook/route.ts`                                               | `source`, `cycle`         |
| `subscription_active`      | Servidor     | `app/api/stripe/webhook/route.ts`                                               | `source`, `cycle`, `plan` |
| `payment_failed`           | Servidor     | `app/api/stripe/webhook/route.ts`                                               | `plan`                    |
| `subscription_canceled`    | Servidor     | `app/api/stripe/webhook/route.ts`                                               | `plan`, `reason?`         |

`surface` ∈ `home | premium_page | dashboard_upsell`. `cycle` ∈ `monthly | annual`.

## Contrato do cliente

O cliente reusa o helper existente e **não** cria script novo:

```ts
// components/GoogleAnalytics.tsx (estendido)
trackConversionEvent(step, { source, ...extras });
```

Garantias:

- Se `analytics` não estiver consentido → no-op (nenhuma chamada a `gtag`).
- Se `window.gtag` não existir (script bloqueado) → no-op silencioso.
- Chamada síncrona e leve, segura dentro de handlers de clique.

## Contrato do servidor

```ts
// lib/analytics/funnel.ts
recordFunnelStep({
  step: FunnelStep,
  source?: string | null,
  visitorId?: string | null,
  userId?: string | null,
  metadata?: Record<string, string | number | boolean>,
}): Promise<void>
```

Garantias:

- Deriva `dedupe_key` internamente (nunca aceita do cliente).
- Normaliza `source` ausente para `"unknown"`.
- `try/catch` total: falha apenas é logada; nunca propaga (FR-008).
- `ON CONFLICT (dedupe_key) DO NOTHING` (FR-006).

### Propagação do visitante anônimo

Requisitos `POST` que criam conta ou iniciam checkout MUST aceitar o identificador
anônimo (corpo: `visitorId`) para viabilizar a costura anônimo → conta (FR-005).
O identificador é opaco e só existe após consentimento.

## Contrato do consumidor (admin)

O consumidor lê apenas agregados, nunca o evento bruto com identidade. Ver
[`funnel-metrics.openapi.yaml`](./funnel-metrics.openapi.yaml).

## Critérios de conformidade

- [ ] Nenhuma chamada a `gtag` ocorre sem consentimento de analytics.
- [ ] Todo `step` emitido pertence ao enum canônico.
- [ ] Todo evento tem `source` (real ou `unknown`).
- [ ] Nenhum payload contém e-mail, IP ou URL original.
- [ ] Reentrega do mesmo evento Stripe não cria segunda linha.
- [ ] Nenhum endpoint do caminho de redirecionamento foi alterado.
