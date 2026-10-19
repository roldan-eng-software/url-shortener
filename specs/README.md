# Specs — URLEncurta (Spec Kit)

Índice das especificações de features. Cada pasta segue o fluxo do Spec Kit:
`spec.md` (o quê/por quê) → `plan.md` (como) → `tasks.md` (execução), apoiados por
`research.md`, `data-model.md`, `quickstart.md`, `contracts/`, `checklists/` e
`validation-report.md` quando aplicável.

A feature ativa para comandos do Spec Kit fica registrada em
[`../.specify/feature.json`](../.specify/feature.json) e referenciada em
[`../AGENTS.md`](../AGENTS.md).

## Features

| #   | Feature                                                              | Status                     | Resumo                                                                                                                                                                                                         |
| --- | -------------------------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 001 | [AdSense Business Plan](001-adsense-business-plan/spec.md)           | **Superseded** (histórico) | Plano de negócio original baseado em Google AdSense. A monetização foi migrada para **Adsterra** na 003. Mantido como histórico; o conteúdo e a nomenclatura citam AdSense de propósito.                       |
| 002 | [LGPD Compliance](002-lgpd-compliance/spec.md)                       | **Implemented**            | Consentimento granular de cookies, bloqueio de scripts de terceiros até o aceite, política/termos, e intake de direitos do titular.                                                                            |
| 003 | [Adsterra Monetization Plan](003-adsterra-monetization-plan/spec.md) | **Implemented**            | Migração da monetização para Adsterra, política de superfícies, gates de performance/legal e o componente `components/Adsterra.tsx`.                                                                           |
| 004 | [Admin Dashboard](004-admin-dashboard/spec.md)                       | **Implemented**            | Dashboard `/admin` (métricas de banco, clientes Premium, pagamentos/Stripe, leads) com controle por `is_admin`.                                                                                                |
| 005 | [Premium Conversion Funnel](005-premium-conversion-funnel/spec.md)   | **Implemented**            | Instrumentação do funil anônimo → Premium (eventos por etapa e origem, `funnel_events`, `GET /api/admin/funnel`, `/admin/funnel`). Spec 01 do [PRD de conversão](../docs/prd/feature-conversao-e-retencao.md). |

## Convenções

- **Numeração:** `NNN-nome-da-feature`, na ordem de criação.
- **Nomenclatura de monetização:** specs 001/002 foram escritas na fase AdSense;
  a spec 003 introduziu o Adsterra. Ao ler 001/002, considere AdSense como o
  desenho anterior e Adsterra como o runtime atual
  (ver [`../.specify/memory/constitution.md`](../.specify/memory/constitution.md)).
- **Não renomear pastas de spec:** os nomes são referenciados por
  `.specify/feature.json`, `AGENTS.md` e pela numeração do Spec Kit.

## Constituição

Os princípios de produto, monetização, LGPD e performance vivem em
[`../.specify/memory/constitution.md`](../.specify/memory/constitution.md) e
devem ser checados por toda feature nova.
