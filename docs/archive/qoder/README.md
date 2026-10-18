# Arquivado — regras do Qoder

Estes arquivos eram as regras do agente **Qoder** (`.qoder/rules/*.mdc`). O Qoder
não é mais utilizado neste projeto, então as regras foram **arquivadas** aqui em
2026-10-18.

## Por que estão desatualizadas

- Descrevem **Next.js 15** / Prisma e caminhos `/src/components`, `/hooks`,
  `/services`, que não correspondem ao projeto (Next.js 16, Drizzle, `/components`
  na raiz).
- Recomendam **Shadcn UI/Radix** e **Jest + React Testing Library**, enquanto o
  projeto usa Tailwind puro e **Playwright**.
- Contêm links internos quebrados (ex.: `curs or-rules.mdc`).

Mantidos apenas como referência histórica. **Não** devem ser seguidos como
instruções. Para orientações atuais, veja [`../../architecture.md`](../../architecture.md)
e [`../../../AGENTS.md`](../../../AGENTS.md).

Para decidir se algo aqui merece voltar como regra ativa, compare com o código
atual antes de restaurar.
