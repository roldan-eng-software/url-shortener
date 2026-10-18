# Plano LGPD do URLEncurta

**Atualizado em**: 2026-10-18  
**Status**: baseline técnico implementado; revisão jurídica formal ainda recomendada.

## Objetivo

Manter o URLEncurta compatível com a LGPD por meio de transparência, minimização
de dados, controle de cookies não essenciais, documentação de terceiros e canal
para exercício de direitos do titular.

## Escopo de dados

O sistema trata:

- URLs originais, códigos curtos, QR Codes, aliases, cliques e métricas agregadas.
- Dados de conta: email, senha em hash, status Premium e identificadores Stripe.
- Dados de páginas de bio: handle, título, descrição, links e métricas.
- Dados de leads comerciais: nome, email, empresa, telefone, interesse e mensagem.
- Dados técnicos de segurança: IP, origem, rate limit, eventos de abuso e logs.
- Preferências locais de cookies para analytics e publicidade.

## Bases legais por finalidade

| Finalidade                                              | Base legal operacional                                 |
| ------------------------------------------------------- | ------------------------------------------------------ |
| Encurtamento, redirecionamento, QR Code e conta         | Execução de contrato/procedimentos preliminares        |
| Segurança, antifraude, antiabuso e reputação do domínio | Legítimo interesse e prevenção a fraudes               |
| Analytics                                               | Consentimento por preferência granular                 |
| Publicidade/Adsterra                                    | Consentimento por preferência granular e rota elegível |
| Premium e pagamentos                                    | Execução de contrato e obrigação legal                 |
| Leads e comunicações comerciais                         | Consentimento ou solicitação do titular                |
| Solicitações LGPD                                       | Cumprimento de obrigação legal/regulatória             |

## Cookies

O banner deve oferecer:

- Aceitar todos.
- Rejeitar cookies não necessários.
- Gerenciar por categoria.
- Alterar preferências depois da primeira escolha.

Categorias:

- **Necessários**: autenticação, segurança, tema e operação básica. Sempre ativos.
- **Analytics**: Google Analytics e eventos de conversão. Desativados por padrão.
- **Publicidade**: Adsterra em superfícies editoriais elegíveis. Desativados por padrão.

O sistema não deve tratar navegação contínua como consentimento para cookies não
necessários.

## Terceiros

- **Google Analytics**: carregado apenas após aceite de analytics.
- **Adsterra**: carregado apenas após aceite de publicidade e somente em
  páginas autorizadas pela política de superfícies.
- **Stripe**: checkout e assinatura Premium.
- **Neon/Vercel**: banco de dados, hospedagem e execução da aplicação.

Novos terceiros exigem atualização da Política de Privacidade, dos specs e do
inventário de tratamento.

## Direitos do titular

O sistema mantém endpoint e formulário para registrar:

- Acesso.
- Correção.
- Eliminação.
- Portabilidade.
- Oposição.
- Revogação de consentimento.
- Informação sobre compartilhamento.

As solicitações são registradas em `privacy_requests` com status inicial `new`.
O atendimento operacional deve ocorrer pelo email informado pelo titular.

## Retenção

- Links: enquanto ativos ou até exclusão aplicável.
- Conta/Premium: enquanto a conta existir e por prazo legal quando aplicável.
- Leads: até 24 meses ou até pedido de exclusão.
- Solicitações LGPD: pelo prazo necessário para comprovar atendimento.
- Métricas agregadas: pelo tempo necessário para estatística, segurança e melhoria.

## Checklist operacional

- [x] Política de Privacidade cobre dados, bases legais, terceiros, retenção e direitos.
- [x] Termos não tratam navegação contínua como consentimento para cookies.
- [x] Banner possui rejeição e granularidade.
- [x] Google Analytics é bloqueado antes do aceite.
- [x] Adsterra é bloqueado antes do aceite e segue restrições de rota.
- [x] Solicitações LGPD podem ser registradas.
- [ ] Revisão jurídica formal.
- [ ] Processo interno documentado para responder e concluir solicitações.
- [ ] Rotina operacional para exclusão/anonimização por tipo de dado.

## Specs relacionados

- `specs/001-adsense-business-plan/`: regras de monetização e superfícies.
- `specs/002-lgpd-compliance/`: implementação de consentimento, disclosures e direitos.
