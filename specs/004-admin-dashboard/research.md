# Research: Admin Dashboard

**Date**: 2026-06-30  
**Feature**: Admin Dashboard (004-admin-dashboard)

## Tech Stack Analysis

### 1. Framework: Next.js 16 (App Router)

**Status**: ✅ Já utilizado no projeto

**Vantagens para Admin Dashboard**:
- Server Components para carregamento inicial rápido de dados
- API Routes integradas para endpoints admin
- Middleware para proteção de rotas
- File-based routing para organizar seções do dashboard

**Decisão**: Usar App Router existente. Rotas admin em `app/admin/`.

### 2. ORM: Drizzle ORM 0.45

**Status**: ✅ Já utilizado no projeto

**Queries Necessárias**:
- `COUNT()` para métricas de tabelas
- `SELECT` com filtros para listagem de clientes
- `JOIN` entre users e dados de subscription

**Decisão**: Manter Drizzle. Criar queries otimizadas em `lib/admin/metrics.ts`.

### 3. Database: Neon PostgreSQL

**Status**: ✅ Já utilizado no projeto

**Considerações**:
- Serverless = conexões efêmeras
- Queries de contagem são leves e rápidas
- Não há necessidade de cache externo (Redis) para MVP

**Decisão**: Usar Neon diretamente. Adicionar cache em memória (TTL 5min) se necessário.

### 4. Payments: Stripe API

**Status**: ✅ Já utilizado no projeto

**Dados Disponíveis**:
- `stripeCustomerId` na tabela users
- `stripeSubscriptionId` na tabela users
- Webhooks já configurados para atualizar status

**Cálculos Necessários**:
- Receita total: Somar valores de subscriptions ativas
- MRR: Calcular receita mensal recorrente

**Decisão**: Usar Stripe API para cálculos em tempo real. Não armazenar dados financeiros localmente.

### 5. Authentication: NextAuth v5 + Custom HMAC

**Status**: ✅ Já utilizado no projeto

**Extensão Necessária**:
- Adicionar campo `isAdmin` à sessão
- Criar middleware para verificar role
- Proteger rotas admin

**Decisão**: Estender sistema existente. Não adicionar nova dependência de auth.

### 6. UI Components: Tailwind CSS + Lucide React

**Status**: ✅ Já utilizado no projeto

**Componentes Admin**:
- Cards para métricas (Tailwind)
- Tabelas para listagens (Tailwind)
- Botões e ícones (Lucide)
- Sidebar de navegação (Tailwind)

**Decisão**: Usar Tailwind e Lucide existentes. Não adicionar nova lib de UI.

### 7. WhatsApp Integration

**Status**: ❌ Não existe no projeto

**Opções Analisadas**:
1. **WhatsApp Business API**: Oficial Meta, mas requer verificação de negócio
2. **Twilio WhatsApp API**: Mais simples, mas custo por mensagem
3. **Link direto para WhatsApp Web**: Simples, sem custo, sem API

**Decisão**: Link direto para WhatsApp Web (conforme solicitado pelo usuário).  
**Implementação**: `https://wa.me/{phone}` ou `https://api.whatsapp.com/send?phone={phone}`

### 8. State Management

**Status**: React hooks existentes

**Opções**:
1. **React Query/TanStack Query**: Cache automático, refetch, optimistic updates
2. **SWR**: Mais leve, focado em stale-while-revalidate
3. **React hooks simples**: useState + useEffect + fetch

**Decisão**: React hooks simples para MVP. Considerar React Query se necessário.

## Arquitetura Decidida

### Estrutura de Diretórios

```
app/admin/           → Rotas de página (Server Components)
app/api/admin/       → Endpoints de API
components/admin/    → Componentes React (Client Components)
lib/admin/           → Utilitários e lógica de negócio
```

### Padrões de Código

1. **Server Components** para páginas admin (carregamento de dados no servidor)
2. **Client Components** para interatividade (filtros, botões, modais)
3. **API Routes** para operações de escrita (atualizar status de lead)
4. **Middleware** para proteção de rotas

### Fluxo de Dados

```
Browser → /admin/page.tsx (Server Component)
       → lib/admin/metrics.ts (queries)
       → Neon PostgreSQL
       → Renderiza HTML com dados

Browser → /api/admin/metrics (API Route)
       → lib/admin/metrics.ts (queries)
       → Neon PostgreSQL
       → Retorna JSON
```

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Queries lentas de contagem | Baixa | Médio | Usar COUNT() otimizado, cache em memória |
| Stripe API indisponível | Baixa | Médio | Tratamento de erro graceful, fallback |
| Acesso não autorizado | Baixa | Alto | Middleware robusto, verificação em cada endpoint |
| Dados sensíveis expostos | Baixa | Alto | Retornar apenas dados necessários, não expor IDs internos |

## Conclusão

Todas as tecnologias necessárias já estão presentes no projeto. A implementação é aditiva e não requer novas dependências. A abordagem é conservadora e segue padrões existentes.

**Tempo Estimado**: 8-12 horas de desenvolvimento
**Dependências Externas**: Nenhuma nova
**Complexidade**: Média (CRUD + cálculos simples)
