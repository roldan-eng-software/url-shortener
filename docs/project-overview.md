# Visão do Produto — URLEncurta

_Última atualização: 2026-10-18_

## O que é

URLEncurta é um encurtador de URLs brasileiro operado como MicroSaaS. O produto
combina três camadas: um utilitário gratuito de baixa fricção (motor de
viralização), uma camada Premium para usuários recorrentes e uma camada de
receita por publicidade em páginas de conteúdo.

## Para quem é

- **Usuário casual:** precisa encurtar e compartilhar um link rapidamente, sem
  cadastro.
- **Profissional de marketing/PME:** precisa de alias de campanha, QR Code,
  métricas e histórico persistente (Premium).
- **Visitante de busca:** chega por artigos sobre links, QR Code, WhatsApp e
  segurança, e descobre o encurtador.

## O que o produto faz

### Fluxo gratuito (sem cadastro)

- Encurta uma URL válida (`http`/`https`, sem localhost/IPs privados) em um
  código de 6 caracteres.
- Copia o link curto e gera QR Code.
- Mantém um histórico local (localStorage) na página inicial.

### Redirecionamento

- A rota `/[shortCode]` mostra uma tela de **preview**: exibe o destino, o
  protocolo (HTTP/HTTPS) e um contador antes de redirecionar.
- O clique é contabilizado quando o preview resolve o código.
- Códigos inexistentes retornam erro; códigos de bio (`@handle`) renderizam a
  página de bio pública.

### Premium

- Cadastro/login, dashboard com histórico completo e busca.
- Alias/código customizado (validado contra palavras reservadas).
- QR Code salvo por link, estatísticas por link (cliques, geo, dispositivo,
  referrers) e páginas de bio (mini Linktree).
- Assinatura via Stripe com checkout e webhook de ciclo de vida.

### Admin

- Dashboard em `/admin` restrito a `is_admin`.
- Monitoramento de banco (contagem por tabela), gestão de clientes Premium com
  status de pagamento e link de WhatsApp, status do Stripe com receita/MRR e
  gestão de leads.
- Funil anônimo → Premium em `/admin/funnel` (conversão por etapa e por origem).

### Conteúdo (SEO) e monetização

- Páginas editoriais: `/como-funciona`, `/boas-praticas-url-curta`,
  `/links-para-whatsapp`, `/qr-code-para-links`, `/seguranca-em-links-curtos`.
- Anúncios do Adsterra apenas nessas páginas monetizáveis e na home, sempre
  após consentimento de cookies de publicidade.

## Modelo de negócio

| Camada   | Fonte de valor                  | Papel                   |
| -------- | ------------------------------- | ----------------------- |
| Gratuita | Encurtamento + QR Code          | Aquisição e viralização |
| Conteúdo | SEO + Adsterra                  | Receita por tráfego     |
| Premium  | Alias, métricas, bio, histórico | Receita recorrente      |

## Conformidade e confiança

- Banner de cookies granular e bloqueio de scripts de terceiros antes do aceite.
- Política de Privacidade, Termos e canal de direitos do titular (LGPD).
- Restrições de superfície publicitária para não interromper o fluxo principal
  nem expor rotas sensíveis.

## Documentos relacionados

- Arquitetura técnica: [`architecture.md`](architecture.md)
- Onboarding: [`../README.md`](../README.md)
- LGPD: [`../PLANO_LGPD.md`](../PLANO_LGPD.md)
- Specs e histórico de decisões: [`../specs/README.md`](../specs/README.md)
- Roadmap de conversão anônimo → Premium: [`prd/feature-conversao-e-retencao.md`](prd/feature-conversao-e-retencao.md)
- Constituição de produto: [`../.specify/memory/constitution.md`](../.specify/memory/constitution.md)
