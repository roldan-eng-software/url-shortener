# Data Model: Admin Dashboard

**Date**: 2026-06-30  
**Feature**: Admin Dashboard (004-admin-dashboard)

## Schema Changes

### 1. Tabela `users` - Adicionar campo `isAdmin`

**Migration**: `migrations/004_add_isAdmin.sql`

```sql
-- Adicionar coluna isAdmin à tabela users
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Criar índice para queries de admin
CREATE INDEX idx_users_is_admin ON users(is_admin);

-- Comentário na coluna
COMMENT ON COLUMN users.is_admin IS 'Flag indicando se o usuário é administrador do sistema';
```

**Drizzle Schema** (`lib/db/schema.ts`):

```typescript
// Adicionar à definição da tabela users
export const users = pgTable('users', {
  // ... campos existentes ...
  isAdmin: boolean('is_admin').default(false).notNull(),
  // ... outros campos ...
});
```

### 2. Migration para Primeiro Admin

**Migration**: `migrations/004_set_first_admin.sql`

```sql
-- Definir primeiro admin (substituir pelo email real)
UPDATE users SET is_admin = TRUE WHERE email = 'admin@urlencurta.com.br';

-- Verificar se o usuário existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@urlencurta.com.br') THEN
    RAISE NOTICE 'Usuário admin não encontrado. Crie a conta primeiro.';
  END IF;
END $$;
```

## Entities Estendidas

### User (Extended)

**Tabela**: `users`  
**Mudança**: Adicionar campo `isAdmin`

| Campo                | Tipo         | Default  | Descrição                       |
| -------------------- | ------------ | -------- | ------------------------------- |
| id                   | UUID         | auto     | Primary key                     |
| email                | TEXT         | required | Email único                     |
| passwordHash         | TEXT         | required | Hash da senha                   |
| isPremium            | BOOLEAN      | false    | Usuário premium                 |
| isAdmin              | BOOLEAN      | false    | **NOVO**: Usuário administrador |
| stripeCustomerId     | VARCHAR(100) | null     | ID do cliente Stripe            |
| stripeSubscriptionId | VARCHAR(100) | null     | ID da subscription Stripe       |
| premiumExpiresAt     | TIMESTAMP    | null     | Data de expiração premium       |
| createdAt            | TIMESTAMP    | now      | Data de criação                 |
| updatedAt            | TIMESTAMP    | now      | Data de atualização             |

### DatabaseMetrics (Calculado)

**Não é tabela** - Calculado via queries SQL

```typescript
interface DatabaseMetrics {
  users: number;
  userLinks: number;
  anonLinks: number;
  urls: number;
  marketingLeads: number;
  privacyRequests: number;
  bioPages: number;
  bioLinks: number;
  totalRecords: number;
}
```

**Query SQL**:

```sql
SELECT
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM user_links) as user_links,
  (SELECT COUNT(*) FROM anon_links) as anon_links,
  (SELECT COUNT(*) FROM urls) as urls,
  (SELECT COUNT(*) FROM marketing_leads) as marketing_leads,
  (SELECT COUNT(*) FROM privacy_requests) as privacy_requests,
  (SELECT COUNT(*) FROM bio_pages) as bio_pages,
  (SELECT COUNT(*) FROM bio_links) as bio_links;
```

### PremiumUserStats (Calculado)

**Não é tabela** - Calculado via join de users + Stripe

```typescript
interface PremiumUserStats {
  userId: string;
  email: string;
  isPremium: boolean;
  premiumExpiresAt: Date | null;
  stripeSubscriptionId: string | null;
  paymentStatus: 'active' | 'expired' | 'cancelled' | 'trialing';
  daysUntilExpiry: number | null;
}
```

**Lógica de paymentStatus**:

```typescript
function getPaymentStatus(user: User): PaymentStatus {
  if (!user.isPremium) return 'expired';
  if (!user.premiumExpiresAt) return 'active'; // Sem data = vitalício
  if (user.premiumExpiresAt > new Date()) return 'active';
  return 'expired';
}
```

### PaymentMetrics (Calculado via Stripe)

**Não é tabela** - Calculado via Stripe API

```typescript
interface PaymentMetrics {
  stripeConnected: boolean;
  totalRevenue: number; // Em centavos (R$)
  mrr: number; // Monthly Recurring Revenue em centavos
  activeSubscriptions: number;
  trialSubscriptions: number;
}
```

**Cálculo de MRR**:

```typescript
async function calculateMRR(): Promise<number> {
  const subscriptions = await stripe.subscriptions.list({
    status: 'active',
    limit: 100,
  });

  return subscriptions.data.reduce((total, sub) => {
    const monthlyAmount = sub.items.data[0].plan.amount || 0;
    return total + monthlyAmount;
  }, 0);
}
```

## Queries Otimizadas

### 1. Contagem de Registros (Métricas)

```sql
-- Query única para todas as contagens
SELECT
  (SELECT COUNT(*) FROM users) as users_count,
  (SELECT COUNT(*) FROM user_links) as user_links_count,
  (SELECT COUNT(*) FROM anon_links) as anon_links_count,
  (SELECT COUNT(*) FROM urls) as urls_count,
  (SELECT COUNT(*) FROM marketing_leads) as marketing_leads_count,
  (SELECT COUNT(*) FROM privacy_requests) as privacy_requests_count,
  (SELECT COUNT(*) FROM bio_pages) as bio_pages_count,
  (SELECT COUNT(*) FROM bio_links) as bio_links_count;
```

### 2. Lista de Usuários Premium

```sql
SELECT
  u.id,
  u.email,
  u.is_premium,
  u.premium_expires_at,
  u.stripe_subscription_id,
  u.created_at,
  CASE
    WHEN u.premium_expires_at IS NULL THEN 'active'
    WHEN u.premium_expires_at > NOW() THEN 'active'
    ELSE 'expired'
  END as payment_status
FROM users u
WHERE u.is_premium = TRUE
ORDER BY u.created_at DESC;
```

### 3. Leads com Filtros

```sql
SELECT *
FROM marketing_leads
WHERE ($1::text IS NULL OR status = $1)
  AND ($2::text IS NULL OR interest = $2)
  AND ($3::text IS NULL OR source = $3)
ORDER BY created_at DESC;
```

## Indexes

### Índices Adicionados

```sql
-- Índice para busca de admins
CREATE INDEX idx_users_is_admin ON users(is_admin);

-- Índice para busca de premium users
CREATE INDEX idx_users_is_premium ON users(is_premium);

-- Índice para busca de leads por status
CREATE INDEX idx_marketing_leads_status ON marketing_leads(status);

-- Índice para busca de leads por interesse
CREATE INDEX idx_marketing_leads_interest ON marketing_leads(interest);
```

## Restrições de Integridade

### 1. Admin não pode ser deletado facilmente

```sql
-- Trigger para prevenir deleção do último admin
CREATE OR REPLACE FUNCTION prevent_last_admin_deletion()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_admin = TRUE THEN
    IF (SELECT COUNT(*) FROM users WHERE is_admin = TRUE) <= 1 THEN
      RAISE EXCEPTION 'Não é possível deletar o último administrador';
    END IF;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_last_admin
  BEFORE DELETE ON users
  FOR EACH ROW
  EXECUTE FUNCTION prevent_last_admin_deletion();
```

### 2. Admin não pode remover seu próprio admin

```sql
-- Trigger para prevenir auto-remoção de admin
CREATE OR REPLACE FUNCTION prevent_self_admin_removal()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_admin = TRUE AND NEW.is_admin = FALSE THEN
    IF OLD.email = current_setting('app.current_user_email') THEN
      RAISE EXCEPTION 'Administradores não podem remover seu próprio acesso admin';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_self_admin_removal
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION prevent_self_admin_removal();
```

## Resumo das Mudanças

### Arquivos Afetados

1. **`lib/db/schema.ts`**: Adicionar campo `isAdmin` à tabela users
2. **`migrations/004_add_isAdmin.sql`**: Migration para novo campo
3. **`migrations/004_set_first_admin.sql`**: Migration para primeiro admin
4. **`lib/admin/metrics.ts`**: Queries de métricas (novo)
5. **`lib/admin/clients.ts`**: Queries de clientes (novo)
6. **`lib/admin/payments.ts`**: Cálculos de Stripe (novo)
7. **`lib/admin/leads.ts`**: Queries de leads (novo)

### Compatibilidade

- ✅ Migration é backwards-compatible (DEFAULT FALSE)
- ✅ Não quebra rotas existentes
- ✅ Não afeta fluxo de autenticação atual
- ✅ Campo opcional (não required)

### Rollback

```sql
-- Reverter migration se necessário
ALTER TABLE users DROP COLUMN IF EXISTS is_admin;
DROP INDEX IF EXISTS idx_users_is_admin;
```

## Conclusão

Mudanças mínimas no schema existente. Apenas 1 novo campo na tabela users. Tudo mais é calculado via queries existentes. Compatibilidade total com código atual.
