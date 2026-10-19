# Implementation Plan: Instrumentação do Funil Anônimo → Premium

**Branch**: `005-premium-conversion-funnel` | **Date**: 2026-10-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-premium-conversion-funnel/spec.md`

## Summary

Registrar cada etapa do funil anônimo → Premium com origem e tempo, para permitir
calcular taxa de conversão por etapa e por canal. A abordagem é **híbrida e
aditiva**:

- **Passos comportamentais** (resultado visto, oferta Premium vista, criação de
  conta iniciada) continuam no Google Analytics já existente
  (`components/GoogleAnalytics.tsx` → `trackConversionEvent`), sempre atrás do
  consentimento de analytics.
- **Passos financeiros e de conta** (conta criada, trial iniciado, assinatura
  ativa, pagamento falhou, cancelamento) passam a ser registrados **no servidor**,
  em uma tabela própria `funnel_events`, a partir das rotas de cadastro e do
  webhook do Stripe. São esses que garantem SC-005 (< 5% de divergência), porque
  nascem da mesma fonte que o estado de cobrança.
- Um identificador anônimo (cookie de primeira parte, só criado após consentimento)
  permite unir os passos anônimos aos passos da conta no mesmo funil (FR-005).
- A leitura do funil é exposta por um endpoint admin e por uma página em
  `/admin/funnel`.

Nenhuma dependência nova, nenhum fornecedor novo, nenhum impacto no caminho de
redirecionamento.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19
**Primary Dependencies**: Next.js 16 (App Router), Drizzle ORM 0.45 (Neon), NextAuth v5 + sessão HMAC própria (`lib/auth.ts`), Stripe 17.5 (webhook já existente em `app/api/stripe/webhook/route.ts`), Google Analytics via `gtag`
**Storage**: Neon PostgreSQL (serverless) — nova tabela `funnel_events`
**Testing**: Playwright (E2E) — ver `playwright.config.ts`; sem Vitest no projeto
**Target Platform**: Web (Vercel)
**Project Type**: Web application (Next.js monolith)
**Performance Goals**: p95 de redirecionamento inalterado; nenhum script novo no caminho de redirecionamento; escrita de evento < 50ms e fora do caminho crítico
**Constraints**: medição apenas com consentimento (LGPD); minimização de dados (sem IP, sem e-mail, sem URL original no evento); registro de evento nunca pode bloquear ou falhar a ação do usuário; reutilizar Stripe/GA existentes, sem novo fornecedor
**Scale/Scope**: 7 etapas de funil; superfícies instrumentadas: home, `/premium`, `/register`, `/login`, `/dashboard`, `/api/auth/register`, `/api/stripe/webhook`; 1 tabela nova, 1 migration, 1 página admin

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **Free Utility Gate**: ✅ PASS — Nenhuma etapa do fluxo gratuito é alterada. O encurtamento sem cadastro, a cópia e o QR Code continuam idênticos; a feature apenas observa o comportamento já existente.
- **Monetization Surface Gate**: ✅ PASS — Não há anúncio novo nem mudança de elegibilidade. `Adsterra` não é tocado. As rotas de `api`, `dashboard`, `login`, `register`, `checkout`, `premium`, páginas legais, `preview`, redirecionamento e short-code de usuário continuam bloqueadas para anúncio, sem alteração.
- **Organic Growth Gate**: ✅ PASS — Contribui para **retenção** e para o loop de conversão (identifica onde o avanço trava e qual canal converte), sem alterar SEO, compartilhamento, QR Codes ou bio links.
- **Trust and LGPD Gate**: ✅ PASS — Medição só após consentimento de analytics (mesmo `lib/cookie-consent.ts`); dados minimizados (etapa, origem, instante, chave de visitante, `user_id`); sem IP, sem e-mail e sem URL original no evento; retenção proposta de 12 meses alinhada ao `PLANO_LGPD.md`; nenhum fornecedor novo e nenhuma nova categoria de cookie além da de analytics existente.
- **Performance Gate**: ✅ PASS — Nada é adicionado ao caminho de redirecionamento; a feature adiciona apenas um insert leve no servidor (cadastro/webhook), fora do hot path; scripts client-side existentes seguem em `afterInteractive` e sob consentimento.

### Reavaliação pós-design (Fase 1)

Após o desenho de `research.md`, `data-model.md` e `contracts/`, o resultado dos
gates **não mudou** (todos PASS):

- O modelo (`funnel_events`) não toca rotas de anúncio nem o fluxo gratuito.
- O contrato de eventos confirma "consentimento primeiro", sem PII, com fallback
  `unknown` — reforça os gates Trust/LGPD e Organic Growth.
- O contrato de leitura expõe apenas agregados e exige `is_admin` — sem nova
  superfície pública e sem peso no redirecionamento.
- Não surgiu nenhuma dependência nova nem violação a mitigar, portanto o
  **Complexity Tracking** permanece vazio.

## Evidências de validação (Fase 2 — T007 / T008)

Verificado no código em 2026-10-18 (commit base `5714e0e` + mudanças desta feature).

### T007 — Monetization Surface Gate

- `components/Adsterra.tsx` implementa a gate por **allowlist**: `canShowAdsterraAds`
  só retorna `true` para `MONETIZABLE_AD_PATHS = ['/', '/como-funciona',
'/boas-praticas-url-curta', '/links-para-whatsapp', '/qr-code-para-links',
'/seguranca-em-links-curtos']`, e ainda exige `NEXT_PUBLIC_ADSTERRA_ENABLED === 'true'`,
  consentimento de `ads` e script/container configurados.
- Bloqueios explícitos mantidos: `DISALLOWED_AD_PREFIXES = ['/api', '/dashboard',
'/login', '/premium', '/preview', '/register']` e
  `DISALLOWED_AD_PATHS = ['/termos', '/privacidade']`.
- Redirecionamento/short-code de usuário continuam inelegíveis via
  `isShortCodePath()` (qualquer caminho de um único segmento fora da allowlist).
- Esta feature **não altera** `components/Adsterra.tsx` nem a allowlist. A nova
  rota `/admin/funnel` é administrada pela allowlist (não está em
  `MONETIZABLE_AD_PATHS`), portanto permanece **bloqueada** — a elegibilidade não
  muda para nenhuma rota.
- **PASS**

### T008 — Trust / LGPD Gate

- Nenhum evento de cliente é enviado sem consentimento: `trackFunnelStep` retorna
  cedo quando `getStoredCookieConsent()?.analytics` é falso, e `trackConversionEvent`
  repete a verificação antes de chamar `gtag`.
- O cookie `urlshortener_visitor` (`lib/analytics/visitor.ts`) só é criado/lido
  quando `hasCookieConsent('analytics')` é verdadeiro; é um UUID opaco, sem PII.
- `metadata` é sanitizado em `lib/analytics/funnel.ts` (`sanitizeMetadata`): apenas
  `string | number | boolean`; nenhum campo de e-mail, IP ou URL original existe no
  modelo (`data-model.md`).
- Retenção proposta de 12 meses para eventos de funil, alinhada ao
  `PLANO_LGPD.md` (que define prazos por tipo de dado; leads = 24 meses).
- Nenhum fornecedor novo: reusa Google Analytics (já presente) e Stripe (webhook já
  existente).
- **PASS**

## Project Structure

### Documentation (this feature)

```text
specs/005-premium-conversion-funnel/
├── plan.md              # Este arquivo
├── spec.md              # Especificação da feature
├── research.md          # Fase 0 — decisões técnicas
├── data-model.md        # Fase 1 — modelo de dados
├── quickstart.md        # Fase 1 — guia de validação
├── contracts/           # Fase 1 — contratos de interface
│   ├── analytics-events.md
│   └── funnel-metrics.openapi.yaml
└── tasks.md             # Fase 2 — gerado por /speckit-tasks (não criado aqui)
```

### Source Code (repository root)

```text
app/
├── api/
│   ├── admin/
│   │   └── funnel/
│   │       └── route.ts        # GET: agregados do funil (protegido por is_admin)
│   ├── auth/
│   │   └── register/route.ts   # MODIFICAR: registrar evento account_created
│   └── stripe/
│       └── webhook/route.ts    # MODIFICAR: registrar trial/ativo/falha/cancelado
├── admin/
│   └── funnel/
│       └── page.tsx            # NOVA: visualização do funil (reusa AdminSidebar)
├── premium/page.tsx            # MODIFICAR: evento de oferta vista + origem no checkout
├── register/page.tsx           # MODIFICAR: evento account_creation_started
└── dashboard/page.tsx          # MODIFICAR (opcional): evento de oferta vista no upsell

components/
├── GoogleAnalytics.tsx         # MODIFICAR: helper de evento de funil consent-gated
├── HomeRedesign.tsx            # MODIFICAR: evento de oferta vista na faixa de conversão
└── admin/
    └── FunnelChart.tsx         # NOVA: componentes de leitura do funil

lib/
├── analytics/
│   ├── funnel.ts               # NOVO: nomes canônicos das etapas + envio server-side
│   ├── visitor.ts              # NOVO: cookie/identificador anônimo + atribuição de origem
│   └── consent.ts              # NOVO: leitura de consentimento no cliente (wrapper)
└── db/schema.ts                # MODIFICAR: tabela funnelEvents

migrations/
└── 006_create_funnel_events.sql  # NOVA
```

**Structure Decision**: Estrutura integrada ao monolith Next.js existente (App
Router), seguindo o mesmo padrão da spec 004: página em `app/admin/**`, endpoint em
`app/api/admin/**`, componentes em `components/admin/**` e lógica em `lib/**`. A
instrumentação do cliente reusa `components/GoogleAnalytics.tsx` (não cria script
novo); a instrumentação autoritativa vive no servidor (`lib/analytics/funnel.ts`),
chamada pelas rotas de cadastro e do webhook do Stripe. Não há `middleware.ts` novo:
o endpoint admin segue o padrão já existente (verificação de `is_admin` na própria
rota, como em `app/api/admin/*`).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Nenhuma violação identificada. A feature é aditiva, sem dependência nova, e usa
apenas infraestrutura já presente (GA, Stripe, Drizzle/Neon, consentimento).

## Implementation Strategy

### Fase 1: Fundação de dados e identidade

- Migration `006_create_funnel_events.sql` (tabela, índices e chave de deduplicação).
- `lib/db/schema.ts`: entidade `funnelEvents` + tipos.
- `lib/analytics/funnel.ts`: enum canônico das etapas + função de registro
  server-side (fire-and-forget, tolerante a falha).
- `lib/analytics/visitor.ts`: identificador anônimo e captura de origem/canal,
  sempre sob consentimento de analytics.

### Fase 2: Passos do cliente (comportamentais)

- `components/GoogleAnalytics.tsx`: helper `trackFunnelStep` reusando
  `trackConversionEvent`, com consentimento.
- Instrumentar "resultado visto", "oferta Premium vista" (home, `/premium`,
  upsell do dashboard) e "criação de conta iniciada".

### Fase 3: Passos do servidor (conta e cobrança)

- `app/api/auth/register/route.ts`: registrar `account_created` com `user_id` e a
  chave anônima recebida, unindo a jornada (FR-005).
- `app/api/stripe/webhook/route.ts`: mapear os eventos já tratados para etapas do
  funil (trial iniciado, assinatura ativa, pagamento falhou, cancelamento),
  reusando a idempotência de `processed_events`.

### Fase 4: Leitura do funil

- `app/api/admin/funnel/route.ts`: agregados por período e por etapa/origem.
- `app/admin/funnel/page.tsx` + `components/admin/FunnelChart.tsx`: visualização.
- Link no `AdminSidebar`.

### Fase 5: Verificação e limpeza

- Testes E2E Playwright (jornada completa e caso sem consentimento).
- Verificação de que nenhum evento é enviado sem consentimento.
- Confirmação de que o caminho de redirecionamento não ganhou peso.

## Risk Assessment

| Risco                                        | Impacto | Mitigação                                                           |
| -------------------------------------------- | ------- | ------------------------------------------------------------------- |
| Eventos de GA bloqueados por ad blocker      | Médio   | Passos financeiros são registrados no servidor (fonte autoritativa) |
| Divergência entre funil e Stripe             | Médio   | Etapas de cobrança nascem do mesmo webhook que atualiza o estado    |
| Evento duplicado inflando o funil            | Médio   | Chave de deduplicação única por visitante + etapa                   |
| Vazamento de dado pessoal                    | Alto    | Minimização: sem IP, e-mail ou URL original no evento               |
| Registro de evento quebrar a ação do usuário | Alto    | Todo registro é fire-and-forget com try/catch                       |
| Cookie de visitante sem consentimento        | Alto    | Cookie só é criado após consentimento de analytics                  |
| Peso novo no caminho de redirecionamento     | Médio   | Nenhum script novo; rota de short-code intocada                     |

## Mapa evento Stripe → etapa do funil (T027)

Referência de manutenção. Todos os registros acontecem **após** o guard de
idempotência de `processed_events`, em `app/api/stripe/webhook/route.ts`.

| Evento Stripe                          | Condição                           | Etapa registrada                | Sufixo de dedupe  |
| -------------------------------------- | ---------------------------------- | ------------------------------- | ----------------- |
| `checkout.session.completed`           | `subscription.trial_end` no futuro | `trial_started`                 | — (1 por usuário) |
| `checkout.session.completed`           | sem trial ativo                    | `subscription_active`           | —                 |
| `customer.subscription.updated`        | `status = trialing`                | `trial_started`                 | —                 |
| `customer.subscription.updated`        | `status = active`                  | `subscription_active`           | —                 |
| `customer.subscription.updated`        | `status = past_due` ou `unpaid`    | `payment_failed`                | `event.id`        |
| `customer.subscription.deleted`        | sempre                             | `subscription_canceled`         | `event.id`        |
| `invoice.payment_failed`               | sempre (com usuário encontrado)    | `payment_failed`                | `event.id`        |
| `customer.subscription.trial_will_end` | —                                  | _não mapeado_ (apenas lembrete) | —                 |

`source`, `visitorId` e `cycle` vêm dos metadados da assinatura, gravados pelo
checkout em `app/api/stripe/checkout/route.ts` (ver T021). Quando ausentes, a
origem é registrada como `unknown` (FR-003).

Etapas que podem se repetir legitimamente ao longo do tempo
(`payment_failed`, `subscription_canceled`) usam `event.id` como sufixo da chave
de deduplicação — evitando tanto a duplicação em reentrega quanto o colapso de
ocorrências distintas.

## Next Steps

1. Rodar `/speckit-tasks` para gerar `tasks.md` a partir deste plano.
2. Implementar Fase 1 (migration + `lib/analytics/*`).
3. Implementar Fases 2–3 (instrumentação cliente e servidor).
4. Implementar Fase 4 (leitura admin).
5. Validar com `quickstart.md` e Playwright.
