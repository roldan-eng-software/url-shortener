# Implementation Plan: Admin Dashboard

**Branch**: `004-admin-dashboard` | **Date**: 2026-06-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-admin-dashboard/spec.md`

## Summary

Dashboard admin integrado ao app Next.js existente para gerenciamento completo do sistema URLEncurta. Inclui monitoramento de banco de dados (contagem por tabela), gestão de clientes premium com status de pagamento e link WhatsApp, métricas financeiras (receita total/MRR via Stripe), e gestão de leads. Acesso protegido por campo `isAdmin` na tabela users.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19  
**Primary Dependencies**: Next.js 16 (App Router), Drizzle ORM 0.45, Stripe 17.5  
**Storage**: Neon PostgreSQL (serverless)  
**Testing**: Vitest (configurado no projeto)  
**Target Platform**: Web (Vercel deployment)  
**Project Type**: Web application (Next.js monolith)  
**Performance Goals**: Dashboard load < 3s, API responses < 500ms  
**Constraints**: Manter separação de ambientes (admin vs produção), não afetar hot path de redirecionamento  
**Scale/Scope**: ~1000 usuários premium esperados, 8 tabelas para monitorar

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Free Utility Gate**: ✅ PASS - Feature não afeta fluxo gratuito de encurtamento. Dashboard admin é superfície privada separada.
- **AdSense Surface Gate**: ✅ PASS - Feature não adiciona anúncios. Rotas admin são bloqueadas de monetização.
- **Organic Growth Gate**: ✅ PASS - Feature não contribui diretamente para crescimento orgânico, mas não prejudica alavancas existentes.
- **Trust and LGPD Gate**: ✅ PASS - Feature não coleta dados novos. Apenas exibe dados existentes. LGPD não afetada.
- **Performance Gate**: ✅ PASS - Operações admin são independentes do hot path de redirecionamento. Queries de contagem são leves.

## Project Structure

### Documentation (this feature)

```text
specs/004-admin-dashboard/
├── plan.md              # Este arquivo
├── spec.md              # Especificação da feature
├── research.md          # Análise de tech stack
├── data-model.md        # Mudanças no schema do banco
├── quickstart.md        # Guia de setup rápido
├── contracts/           # Contratos de API
│   └── admin-api.yaml   # OpenAPI spec para endpoints admin
└── tasks.md             # Lista de tarefas
```

### Source Code (repository root)

```text
app/
├── admin/
│   ├── layout.tsx           # Layout admin com sidebar
│   ├── page.tsx             # Dashboard principal (métricas)
│   ├── clients/
│   │   └── page.tsx         # Gestão de clientes premium
│   ├── payments/
│   │   └── page.tsx         # Status Stripe e métricas financeiras
│   └── leads/
│       └── page.tsx         # Gestão de leads
├── api/
│   └── admin/
│       ├── metrics/
│       │   └── route.ts     # GET: contagem de registros por tabela
│       ├── clients/
│       │   └── route.ts     # GET: lista usuários premium
│       ├── payments/
│       │   └── route.ts     # GET: status Stripe + MRR
│       └── leads/
│           └── route.ts     # GET/PUT: listagem e atualização de leads
components/
├── admin/
│   ├── AdminSidebar.tsx     # Sidebar de navegação admin
│   ├── MetricsCard.tsx      # Card de métricas (contagem)
│   ├── ClientsTable.tsx     # Tabela de clientes premium
│   ├── WhatsAppButton.tsx   # Botão de link WhatsApp
│   ├── PaymentStatus.tsx    # Status do Stripe
│   ├── LeadsTable.tsx       # Tabela de leads
│   └── AdminGuard.tsx       # Componente de proteção de rota
lib/
├── admin/
│   ├── auth.ts              # Verificação de isAdmin
│   ├── metrics.ts           # Queries de métricas do banco
│   ├── stripe.ts            # Cálculos de receita/MRR
│   └── whatsapp.ts          # Utilitário de link WhatsApp
migrations/
└── 004_add_isAdmin.sql      # Migration para campo isAdmin
```

**Structure Decision**: Estrutura integrada ao app Next.js existente (Opção A do usuário). Rotas admin em `app/admin/`, API em `app/api/admin/`, componentes em `components/admin/`, utilitários em `lib/admin/`. Mantém consistência com a arquitetura atual do projeto.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Nenhuma violação identificada. Feature é aditiva e não conflita com princípios da constituição.

## Implementation Strategy

### Fase 1: Fundação (Auth + Schema)
- Adicionar campo `isAdmin` à tabela users
- Criar middleware de verificação de admin
- Criar utilitário `lib/admin/auth.ts`

### Fase 2: APIs Admin
- Endpoint de métricas do banco
- Endpoint de listagem de clientes premium
- Endpoint de status Stripe e MRR
- Endpoint de gestão de leads

### Fase 3: Interface Admin
- Layout admin com sidebar
- Dashboard principal com cards de métricas
- Página de gestão de clientes premium
- Página de status de pagamentos
- Página de gestão de leads

### Fase 4: Integração e Segurança
- Proteção de todas as rotas admin
- Validação de permissões em cada endpoint
- Testes de integração

## Risk Assessment

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Acesso admin não autorizado | Alto | Middleware robusto + verificação em cada endpoint |
| Performance de queries de contagem | Baixo | Usar COUNT() otimizado, cache em memória |
| Erro de conexão Stripe | Médio | Tratamento de erro graceful + fallback |
| Dados sensíveis expostos | Alto | Apenas dados necessários são retornados |

## Next Steps

1. Criar migration para campo `isAdmin`
2. Implementar `lib/admin/auth.ts`
3. Criar endpoints da API admin
4. Desenvolver componentes da interface
5. Integrar e testar fluxo completo
