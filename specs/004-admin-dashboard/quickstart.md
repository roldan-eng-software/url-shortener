# Quickstart: Admin Dashboard

**Date**: 2026-06-30  
**Feature**: Admin Dashboard (004-admin-dashboard)

## Pré-requisitos

- Node.js 18+ instalado
- Acesso ao banco Neon PostgreSQL
- Chaves Stripe configuradas
- Conta de administrador criada

## Setup em 5 Passos

### 1. Executar Migration do Banco

```bash
# Conectar ao Neon e executar migration
# (ou usar o console do Neon)

# Adicionar campo isAdmin
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

# Criar índice
CREATE INDEX idx_users_is_admin ON users(is_admin);

# Definir primeiro admin (substituir pelo seu email)
UPDATE users SET is_admin = TRUE WHERE email = 'seu-email@exemplo.com';
```

### 2. Atualizar Schema do Drizzle

```bash
# O schema já está atualizado em lib/db/schema.ts
# Campo isAdmin foi adicionado

# Gerar migration se necessário
npx drizzle-kit generate
```

### 3. Iniciar Desenvolvimento

```bash
# Instalar dependências (já instaladas)
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

### 4. Acessar Dashboard Admin

```
http://localhost:3000/admin
```

**Fluxo de Autenticação**:

1. Faça login com conta de admin
2. Sistema verifica campo `isAdmin`
3. Se `true`, acesso liberado
4. Se `false`, redireciona para `/dashboard`

### 5. Verificar Funcionalidades

#### Métricas do Banco

- Acesse `/admin`
- Verifique cards com contagem de registros
- Dados devem aparecer em menos de 3 segundos

#### Clientes Premium

- Acesse `/admin/clients`
- Lista de usuários premium deve aparecer
- Botão WhatsApp deve abrir nova aba

#### Status Pagamentos

- Acesse `/admin/payments`
- Status Stripe deve mostrar "Conectado"
- MRR deve ser exibido

#### Gestão de Leads

- Acesse `/admin/leads`
- Lista de leads deve aparecer
- Filtros devem funcionar

## Estrutura de Arquivos

```
app/admin/
├── layout.tsx           # Layout com sidebar
├── page.tsx             # Dashboard principal
├── clients/
│   └── page.tsx         # Clientes premium
├── payments/
│   └── page.tsx         # Status pagamentos
└── leads/
    └── page.tsx         # Gestão de leads

app/api/admin/
├── metrics/
│   └── route.ts         # Métricas banco
├── clients/
│   └── route.ts         # Lista clientes
├── payments/
│   └── route.ts         # Status Stripe
└── leads/
    └── route.ts         # Gestão leads

components/admin/
├── AdminSidebar.tsx     # Sidebar navegação
├── MetricsCard.tsx      # Card de métricas
├── ClientsTable.tsx     # Tabela clientes
├── WhatsAppButton.tsx   # Botão WhatsApp
├── PaymentStatus.tsx    # Status Stripe
├── LeadsTable.tsx       # Tabela leads
└── AdminGuard.tsx       # Proteção de rota

lib/admin/
├── auth.ts              # Verificação admin
├── metrics.ts           # Queries métricas
├── stripe.ts            # Cálculos Stripe
└── whatsapp.ts          # Utilitário WhatsApp
```

## Comandos Úteis

```bash
# Rodar lint
npm run lint

# Rodar build
npm run build

# Rodar testes (se existirem)
npm test

# Verificar tipos TypeScript
npx tsc --noEmit
```

## Troubleshooting

### Problema: "Acesso Negado" ao acessar /admin

**Causa**: Usuário não tem `isAdmin = true`

**Solução**:

```sql
-- Verificar se usuário é admin
SELECT email, is_admin FROM users WHERE email = 'seu-email@exemplo.com';

-- Tornar usuário admin
UPDATE users SET is_admin = TRUE WHERE email = 'seu-email@exemplo.com';
```

### Problema: Métricas não carregam

**Causa**: Erro de conexão com banco

**Solução**:

1. Verificar se `DATABASE_URL` está configurada
2. Testar conexão com Neon
3. Verificar logs do servidor

### Problema: Status Stripe mostra "Desconectado"

**Causa**: Chaves Stripe não configuradas

**Solução**:

1. Verificar variáveis de ambiente:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
2. Reiniciar servidor após configurar

### Problema: WhatsApp não abre

**Causa**: Número de telefone não está no banco

**Solução**:

1. Verificar se telefone está preenchido no lead
2. Formato deve ser: `5511999999999` (código país + DDD + número)

## Próximos Passos

1. ✅ Setup básico completo
2. 🔧 Implementar according to tasks.md
3. 🧪 Testar cada funcionalidade
4. 🚀 Deploy para produção

## Contato

Em caso de problemas, consulte:

- Documentação do projeto: `README.md`
- Especificação: `specs/004-admin-dashboard/spec.md`
- Plano de implementação: `specs/004-admin-dashboard/plan.md`
