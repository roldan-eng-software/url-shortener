# Arquitetura — URLEncurta

_Última atualização: 2026-10-18_

Documento de arquitetura derivado do código atual. Para a visão de produto, veja
[`project-overview.md`](project-overview.md).

## Stack e decisões

| Área       | Decisão                                           | Onde                                        |
| ---------- | ------------------------------------------------- | ------------------------------------------- |
| Framework  | Next.js 16, App Router                            | `app/`                                      |
| UI         | React 19 + Tailwind CSS 3                         | `components/`, `app/globals.css`            |
| Banco      | Neon PostgreSQL serverless                        | `DATABASE_URL`                              |
| ORM        | Drizzle (`drizzle-orm/neon-http`)                 | `lib/db.ts`, `lib/db/schema.ts`             |
| Auth       | NextAuth v5 (JWT) + cookie de sessão HMAC próprio | `auth.ts`, `lib/auth.ts`                    |
| Pagamentos | Stripe (checkout + webhook)                       | `app/api/stripe/*`                          |
| Anúncios   | Adsterra (client-side, gated)                     | `components/Adsterra.tsx`                   |
| Validação  | Zod                                               | `lib/validation.ts`                         |
| Testes E2E | Playwright                                        | `playwright.config.ts`, `testsprite_tests/` |
| Deploy     | Vercel                                            | `vercel.json`                               |

Alias de import: `@/*` aponta para a raiz do repositório (`tsconfig.json`).

## Camadas

```text
app/            Rotas e API routes (Server/Client Components)
components/     UI reutilizável (inclui admin/, bio/, dashboard/)
lib/            Regras de negócio e acesso a dados
  db.ts         Conexão Drizzle (singleton)
  db/schema.ts  Definição das tabelas
  data/links.ts Consultas e incremento de cliques
  auth.ts       Sessão HMAC + leitura de usuário autenticado
  admin/        Verificação de papel admin
  analytics/    Instrumentação do funil (funnel.ts, visitor.ts)
context/        AuthContext (estado de sessão no client)
types/          Tipos globais e augmentação do NextAuth
migrations/     SQL aplicado manualmente no banco
```

O `lib/` concentra o acesso a dados; componentes não importam o banco
diretamente.

## Modelo de dados

`lib/db/schema.ts` define:

| Tabela                    | Uso                                                                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `users`                   | Contas, hash de senha, flags `is_premium`/`is_admin`, IDs Stripe.                                                                                              |
| `user_links`              | Links de usuários logados; métricas (`clicks_total`, `clicks_geo`, `clicks_device`, `clicks_referrers`), QR Code, alias.                                       |
| `urls`                    | Links anônimos (fluxo gratuito).                                                                                                                               |
| `anon_links`              | Tabela legada de links anônimos.                                                                                                                               |
| `marketing_leads`         | Leads comerciais capturados na home.                                                                                                                           |
| `privacy_requests`        | Solicitações de direitos LGPD.                                                                                                                                 |
| `bio_pages` / `bio_links` | Páginas de bio (mini Linktree) e seus links.                                                                                                                   |
| `processed_events`        | Idempotência de eventos do webhook Stripe.                                                                                                                     |
| `funnel_events`           | Etapas do funil anônimo → Premium (`step`, `source`, `visitor_id`, `user_id`, `dedupe_key`, `metadata`). Chave única em `dedupe_key` evita contagem duplicada. |

## Fluxos principais

### Criação de link (`POST /api/urls`)

1. Valida o corpo com Zod (`createUrlSchema`).
2. Resolve o usuário autenticado (se houver).
3. Código customizado exige Premium e passa por `isValidShortCode`
   (comprimento, formato, hífens e lista de palavras reservadas).
4. Sem customização, gera um código com nanoid e verifica colisão.
5. Premium salva em `user_links` (com QR Code); anônimo salva em `urls`.

### Redirecionamento (`app/[shortCode]/page.tsx`)

1. Client Component lê o `shortCode` da rota.
2. Chama `POST /api/redirect/[shortCode]`, que incrementa o clique via
   `lib/data/links.ts` e devolve a URL original (ou 404/410).
3. Exibe o preview com contador e redireciona, ou renderiza a bio quando o
   código começa com `@`.

### Sessão (`lib/auth.ts`)

- `session`: cookie httpOnly assinado (`userId.hmac`) com `AUTH_SECRET`.
- `authjs.session-token` (NextAuth): validado via `auth()` quando presente.
- `getAuthUserFromRequest` unifica os dois e carrega o usuário do banco.
- `isPremium` é calculado considerando `premiumExpiresAt`.

### Admin (`lib/admin/`)

- `getAdminUserFromRequest` carrega o usuário e exige `is_admin`.
- `lib/admin/middleware.ts` encapsula respostas 401/403 e helpers de rota.
- As páginas em `app/admin/` fazem verificação no client via
  `/api/auth/check-premium`; os endpoints em `/api/admin/*` revalidam o papel no
  servidor.

### Stripe (`app/api/stripe/`)

- `checkout/route.ts` cria a sessão de assinatura com `metadata.userId` e, desde a
  spec 005, também `metadata.source`/`metadata.visitorId` (vínculo do funil).
- `webhook/route.ts` verifica assinatura, garante idempotência por
  `event.id` (`processed_events`) e atualiza `is_premium`/`premium_expires_at`.
- Eventos tratados: `checkout.session.completed`,
  `customer.subscription.updated`, `customer.subscription.deleted`,
  `invoice.payment_failed`, `customer.subscription.trial_will_end`.
- Cada evento também registra a etapa de funil correspondente via
  `lib/analytics/funnel.ts` (mapa completo em
  `specs/005-premium-conversion-funnel/plan.md`).

### Funil anônimo → Premium (`lib/analytics/`, spec 005)

- `lib/analytics/funnel.ts` define o enum canônico das etapas e
  `recordFunnelStep()`: deriva `dedupe_key` no servidor, normaliza origem ausente
  para `unknown`, usa `ON CONFLICT DO NOTHING` e nunca propaga erro.
- `lib/analytics/visitor.ts` (client) mantém o cookie de primeira parte
  `urlshortener_visitor` e a atribuição de primeiro toque (`utm_*`/referrer),
  **somente** com consentimento de analytics.
- `components/GoogleAnalytics.tsx` expõe `trackFunnelStep()`, que injeta origem e
  visitante nos eventos de cliente (no-op sem consentimento).
- Leitura: `GET /api/admin/funnel` (protegido por `is_admin`) e página
  `app/admin/funnel` (`components/admin/FunnelChart.tsx`), com taxas de conversão
  por etapa e visão por origem.

### Retenção dos eventos de funil

- Eventos em `funnel_events` são retidos por **12 meses** e não guardam PII
  (sem e-mail, IP ou URL original). Alinhado ao `PLANO_LGPD.md`, que define prazos
  por tipo de dado (leads: 24 meses).
- **Pendência operacional**: não há rotina automática de expurgo por tipo de dado
  (item aberto no `PLANO_LGPD.md`). O expurgo dos eventos de funil deve ser
  incluído nessa rotina quando ela for implementada.

## Gating de anúncios e consentimento

- `components/Adsterra.tsx` classifica a rota: só monetiza caminhos em
  `MONETIZABLE_AD_PATHS` e bloqueia `/api`, `/dashboard`, `/login`,
  `/premium`, `/preview`, `/register`, páginas legais e qualquer link curto.
  A allowlist também bloqueia rotas não listadas, como `/admin` e `/admin/funnel`.
- `lib/cookie-consent.ts` guarda preferências no localStorage
  (chave `urlencurta_cookie_preferences_v1`) e emite o evento
  `urlencurtaCookieConsentUpdated`; o anúncio só carrega se `ads` estiver ativo.
- `components/GoogleAnalytics.tsx` segue o mesmo modelo para `analytics`.

## Configuração e segurança

- `next.config.mjs` define headers de segurança (CSP não, mas `X-Frame-Options`,
  `nosniff`, `Referrer-Policy`, `Permissions-Policy`) e desativa o header
  `X-Powered-By`.
- `app/robots.ts` desautoriza `/api/`, `/dashboard`, `/login`, `/premium/success`,
  `/preview/` e `/register`.
- `app/sitemap.ts` lista a home, páginas editoriais e páginas legais.
- `lib/rate-limit.ts` implementa rate limit em memória por IP (10 req/min).

## Variáveis de ambiente (lidas pelo código)

`NEXT_PUBLIC_APP_URL`, `DATABASE_URL`, `AUTH_SECRET`/`NEXTAUTH_SECRET`,
`NEXT_PUBLIC_GA_MEASUREMENT_ID`, `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, `STRIPE_PREMIUM_PRICE_ID`,
`NEXT_PUBLIC_ADSTERRA_ENABLED`, `NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_URL`,
`NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID`.

## Notas e divergências conhecidas

- Não existe `middleware.ts` na raiz: a proteção de `/admin` depende do layout
  client-side e da revalidação nos endpoints.
- `app/robots.ts` não desautoriza `/admin`.
- `lib/admin/plan`/`metrics.ts`/`stripe.ts`/`whatsapp.ts` citados em
  `specs/004` não existem; as queries admin ficam nos próprios route handlers.
- O `.env.example` lista `NEXT_PUBLIC_ADSTERRA_NATIVE_KEY`, mas o componente lê
  `NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID`.
