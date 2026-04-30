# Deploy no Vercel

## Checklist rápido

1. Instale e autentique a CLI:

```bash
npx vercel login
```

2. Vincule este repositório ao projeto Vercel:

```bash
npx vercel link
```

3. Configure as variáveis em Project Settings > Environment Variables:

```text
NEXT_PUBLIC_APP_URL=https://urlencurta.com.br
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
AUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_SECRET=<mesmo valor do AUTH_SECRET>
NEXTAUTH_URL=https://urlencurta.com.br
DATABASE_URL=<postgres ssl connection string>
STRIPE_SECRET_KEY=<stripe secret key>
STRIPE_WEBHOOK_SECRET=<stripe webhook secret>
STRIPE_PREMIUM_PRICE_ID=<stripe price id>
```

4. Puxe as variáveis para desenvolvimento local:

```bash
npx vercel env pull .env.local --yes
```

5. Rode a validação local:

```bash
npm run lint
npm run build
```

6. Aplique o schema do banco quando `DATABASE_URL` estiver configurado:

```bash
npm run db:push
```

7. Deploy direto para produção:

```bash
npx vercel --prod
```

## Quando GitHub não sincronizar

Use a CLI para publicar sem depender da integração GitHub:

```bash
npx vercel --prod
```

Depois confira o deployment no painel da Vercel e valide:

```text
https://urlencurta.com.br
https://urlencurta.com.br/robots.txt
https://urlencurta.com.br/sitemap.xml
```

## Webhook Stripe

No painel da Stripe, aponte o webhook para:

```text
https://urlencurta.com.br/api/stripe/webhook
```

Eventos necessários:

```text
checkout.session.completed
customer.subscription.updated
customer.subscription.deleted
```

Copie o Signing secret para `STRIPE_WEBHOOK_SECRET` no Vercel.
