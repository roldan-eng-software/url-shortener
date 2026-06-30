# Stripe Production Setup - URLEncurta

## Checklist de Configuração

### 1. Stripe Dashboard (Manual)

- [ ] Acessar [Stripe Dashboard](https://dashboard.stripe.com) em **Live Mode**
- [ ] Criar **Produto**: "URLEncurta Premium"
- [ ] Criar **Price**: R$ 29,90/mês (recurring, monthly)
- [ ] Copiar o **Price ID** (`price_...`)
- [ ] Configurar **Webhook Endpoint**:
  - URL: `https://urlencurta.com.br/api/stripe/webhook`
  - Eventos:
    - `checkout.session.completed`
    - `customer.subscription.updated`
    - `customer.subscription.deleted`
    - `invoice.payment_failed`
    - `trial_will_end`
- [ ] Copiar o **Webhook Signing Secret** (`whsec_...`)
- [ ] Copiar a **Live API Key** (`sk_live_...`)
- [ ] Verificar domínio em Settings > Business settings > Branding

### 2. Variáveis de Ambiente (Vercel)

Adicionar no Vercel Dashboard > Settings > Environment Variables:

| Variável | Valor | Ambiente |
|----------|-------|----------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Production |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Production |
| `STRIPE_PREMIUM_PRICE_ID` | `price_...` | Production |

### 3. Migration do Banco

Executar a migration 006 no Neon:

```sql
-- Conectar ao Neon Dashboard e executar:
CREATE TABLE IF NOT EXISTS processed_events (
  id varchar(100) PRIMARY KEY,
  processed_at timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_processed_events_processed_at ON processed_events(processed_at);
```

Ou via CLI:
```bash
# Se usando Drizzle Kit
npx drizzle-kit push
```

### 4. Definir Primeiro Admin

```sql
-- Conectar ao Neon e executar:
UPDATE users SET is_admin = TRUE WHERE email = 'seu-email@exemplo.com';
```

### 5. Validações Pós-Deploy

1. **Verificar webhook no Stripe Dashboard**
   - Acesse Developers > Webhooks > seu endpoint
   - Envie um teste de webhook
   - Verifique se retorna 200

2. **Testar checkout**
   - Acesse `/premium`
   - Clique em "Começar 7 Dias Grátis"
   - Use cartão de teste: `4242 4242 4242 4242`
   - Verifique se redireciona para `/premium/success`

3. **Verificar webhook real**
   - No Stripe Dashboard, acesse Developers > Webhooks
   - Clique no evento `checkout.session.completed`
   - Verifique se o body contém os dados corretos
   - Verifique os logs no Vercel

4. **Testar cancelamento**
   - Acesse o Stripe Dashboard como customer
   - Cancele a subscription
   - Verifique se `isPremium` volta para `false`

5. **Verificar trial**
   - Crie uma nova subscription com trial
   - Aguarde 7 dias (ou use Stripe CLI para simular)
   - Verifique se `trial_will_end` é registrado nos logs

### 6. Monitoramento

- **Logs Vercel**: `Functions > logs` - Buscar por `[Stripe]`
- **Stripe Dashboard**: Developers > Webhooks > Events
- **Banco de dados**: Tabela `processed_events` para verificar eventos processados

### 7. Troubleshooting

#### Problema: Webhook retorna 400
- Verifique se `STRIPE_WEBHOOK_SECRET` está correto
- Verifique se o body não está sendo modificado por proxy

#### Problema: Premium não é ativado
- Verifique os logs no Vercel para erros
- Verifique se `metadata.userId` está correto no checkout
- Verifique se a migration 006 foi executada

#### Problema: `STRIPE_PREMIUM_PRICE_ID` não configurado
- Verifique se a variável está definida no Vercel
- Verifique se não está usando o fallback inválido

### 8. Segurança

- ✅ Webhook signature verification (HMAC)
- ✅ Idempotência via tabela `processed_events`
- ✅ Validação de `metadata.userId` contra customer
- ✅ Fail-fast para env vars obrigatórias
- ✅ CSRF protection no checkout

### 9. Custos Stripe

- **Taxa por transação**: 3,99% + R$ 0,39
- **Exemplo**: R$ 29,90/mês → R$ 1,59 de taxa → R$ 28,31 líquidos
- **Sem custo mensal**: Stripe cobra apenas por transação

### 10. Próximos Passos

- [ ] Configurar emails transacionais (opcional)
- [ ] Adicionar portal do customer (Stripe Customer Portal)
- [ ] Implementar upgrade/downgrade de planos
- [ ] Adicionar cupons de desconto
