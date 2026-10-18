# URLEncurta

Encurtador de URLs (MicroSaaS) com fluxo gratuito, camada Premium e
monetização por publicidade. Deploy de produção em https://urlencurta.com.br.

- **Visão do produto:** [`docs/project-overview.md`](docs/project-overview.md)
- **Arquitetura e decisões técnicas:** [`docs/architecture.md`](docs/architecture.md)
- **Índice das specs (Spec Kit):** [`specs/README.md`](specs/README.md)
- **PRD de conversão anônimo → Premium:** [`docs/prd/feature-conversao-e-retencao.md`](docs/prd/feature-conversao-e-retencao.md)

## Stack

| Camada     | Tecnologia                                           |
| ---------- | ---------------------------------------------------- |
| Framework  | Next.js 16 (App Router) + React 19                   |
| Linguagem  | TypeScript 5                                         |
| Estilo     | Tailwind CSS 3                                       |
| Banco      | Neon (PostgreSQL serverless) + Drizzle ORM           |
| Auth       | NextAuth v5 (JWT) + sessão própria assinada por HMAC |
| Pagamentos | Stripe (assinatura Premium)                          |
| Anúncios   | Adsterra (páginas editoriais elegíveis)              |
| QR Code    | `qrcode`                                             |
| Validação  | Zod                                                  |
| Testes E2E | Playwright                                           |
| Hospedagem | Vercel                                               |

## Requisitos

- Node.js 20 ou superior.
- Um banco PostgreSQL (Neon) acessível por `DATABASE_URL`.

## Instalação

```bash
npm install
```

Crie o `.env.local` (veja a seção de variáveis abaixo) e aplique o schema:

```bash
npm run db:push
```

Rode em desenvolvimento:

```bash
npm run dev
```

Acesse http://localhost:3000.

## Variáveis de ambiente

Valores de referência em [`.env.example`](.env.example). Nunca comite valores reais.

| Variável                                   | Obrigatória | Descrição                                                  |
| ------------------------------------------ | ----------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL`                      | Produção    | URL canônica (usada em links curtos, sitemap e metadata).  |
| `DATABASE_URL`                             | Sim         | Connection string PostgreSQL com SSL.                      |
| `AUTH_SECRET` / `NEXTAUTH_SECRET`          | Produção    | Segredo do NextAuth e da sessão HMAC. Dev usa um fallback. |
| `NEXTAUTH_URL`                             | Produção    | URL base do NextAuth.                                      |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`            | Não         | ID do Google Analytics (carregado após consentimento).     |
| `STRIPE_SECRET_KEY`                        | Premium     | Chave secreta do Stripe.                                   |
| `STRIPE_WEBHOOK_SECRET`                    | Premium     | Segredo de assinatura do webhook (`whsec_...`).            |
| `STRIPE_PREMIUM_PRICE_ID`                  | Premium     | Price da assinatura Premium.                               |
| `NEXT_PUBLIC_ADSTERRA_ENABLED`             | Não         | `true` habilita o carregamento de anúncios.                |
| `NEXT_PUBLIC_ADSTERRA_NATIVE_SCRIPT_URL`   | Não         | URL do script do Adsterra.                                 |
| `NEXT_PUBLIC_ADSTERRA_NATIVE_CONTAINER_ID` | Não         | ID do container do Adsterra.                               |

## Scripts

| Comando           | Descrição                         |
| ----------------- | --------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento.      |
| `npm run build`   | Build de produção.                |
| `npm run start`   | Sobe o build de produção.         |
| `npm run lint`    | ESLint.                           |
| `npm run verify`  | `lint` + `build`.                 |
| `npm run db:push` | Aplica o schema Drizzle no banco. |

## Estrutura do projeto

```text
app/                 # Rotas (App Router) e API routes
  [shortCode]/       # Página de preview/redirecionamento e bio pages (@handle)
  admin/             # Dashboard administrativo (isAdmin)
  api/               # Endpoints (urls, redirect, user, bio, admin, stripe, auth...)
  dashboard/         # Painel Premium do usuário
  premium/           # Página de assinatura
  <páginas editoriais>
components/          # Componentes React (inclui Adsterra, CookieBanner, admin/, bio/)
context/             # AuthContext
lib/                 # db, auth, url, validation, rate-limit, cookie-consent, admin/
migrations/          # SQL aplicado manualmente no banco
types/               # Tipos globais e augmentação do NextAuth
specs/               # Specs do Spec Kit (planejamento e histórico)
```

## Autenticação e perfis

- **Anônimo:** encurta e redireciona sem cadastro (tabela `urls`).
- **Usuário Premium:** login, dashboard, alias customizado, QR Code, páginas de bio
  e estatísticas (tabela `user_links`).
- **Admin:** dashboard em `/admin`, restrito a `users.is_admin = true`. O primeiro
  admin é definido manualmente no banco:

  ```sql
  UPDATE users SET is_admin = TRUE WHERE email = 'seu-email@exemplo.com';
  ```

## Monetização

Anúncios do Adsterra são carregados apenas quando todas as condições abaixo são
verdadeiras:

1. `NEXT_PUBLIC_ADSTERRA_ENABLED=true` e script/container configurados.
2. A rota está na lista de páginas monetizáveis (`/`, `/como-funciona` e as
   páginas editoriais de SEO).
3. O visitante aceitou a categoria de cookies de publicidade.

Rotas de API, dashboard, login, registro, premium, preview, páginas legais e
links curtos de usuário **nunca** exibem anúncios.

## LGPD e privacidade

Banner de cookies com granularidade (necessários/analytics/publicidade),
Política de Privacidade, Termos e formulário para exercício de direitos
(tabela `privacy_requests`). Detalhes em [`PLANO_LGPD.md`](PLANO_LGPD.md).

## Deploy

Guia completo em [`DEPLOY_VERCEL.md`](DEPLOY_VERCEL.md) e configuração do Stripe
em [`STRIPE_PRODUCTION.md`](STRIPE_PRODUCTION.md).
