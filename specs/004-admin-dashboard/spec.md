# Feature Specification: Admin Dashboard

**Feature Branch**: `004-admin-dashboard`  
**Created**: 2026-06-30  
**Status**: Draft  
**Input**: User description: "Dashboard admin para gerenciar todo o sistema com monitoramento de banco de dados, gestão de clientes premium, status de pagamentos e gestão de leads"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Database Monitoring (Priority: P1)

Como administrador, eu quero visualizar a contagem de registros por tabela (users, userLinks, anonLinks, urls, marketingLeads, privacyRequests, bioPages, bioLinks) para entender a carga do banco de dados e o consumo de espaço.

**Why this priority**: Esta é a funcionalidade mais crítica para operações, permitindo ao admin monitorar a saúde do sistema e tomar decisões sobre escalabilidade.

**Independent Test**: Pode ser testado independentemente acessando `/admin` e verificando se os cards de métricas são exibidos com contagens corretas.

**Acceptance Scenarios**:

1. **Given** que o admin está autenticado com perfil isAdmin, **When** acessa `/admin`, **Then** visualiza dashboard com cards mostrando contagem de registros por tabela
2. **Given** que o banco possui dados, **When** o admin visualiza as métricas, **Then** os números estão atualizados e corretos
3. **Given** que há erro de conexão com o banco, **When** o admin acessa o dashboard, **Then** exibe mensagem de erro amigável

---

### User Story 2 - Premium Client Management (Priority: P2)

Como administrador, eu quero visualizar a quantidade de clientes premium, o status de pagamento de cada um, e ter a opção de enviar mensagens pelo WhatsApp para facilitar o contato e suporte.

**Why this priority**: Gestão de clientes premium é essencial para receita e retenção, permitindo acompanhar conversões e entrar em contato quando necessário.

**Independent Test**: Pode ser testado independentemente verificando a lista de usuários premium com status de pagamento e botão de WhatsApp.

**Acceptance Scenarios**:

1. **Given** que o admin acessa a seção de clientes, **When** visualiza a lista, **Then** exibe todos os usuários premium com email, data de cadastro, status de pagamento e expiration
2. **Given** que um cliente premium tem pagamento ativo, **When** o admin visualiza seu status, **Then** exibe "Ativo" com ícone verde
3. **Given** que um cliente premium tem pagamento expirado, **When** o admin visualiza seu status, **Then** exibe "Expirado" com ícone vermelho
4. **Given** que o admin quer contactar um cliente, **When** clica no botão WhatsApp, **Then** abre nova aba com WhatsApp Web pré-preenchido com o número do cliente (se disponível)

---

### User Story 3 - Payment System Status (Priority: P3)

Como administrador, eu quero visualizar o status da conexão do sistema de pagamentos (Stripe) e a receita total/MRR para acompanhar a saúde financeira do negócio.

**Why this priority**: Visibilidade financeira é importante para decisões estratégicas, mas menos urgente que operações e gestão de clientes.

**Independent Test**: Pode ser testado independentemente verificando se o status do Stripe e métricas financeiras são exibidos.

**Acceptance Scenarios**:

1. **Given** que o admin acessa a seção de pagamentos, **When** visualiza o dashboard, **Then** exibe status da conexão Stripe (Conectado/Desconectado)
2. **Given** que o Stripe está conectado, **When** o admin visualiza métricas, **Then** exibe receita total e MRR calculado
3. **Given** que há erro de conexão com Stripe, **When** o admin acessa a seção, **Then** exibe alerta de erro com instruções de verificação

---

### User Story 4 - Lead Management (Priority: P4)

Como administrador, eu quero gerenciar os leads de marketing (marketingLeads) para acompanhar potenciais clientes e suas demandas.

**Why this priority**: Leads representam oportunidades de negócio, mas são menos críticos que a gestão de clientes existentes.

**Independent Test**: Pode ser testado independentemente verificando a lista de leads com filtro e ação de status.

**Acceptance Scenarios**:

1. **Given** que o admin acessa a seção de leads, **When** visualiza a lista, **Then** exibe todos os leads com nome, email, empresa, interesse, fonte, status e data
2. **Given** que o admin quer filtrar leads, **When** seleciona um filtro (status, interesse, fonte), **Then** a lista é filtrada corretamente
3. **Given** que o admin quer atualizar o status de um lead, **When** clica para alterar status, **Then** o status é atualizado no banco

---

### User Story 5 - Admin Authentication & Security (Priority: P0)

Como proprietário do sistema, eu quero garantir que apenas usuários autorizados (com perfil isAdmin) possam acessar o dashboard admin, protegendo dados sensíveis do sistema.

**Why this priority**: Segurança é pré-requisito absoluto - sem controle de acesso, nenhuma outra funcionalidade pode ser implementada com segurança.

**Independent Test**: Pode ser testado verificando que usuários sem perfil isAdmin são redirecionados e que a rota /admin é protegida.

**Acceptance Scenarios**:

1. **Given** que um usuário não autenticado tenta acessar `/admin`, **When** a requisição é feita, **Then** é redirecionado para `/login`
2. **Given** que um usuário comum (não admin) acessa `/admin`, **When** a verificação é feita, **Then** é redirecionado para `/dashboard` com mensagem de acesso negado
3. **Given** que um admin autenticado acessa `/admin`, **When** a verificação é feita, **Then** acessa o dashboard normalmente

---

### Edge Cases

- O que acontece quando o banco de dados está temporariamente indisponível? → Exibe mensagem de erro com opção de retry
- Como o sistema lida com usuários premium que cancelaram mas ainda estão no período de grace? → Exibe status "Cancelado (período de grace)"
- O que acontece se o Stripe retornar erro ao calcular MRR? → Exibe "N/A" com tooltip explicativo
- Como lidar com leads duplicados (mesmo email)? → Permite visualizar duplicatas, mas não auto-filtra

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE adicionar campo `isAdmin` boolean na tabela `users` (default: false)
- **FR-002**: Sistema DEVE criar rota `/admin` protegida que verifica perfil isAdmin
- **FR-003**: Sistema DEVE criar API endpoints para métricas do banco de dados
- **FR-004**: Sistema DEVE criar API endpoints para listagem de usuários premium com status de pagamento
- **FR-005**: Sistema DEVE criar API endpoints para cálculo de receita total e MRR via Stripe
- **FR-006**: Sistema DEVE criar API endpoints para gestão de leads (CRUD básico)
- **FR-007**: Sistema DEVE implementar componente de link WhatsApp que abre em nova aba
- **FR-008**: Sistema DEVE criar interface responsiva com sidebar de navegação entre seções
- **FR-009**: Sistema DEVE proteger todas as rotas admin com middleware de verificação de role
- **FR-010**: Sistema DEVE exibir status da conexão Stripe (verificando se as chaves estão configuradas)

### Monetization, Growth & Compliance Requirements *(mandatory when affected)*

- **MG-001**: Feature NÃO afeta fluxo gratuito de encurtamento, Adsterra, SEO pages, compartilhamento, QR Codes ou Premium conversion
- **MG-002**: Feature NÃO adiciona anúncios Adsterra - dashboard admin é superfície privada
- **MG-003**: Feature NÃO adiciona conteúdo público indexável - rotas admin são bloqueadas de indexação
- **MG-004**: Feature NÃO adiciona tracking de terceiros - apenas usa dados existentes do Stripe para cálculos
- **MG-005**: Feature NÃO afeta performance de redirecionamento - operações admin são independentes do hot path

### Key Entities

- **User (extended)**: Adiciona campo `isAdmin` (boolean) para controle de acesso admin
- **DatabaseMetrics**: Contagem de registros por tabela (calculado via queries SQL)
- **PremiumUserStats**: Dados agregados de usuários premium com status de pagamento
- **PaymentMetrics**: Receita total e MRR calculados via Stripe API
- **Lead**: Entidade existente (marketingLeads) com status gerenciável

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin pode visualizar contagem de registros de todas as 8 tabelas em menos de 3 segundos
- **SC-002**: Lista de clientes premium carrega em menos de 2 segundos para até 1000 usuários
- **SC-003**: Cálculo de MRR é exibido em tempo real (atualizado a cada acesso)
- **SC-004**: 100% das rotas admin são protegidas e verificam perfil isAdmin
- **SC-005**: Interface é responsiva e funcional em desktop e mobile

## Assumptions

- Usuários admin existem (pelo menos 1 usuário com isAdmin=true será criado manualmente via migration)
- Stripe está configurado e funcionando para cálculos de receita
- WhatsApp Web é suficiente para contato (não precisa de WhatsApp Business API)
- Dados de leads já existem na tabela marketingLeads
- Performance do Neon PostgreSQL é suficiente para queries de contagem
- Não é necessário histórico de métricas (apenas snapshot atual)
