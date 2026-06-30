---

description: "Task list for Admin Dashboard implementation"
---

# Tasks: Admin Dashboard

**Input**: Design documents from `/specs/004-admin-dashboard/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Testes incluídos para validação de segurança e integração.

**Organization**: Tasks são agrupadas por user story para implementação e teste independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: User story associada (US0, US1, US2, US3, US4, US5)
- Inclui caminhos exatos dos arquivos nas descrições

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Migração do banco e infraestrutura de autenticação admin

- [ ] T001 Criar migration SQL para adicionar campo `isAdmin` na tabela users em `migrations/004_add_isAdmin.sql`
- [ ] T002 Criar migration para definir primeiro admin (email do proprietário) em `migrations/004_set_first_admin.sql`
- [ ] T003 [P] Criar utilitário de verificação admin em `lib/admin/auth.ts`
- [ ] T004 [P] Criar middleware de proteção de rotas admin em `lib/admin/middleware.ts`

**Checkpoint**: Infraestrutura de auth admin pronta - implementação de user stories pode começar

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: APIs admin que todas as user stories dependem

- [ ] T005 [US0] Criar endpoint de métricas do banco em `app/api/admin/metrics/route.ts`
- [ ] T006 [US0] Criar endpoint de listagem de clientes premium em `app/api/admin/clients/route.ts`
- [ ] T007 [US0] Criar endpoint de status Stripe em `app/api/admin/payments/route.ts`
- [ ] T008 [US0] Criar endpoint de gestão de leads em `app/api/admin/leads/route.ts`
- [ ] T009 [US0] Criar componente AdminGuard em `components/admin/AdminGuard.tsx`

**Checkpoint**: APIs admin prontas - interface pode ser implementada

---

## Phase 3: User Story 0 - Admin Authentication & Security (Priority: P0) 🔐

**Goal**: Garantir que apenas admins possam acessar rotas admin

**Independent Test**: Verificar que usuários não-admin são redirecionados

### Implementation for User Story 0

- [ ] T010 [US0] Criar layout admin em `app/admin/layout.tsx` com verificação de auth
- [ ] T011 [US0] Criar componente AdminSidebar em `components/admin/AdminSidebar.tsx`
- [ ] T012 [US0] Implementar redirecionamento para não-admin no layout
- [ ] T013 [US0] Adicionar rota `/admin` na lista de rotas protegidas

**Checkpoint**: Acesso admin protegido - apenas usuários com isAdmin=true podem acessar

---

## Phase 4: User Story 1 - Database Monitoring (Priority: P1) 📊

**Goal**: Visualizar contagem de registros por tabela

**Independent Test**: Verificar que cards de métricas exibem contagens corretas

### Implementation for User Story 1

- [ ] T014 [P] [US1] Criar componente MetricsCard em `components/admin/MetricsCard.tsx`
- [ ] T015 [P] [US1] Criar componente MetricsGrid em `components/admin/MetricsGrid.tsx`
- [ ] T016 [US1] Implementar dashboard principal em `app/admin/page.tsx`
- [ ] T017 [US1] Integrar com endpoint `/api/admin/metrics`
- [ ] T018 [US1] Adicionar tratamento de erro e loading states

**Checkpoint**: Dashboard principal funcional - métricas de banco visíveis

---

## Phase 5: User Story 2 - Premium Client Management (Priority: P2) 👥

**Goal**: Gerenciar clientes premium com status de pagamento e WhatsApp

**Independent Test**: Verificar lista de clientes com status e botão WhatsApp

### Implementation for User Story 2

- [ ] T019 [P] [US2] Criar componente WhatsAppButton em `components/admin/WhatsAppButton.tsx`
- [ ] T020 [P] [US2] Criar componente ClientsTable em `components/admin/ClientsTable.tsx`
- [ ] T021 [US2] Implementar página de clientes em `app/admin/clients/page.tsx`
- [ ] T022 [US2] Integrar com endpoint `/api/admin/clients`
- [ ] T023 [US2] Implementar lógica de status de pagamento (ativo/expirado/cancelado)
- [ ] T024 [US2] Adicionar filtro e busca na lista de clientes

**Checkpoint**: Gestão de clientes premium funcional

---

## Phase 6: User Story 3 - Payment System Status (Priority: P3) 💳

**Goal**: Visualizar status Stripe e métricas financeiras

**Independent Test**: Verificar status de conexão e cálculos de MRR

### Implementation for User Story 3

- [ ] T025 [P] [US3] Criar componente PaymentStatus em `components/admin/PaymentStatus.tsx`
- [ ] T026 [P] [US3] Criar componente RevenueCard em `components/admin/RevenueCard.tsx`
- [ ] T027 [US3] Implementar página de pagamentos em `app/admin/payments/page.tsx`
- [ ] T028 [US3] Integrar com endpoint `/api/admin/payments`
- [ ] T029 [US3] Implementar cálculo de MRR (Monthly Recurring Revenue)
- [ ] T030 [US3] Adicionar tratamento de erro para Stripe indisponível

**Checkpoint**: Métricas financeiras visíveis

---

## Phase 7: User Story 4 - Lead Management (Priority: P4) 📋

**Goal**: Gerenciar leads de marketing

**Independent Test**: Verificar listagem, filtros e atualização de status

### Implementation for User Story 4

- [ ] T031 [P] [US4] Criar componente LeadsTable em `components/admin/LeadsTable.tsx`
- [ ] T032 [P] [US4] Criar componente LeadFilters em `components/admin/LeadFilters.tsx`
- [ ] T033 [US4] Implementar página de leads em `app/admin/leads/page.tsx`
- [ ] T034 [US4] Integrar com endpoint `/api/admin/leads`
- [ ] T035 [US4] Implementar filtros por status, interesse e fonte
- [ ] T036 [US4] Implementar atualização de status de lead

**Checkpoint**: Gestão de leads funcional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias que afetam múltiplas user stories

- [ ] T037 [P] Adicionar responsividade mobile em todos os componentes admin
- [ ] T038 [P] Implementar cache em memória para métricas (TTL 5 minutos)
- [ ] T039 Adicionar tratamento de erros globais no layout admin
- [ ] T040 [P] Criar testes de integração para rotas admin
- [ ] T041 Verificar que rotas admin não aparecem no sitemap
- [ ] T042 Verificar que rotas admin não são indexadas por robots.txt
- [ ] T043 Rodar `npm run lint` e `npm run build` para validação final
- [ ] T044 Documentar setup do primeiro admin no README ou AGENTS.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências - pode começar imediatamente
- **Foundational (Phase 2)**: Depende do Setup - BLOQUEIA todas as user stories
- **User Stories (Phase 3+)**: Todas dependem do Foundational
  - US0 (Auth) deve ser implementada primeiro por segurança
  - US1, US2, US3, US4 podem rodar em paralelo após US0
- **Polish (Phase 8)**: Depende de todas as user stories desejadas

### User Story Dependencies

- **US0 (P0)**: Pode começar após Foundational - PRÉ-REQUISITO para todas as outras
- **US1 (P1)**: Pode começar após US0 - Sem dependências de outras stories
- **US2 (P2)**: Pode começar após US0 - Pode integrar com US1 mas é independentemente testável
- **US3 (P3)**: Pode começar após US0 - Independentemente testável
- **US4 (P4)**: Pode começar após US0 - Independentemente testável

### Within Each User Story

- Componentes marcados [P] podem rodar em paralelo
- Componentes antes de pages
- Pages antes de integração
- Integração antes de polish
- Story completa antes de proxima prioridade

### Parallel Opportunities

- T003 e T004 podem rodar em paralelo (arquivos diferentes)
- T005, T006, T007, T008 podem rodar em paralelo (endpoints diferentes)
- T014 e T015 podem rodar em paralelo (componentes diferentes)
- T019 e T020 podem rodar em paralelo (componentes diferentes)
- T025 e T026 podem rodar em paralelo (componentes diferentes)
- T031 e T032 podem rodar em paralelo (componentes diferentes)

---

## Implementation Strategy

### MVP First (US0 + US1 Only)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational
3. Completar Phase 3: US0 (Auth)
4. Completar Phase 4: US1 (Database Monitoring)
5. **PARAR e VALIDAR**: Testar US1 independentemente
6. Deploy/demo se pronto

### Incremental Delivery

1. Setup + Foundational → Fundação pronta
2. Adicionar US0 → Testar → Deploy/Demo (Auth pronta!)
3. Adicionar US1 → Testar → Deploy/Demo (Métricas prontas!)
4. Adicionar US2 → Testar → Deploy/Demo (Clientes prontos!)
5. Adicionar US3 → Testar → Deploy/Demo (Pagamentos prontos!)
6. Adicionar US4 → Testar → Deploy/Demo (Leads prontos!)

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências
- [Story] label mapeia task para user story específica
- Cada user story deve ser completável e testável independentemente
- Commit após cada task ou grupo lógico
- Parar em qualquer checkpoint para validar story independentemente
- Evitar: tasks vagas, conflitos no mesmo arquivo, dependências cross-story que quebram independência
