# Data Model: Instrumentação do Funil Anônimo → Premium

**Date**: 2026-10-18
**Feature**: Instrumentação do Funil Anônimo → Premium (005-premium-conversion-funnel)

## Visão geral

A feature adiciona **uma** tabela persistida (`funnel_events`) e dois conceitos que
não são persistidos como entidade própria: o **visitante anônimo** (cookie de
primeira parte) e a **etapa do funil** (enumeração em código). Nenhuma tabela
existente é alterada.

```text
Visitante anônimo (cookie)            users (já existe)
        │                                  │
        └──────── funnel_events ───────────┘
             (visitor_id)  (user_id)
```

## Entidades

### 1. FunnelEvent — tabela `funnel_events` (NOVA)

Um passo registrado da jornada anônimo → Premium.

| Campo      | Coluna        | Tipo                                          | Nulo | Regra                                                                                            |
| ---------- | ------------- | --------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------ |
| id         | `id`          | `uuid` PK, `defaultRandom()`                  | não  | Identificador do evento                                                                          |
| step       | `step`        | `varchar(40)`                                 | não  | Uma das etapas canônicas (ver enum abaixo)                                                       |
| source     | `source`      | `varchar(80)`                                 | não  | Canal/origem; `unknown` quando não identificável (FR-003)                                        |
| visitorId  | `visitor_id`  | `varchar(64)`                                 | sim  | Chave do visitante anônimo (cookie); ausente em eventos puramente server-side sem sessão anônima |
| userId     | `user_id`     | `uuid` FK → `users.id` (`ON DELETE SET NULL`) | sim  | Presente a partir de `account_created` (FR-005)                                                  |
| dedupeKey  | `dedupe_key`  | `varchar(180)` UNIQUE                         | não  | `visitor_id                                                                                      | user_id | step`; garante FR-006 |
| occurredAt | `occurred_at` | `timestamp` `defaultNow()`                    | não  | Instante do evento (FR-002)                                                                      |
| metadata   | `metadata`    | `jsonb` `default {}`                          | não  | Dados mínimos e não pessoais (ex.: `plan`, `cycle`, `surface`)                                   |

**Índices**:

- `UNIQUE (dedupe_key)` — deduplicação (FR-006).
- `INDEX (step, occurred_at)` — agregação do funil por período (SC-001).
- `INDEX (source, occurred_at)` — conversão por canal (SC-003).
- `INDEX (user_id)` — caminho da jornada de um usuário.

**Regras de validação**:

- `step` MUST pertencer ao enum canônico (rejeitar valor desconhecido na escrita).
- `metadata` MUST NOT conter e-mail, IP, URL original, texto livre do usuário ou
  qualquer PII (FR-009, MG-004).
- `dedupe_key` MUST ser derivado no servidor, nunca aceito do cliente.
- Inserção MUST usar `ON CONFLICT DO NOTHING` (idempotência no banco).

### 2. Etapa do funil — enumeração em código (não persistida)

| Etapa (`step`)             | Origem do registro                  | Momento                                                          |
| -------------------------- | ----------------------------------- | ---------------------------------------------------------------- |
| `result_viewed`            | Cliente (GA)                        | Visitante anônimo obtém um link curto                            |
| `offer_viewed`             | Cliente (GA)                        | Superfície Premium vista (home, `/premium`, upsell do dashboard) |
| `account_creation_started` | Cliente (GA)                        | Visitante abre/inicia o cadastro                                 |
| `account_created`          | **Servidor** (`/api/auth/register`) | Conta criada — aqui nasce `user_id`                              |
| `trial_started`            | **Servidor** (webhook Stripe)       | Assinatura em período de teste                                   |
| `subscription_active`      | **Servidor** (webhook Stripe)       | Assinatura paga ativa                                            |
| `payment_failed`           | **Servidor** (webhook Stripe)       | Falha de pagamento                                               |
| `subscription_canceled`    | **Servidor** (webhook Stripe)       | Cancelamento                                                     |

> As etapas de cobrança são as que permitem SC-005 (< 5% de divergência), pois usam
> a mesma fonte que atualiza `users.isPremium`/`premiumExpiresAt`.

### 3. Visitante anônimo — cookie + atribuição (não persistido como tabela)

| Aspecto               | Regra                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------- |
| Identificador         | UUID opaco (`urlshortener_visitor`), sem PII                                                 |
| Criação               | **Somente** após consentimento de analytics (FR-004, MG-004)                                 |
| Escopo                | Primeira parte, `SameSite=Lax`, `Path=/`                                                     |
| Atribuição            | Primeiro toque: `utm_source`/`utm_medium`/`utm_campaign` + `referrer`; ausente → `unknown`   |
| Costura de identidade | Enviado no cadastro/checkout para o servidor ligar as etapas anteriores a `user_id` (FR-005) |
| Expiração             | Alinhada à retenção de analytics (12 meses)                                                  |

### 4. Estado de assinatura (leitura de `users`, não é entidade nova)

`subscription_active`, `trial_started`, `payment_failed` e `subscription_canceled`
são derivados do ciclo de vida já refletido em `users`:

| Transição            | Fonte                                | Etapa do funil          |
| -------------------- | ------------------------------------ | ----------------------- |
| — → trial            | Evento Stripe de assinatura em teste | `trial_started`         |
| trial → pago         | Assinatura ativa                     | `subscription_active`   |
| ativa → falha        | Falha de pagamento                   | `payment_failed`        |
| qualquer → cancelada | Cancelamento                         | `subscription_canceled` |

## Relacionamentos

- `funnel_events.user_id` → `users.id` (N eventos : 1 usuário), `ON DELETE SET NULL`
  para preservar o histórico agregado em caso de exclusão de conta (LGPD).
- `funnel_events` é independente de `urls`, `user_links`, `anon_links`,
  `bio_pages`, `marketing_leads` — nenhuma dessas tabelas é alterada.
- Não há FK para `visitor_id`: visitantes anônimos não são uma linha em banco.

## Mapa requisito → modelo

| Requisito                      | Como o modelo atende                                                           |
| ------------------------------ | ------------------------------------------------------------------------------ |
| FR-001 (etapas nomeadas)       | Enum `step`                                                                    |
| FR-002 (etapa + instante)      | `step` + `occurred_at`                                                         |
| FR-003 (origem)                | `source` com fallback `unknown`                                                |
| FR-004 (consentimento)         | Visitante só existe após consentimento; passos de cliente via GA consent-gated |
| FR-005 (unir anônimo → conta)  | `visitor_id` + `user_id` no mesmo evento                                       |
| FR-006 (sem duplicar)          | `dedupe_key` UNIQUE                                                            |
| FR-007 (ciclo de assinatura)   | Etapas server-side do webhook                                                  |
| FR-008 (falha não bloqueia)    | Escrita fire-and-forget, sem FK obrigatória                                    |
| FR-009 (minimização)           | `metadata` sem PII; sem campo de IP/e-mail/URL                                 |
| SC-001 (conversão por período) | Índice `(step, occurred_at)`                                                   |
| SC-003 (origem atribuída)      | Índice `(source, occurred_at)`                                                 |
| SC-005 (baixa divergência)     | Etapas de cobrança na mesma origem do estado                                   |

## Migration

`migrations/006_create_funnel_events.sql` — cria a tabela e os índices acima.
Nenhum `ALTER` em tabela existente, nenhum backfill (feature nova, sem histórico).
