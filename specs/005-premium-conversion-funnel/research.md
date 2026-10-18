# Research: Instrumentação do Funil Anônimo → Premium

**Date**: 2026-10-18
**Feature**: Instrumentação do Funil Anônimo → Premium (005-premium-conversion-funnel)

Este documento resolve os pontos em aberto do Technical Context do `plan.md`.
Nenhum item permanece como NEEDS CLARIFICATION.

## Estado atual relevante (verificado no código)

| Peça existente                   | Onde                                                                                                                    | O que já entrega                                                                                                                                              |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google Analytics + consentimento | `components/GoogleAnalytics.tsx`                                                                                        | `gtag` carregado em `afterInteractive` **somente** se `localStorage` tiver `analytics: true`; helpers `trackEvent`, `trackConversionEvent`, `trackConversion` |
| Consentimento                    | `lib/cookie-consent.ts`                                                                                                 | Preferências `{ necessary, analytics, ads, version, updatedAt }` em `localStorage` + evento `urlencurtaCookieConsentUpdated`                                  |
| Eventos de clique declarativos   | `components/ConversionTracker.tsx`                                                                                      | Escuta cliques em `[data-track]` e chama `trackEvent`                                                                                                         |
| Eventos já enviados              | `components/UrlForm.tsx` (`short_link_created`), `app/premium/page.tsx` (`checkout_started`, `checkout_login_required`) | Dois passos do funil já existem no cliente                                                                                                                    |
| Cobrança                         | `app/api/stripe/webhook/route.ts`                                                                                       | Assinatura validada, idempotência via `processed_events`                                                                                                      |
| Identidade                       | `lib/auth.ts`                                                                                                           | Cookie `session` (HMAC) + sessão NextAuth                                                                                                                     |
| Banco                            | `lib/db/schema.ts` (Drizzle)                                                                                            | Tabelas `users`, `user_links`, `anon_links`, `urls`, `marketing_leads`, `processed_events`                                                                    |
| Retenção/LGPD                    | `PLANO_LGPD.md`                                                                                                         | Leads até 24 meses; sem rotina de expurgo por tipo ainda                                                                                                      |

## Decisões

### 1. Onde registrar cada etapa → **híbrido (cliente + servidor)**

- **Decisão**: passos comportamentais no GA (cliente, consent-gated); passos de
  conta e de cobrança em tabela própria `funnel_events`, escritos no servidor.
- **Rationale**: o funil anônimo → Premium termina em um evento de cobrança. Se a
  última milha depende do navegador (ad blocker, script bloqueado), SC-005 (< 5% de
  divergência com o provedor) é inalcançável. O webhook do Stripe já é a fonte de
  verdade do estado de assinatura; registrar a etapa no mesmo ponto elimina a
  divergência por construção.
- **Alternativas consideradas**: (a) só GA — rejeitada por depender do cliente e não
  correlacionar com o cadastro; (b) só tabela própria para tudo — rejeitada por
  adicionar tráfego de escrita desnecessário em passos puramente comportamentais e
  duplicar o que o GA já faz de graça.

### 2. Como unir anônimo → conta (FR-005) → **identificador anônimo de primeira parte, sob consentimento**

- **Decisão**: cookie de primeira parte `urlshortener_visitor` (UUID, `SameSite=Lax`,
  `HttpOnly=false`, sem dado pessoal) **criado apenas quando o consentimento de
  analytics é aceito**. No cadastro e no checkout, o identificador segue no corpo da
  requisição; o servidor grava o evento com `user_id` e `visitor_id`, ligando as
  etapas anteriores à conta.
- **Rationale**: soluções de terceiros (identidade federada de analytics) exigiriam
  fornecedor novo, proibido pelas assumptions. Um id opaco resolve a costura sem
  coletar PII.
- **Alternativas consideradas**: `client_id` do GA — rejeitado (não disponível
  quando o script é bloqueado e amarra o dado a terceiro); e-mail como chave —
  rejeitado (viola minimização).
- **Nota LGPD**: por ser cookie não essencial, só existe após consentimento, o que
  mantém FR-004 (nenhum evento antes do consentimento).

### 3. Deduplicação (FR-006) → **chave única por visitante + etapa**

- **Decisão**: coluna `dedupe_key` com índice único, composta por
  `visitor_id|user_id|step`. O insert usa `ON CONFLICT DO NOTHING`.
- **Rationale**: recarregar a página ou voltar no histórico não infla o funil; o
  banco resolve a corrida sem lógica de estado adicional.
- **Alternativas consideradas**: checar antes de inserir (SELECT + INSERT) —
  rejeitada por janela de corrida e uma query extra; deduplicar só na leitura —
  rejeitada por manter linhas sujas.

### 4. Origem/canal (FR-003) → **primeiro toque, capturado no cliente e propagado**

- **Decisão**: no primeiro acesso, capturar `utm_source`/`utm_medium`/`utm_campaign`
  e `document.referrer`; guardar junto do visitante (sob consentimento). Ausência →
  `source = "unknown"`, nunca descarte.
- **Rationale**: primeiro toque é o que melhor explica a aquisição para o público
  alvo (marketers/agências, criadores); classifica-se sem dependência externa.
- **Alternativas consideradas**: último toque — rejeitada (superestima retorno
  direto); enriquecimento por IP/geolocalização — rejeitada (PII + fornecedor).

### 5. Isolamento de falha (FR-008) → **fire-and-forget**

- **Decisão**: registro envolvido em `try/catch`, sem `await` no caminho de resposta
  quando possível; falha é logada e ignorada.
- **Rationale**: o valor do produto (encurtar, copiar, assinar) nunca pode depender
  de telemetria.
- **Alternativas consideradas**: fila/retry — rejeitada por complexidade
  desproporcional ao MVP; o webhook já é reentregue pelo Stripe.

### 6. Idempotência dos passos de cobrança → **reusar `processed_events`**

- **Decisão**: o mapeamento evento Stripe → etapa do funil acontece depois do
  guard de idempotência já existente no webhook.
- **Rationale**: nenhuma infraestrutura nova; evita etapa duplicada em reentrega.
- **Alternativas consideradas**: tabela de idempotência própria — rejeitada
  (duplicaria `processed_events`).

### 7. Retenção → **12 meses, alinhada ao `PLANO_LGPD.md`**

- **Decisão**: eventos de funil retidos por 12 meses; expurgo periódico (fora do
  escopo desta feature, registrado como pendência operacional).
- **Rationale**: a política do projeto usa prazos definidos por tipo de dado (leads
  24 meses); 12 meses é suficiente para tendências de conversão e reduz a
  exposição.
- **Alternativas consideradas**: reter indefinidamente — rejeitada (minimização);
  agregar e descartar o evento bruto imediatamente — rejeitada por impedir
  investigação de funil no MVP.

### 8. Leitura do funil → **endpoint admin + página, sem BI externo**

- **Decisão**: `GET /api/admin/funnel` (agregados por período/etapa/origem) +
  `app/admin/funnel/page.tsx`, protegidos pelo padrão `is_admin` já usado em
  `app/api/admin/*`.
- **Rationale**: mantém a instrumentação consumível dentro do produto, sem
  fornecedor de BI e sem expor dado a terceiro.
- **Alternativas consideradas**: só GA (relatórios nativos) — rejeitada porque não
  enxerga os passos server-side; ferramenta de BI — rejeitada por custo/fornecedor.

## Riscos e mitigações

| Risco                                 | Probabilidade | Impacto | Mitigação                                     |
| ------------------------------------- | ------------- | ------- | --------------------------------------------- |
| Ad blocker impede passos do cliente   | Alta          | Médio   | Passos financeiros vêm do servidor            |
| Divergência funil × Stripe            | Baixa         | Médio   | Mesma origem de evento (webhook)              |
| Contagem duplicada                    | Média         | Médio   | `dedupe_key` único + `ON CONFLICT DO NOTHING` |
| Cookie de visitante sem consentimento | Baixa         | Alto    | Cookie só criado após consentimento           |
| Peso no redirecionamento              | Baixa         | Médio   | Nenhum script novo no short-code              |
| Evento sem origem                     | Alta          | Baixo   | Valor `unknown` explícito, não descarte       |

## Conclusão

Toda a instrumentação usa infraestrutura já presente no projeto (GA, Stripe,
Drizzle/Neon, consentimento). Não há dependência nova, fornecedor novo, migration
de dados existentes nem alteração no caminho de redirecionamento. Nenhum item de
NEEDS CLARIFICATION permanece aberto.

**Complexidade**: Baixa/Média (1 tabela, 2 rotas modificadas, 1 rota e 1 página
novas, helpers de cliente).
**Dependências externas**: Nenhuma nova.
