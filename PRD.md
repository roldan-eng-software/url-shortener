# 🚀 Product Requirements Document (PRD) - Versão de Testes de Eficiência

Este documento define os requisitos técnicos, benchmarks de performance e critérios de aceitação para a validação da eficiência do **MicroSaaS URL Shortener**. O foco principal é garantir que a arquitetura serverless (Next.js + Neon DB) suporte redirecionamentos extremamente rápidos e persistência escalável.

---

## 1. Visão Geral do Projeto
O sistema consiste em um encurtador de URLs que converte links longos em códigos alfanuméricos curtos. Sendo um produto focado em utilidade, a **velocidade de redirecionamento** é o principal diferencial competitivo e o métrica chave de eficiência.

- **Stack**: Next.js 14 (App Router), Neon DB (PostgreSQL Serverless), Drizzle ORM, Vercel Edge.
- **Público**: Desenvolvedores e pequenos negócios (MicroSaaS).

---

## 2. Indicadores Chave de Performance (KPIs) de Eficiência

Para considerar o sistema eficiente, ele deve atender aos seguintes benchmarks sob carga moderada (50-100 requisições simultâneas):

| Métrica | Objetivo (Target) | Threshold Crítico |
| :--- | :--- | :--- |
| **Latência de Redirecionamento (TTFB)** | < 100ms | > 250ms |
| **Tempo de Resposta da API (POST)** | < 500ms | > 1.0s |
| **Carregamento da Home (LCP)** | < 1.2s | > 2.5s |
| **Throughput (Redirecionamento)** | 100 req/s | < 30 req/s |
| **Taxa de Erro (HTTP 5xx)** | < 0.1% | > 1% |

---

## 3. Cenários de Teste de Eficiência

### 3.1. Cenário A: Fluxo de Redirecionamento Quente (Hot Path)
**Objetivo**: Validar a eficiência da busca no banco de dados e resolução no Edge.
- **Passos**: 
    1. Acesso à rota `/[shortCode]`.
    2. Consulta do `originalUrl` no Neon via Drizzle.
    3. Update assíncrono do contador de cliques.
    4. Redirecionamento 301/302.
- **Verificação**: O tempo entre a requisição e o recebimento do header `Location` deve ser minimizado.

### 3.2. Cenário B: Geração de Links (Write Stress)
**Objetivo**: Avaliar a eficiência da persistência e geração de códigos únicos.
- **Passos**: 
    1. Envio de URL longa via `POST /api/urls`.
    2. Verificação de colisão de `shortCode`.
    3. Inserção no banco de dados.
- **Verificação**: Latência de escrita e correto gerenciamento de conexões com o banco serverless.

### 3.3. Cenário C: Recuperação de Estatísticas
**Objetivo**: Validar a eficiência de queries agregadas ou detalhadas.
- **Passos**: 
    1. Consulta de estatísticas totais e por link.
- **Verificação**: Uso eficiente de índices (Primary Key no `shortCode`).

---

## 4. Requisitos de Infraestrutura para Eficiência

1. **Database Connection Pooling**: Utilização do `@neondatabase/serverless` para evitar overhead de handshake TCP em cada requisição.
2. **Edge Runtime**: Executar as funções de redirecionamento o mais próximo possível do usuário final através da infraestrutura da Vercel.
3. **Optimistic Updates (UI)**: A interface deve refletir o sucesso da criação do link instantaneamente antes da confirmação do servidor (UX de eficiência).
4. **Caching Strategy**: Implementar cache de curta duração (revalidação incremental) para links que se tornam virais.

---

## 5. Ferramentas Recomendadas para Verificação
- **Playwright/K6**: Para testes de carga e simulação de concorrência.
- **Vercel Analytics/Logtail**: Monitoramento de Web Vitals e Serverless execution duration.
- **PageSpeed Insights**: Avaliação de performance do frontend nas métricas de LCP e TBT.

---

## 6. Critérios de Aceitação de Eficiência
- [ ] O redirecionamento não deve ultrapassar 150ms em 95% dos casos (P95).
- [ ] Não deve haver "Cold Starts" perceptíveis no banco de dados que causem latência > 1s.
- [ ] O payload JSON da API para criação de URLs deve ser inferior a 2KB.
- [ ] O consumo de memória das Server Actions deve ser estável abaixo de 128MB por invocação.

---

> [!IMPORTANT]
> A eficiência deste projeto é medida pela economia de tempo do usuário. Qualquer latência adicional no redirecionamento degrada diretamente o valor do produto.
