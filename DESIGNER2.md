# DESIGNER2.md

Especificacao tecnica sugerida para uma nova arquitetura de layout da pagina principal do URLEncurta.

Este documento descreve uma proposta futura de redesign da home com foco em:

- Experiencia mobile-first.
- Uso gratuito simples e direto.
- Visual mais clean, minimalista e confiavel.
- Melhor estrutura para monetizacao com Google AdSense.
- Reducao de informacoes repetitivas ou cansativas.

## Objetivo do novo layout

A home deve funcionar primeiro como ferramenta, depois como pagina informativa.

O usuario ideal chega com uma intencao clara: colar uma URL, gerar um link curto e copiar o resultado. Todo o layout deve favorecer essa acao antes de apresentar recursos extras, premium, depoimentos ou conteudos explicativos.

Direcao principal:

- Primeiro viewport com formulario de encurtar em destaque.
- Textos curtos e funcionais.
- Menos secoes.
- Mais respiro visual.
- Espacos de anuncio previsiveis e bem integrados.
- Interface rapida de entender em mobile, tablet e desktop.

## Nova arquitetura da pagina

Ordem recomendada para `app/page.tsx`:

1. `HeroShortener`
2. `AdSlotTop`
3. `CoreBenefits`
4. `HowItWorksCompact`
5. `UrlHistorySection`, condicional
6. `AdSlotMiddle`
7. `FaqCompact`
8. `PremiumMiniCta`
9. `AdSlotBottom`, opcional
10. Footer global

Secoes que podem ser removidas da home principal:

- `Testimonials`
- `ConversionBand`
- `UseCases` no formato atual
- `Stats`, se continuar mostrando dados pouco relevantes ou zerados
- Rodape local duplicado dentro de `app/page.tsx`

Secoes que podem ser mantidas, mas redesenhadas:

- `Hero`, transformado em `HeroShortener`
- `Benefits`, transformado em `CoreBenefits`
- `HowItWorks`, transformado em `HowItWorksCompact`
- `FAQ`, transformado em `FaqCompact`
- `CTAPremium`, transformado em `PremiumMiniCta`
- `AdRectangle`, transformado em um sistema mais previsivel de slots

## Layout geral

O layout deve continuar usando o `RootLayout` atual:

- `Navbar`
- `main`
- `Footer`
- `CookieBanner`
- Providers e scripts globais

Recomendacao para o `main`:

- Evitar que o `main` force padding vertical grande em todas as paginas da home.
- A home pode controlar seu proprio espacamento por secao.
- O container interno padrao deve continuar em `max-w-6xl`.

Padrao de containers:

- Pagina inteira: fundo `bg-background`.
- Secoes principais: largura cheia.
- Conteudo interno: `container mx-auto px-4 max-w-6xl`.
- Secoes de texto estreito: `max-w-3xl`.
- Formularios e blocos principais: `max-w-2xl` no mobile/tablet e parte de grid no desktop.

## Estrutura responsiva mobile-first

### Mobile

Prioridades:

- Formulario acima de qualquer conteudo longo.
- Um unico eixo vertical.
- Poucos cards por bloco.
- Ads com altura reservada para evitar deslocamento da pagina.
- Botao principal sempre grande e facil de tocar.

Comportamento recomendado:

- Hero em uma coluna.
- H1 com tamanho aproximado de `text-3xl`.
- Subtexto com `text-base`.
- Formulario em card simples ou diretamente em uma superficie branca.
- CTAs secundarios minimizados.
- Beneficios em lista vertical ou grid de uma coluna.
- FAQ com poucas perguntas.

### Tablet

Prioridades:

- Melhor aproveitamento horizontal sem densidade excessiva.
- Hero ainda pode ficar em uma coluna centralizada ou duas colunas leves, dependendo do espaco.
- Beneficios em duas colunas.
- Anuncios podem usar formato responsivo largo.

Comportamento recomendado:

- A partir de `md`, usar `grid-cols-2` para beneficios.
- Historico pode ficar em cards mais compactos.
- Ads podem usar largura maxima de `728px`, centralizados.

### Desktop

Prioridades:

- Hero em duas colunas.
- Formulario com destaque visual.
- Conteudo lateral apenas se ajudar a conversao.
- Ads integrados entre secoes, nao colados no formulario.

Comportamento recomendado:

- Hero com grid `lg:grid-cols-[0.9fr_1.1fr]` ou similar.
- Coluna esquerda: headline curta, descricao e sinais de confianca.
- Coluna direita: formulario.
- Beneficios em tres colunas.
- FAQ em container central estreito.

## Nova secao 1: HeroShortener

Objetivo: permitir que o usuario encurte um link imediatamente.

Conteudo recomendado:

- H1: "Encurte seu link gratis"
- Subtexto: "Cole uma URL e gere um link curto com QR Code em segundos."
- Formulario principal `UrlForm`.
- Linha curta de confianca:
  - "Sem cadastro obrigatorio"
  - "QR Code gratis"
  - "Historico no navegador"

Elementos que devem ser removidos do hero atual:

- Numeros de prova social, se nao forem dados reais validados.
- Segundo CTA grande para Premium no primeiro viewport.
- Textos longos sobre campanhas, vendas, TikTok, Instagram e WhatsApp.
- Mini grade repetitiva, caso os mesmos pontos ja estejam na linha de confianca.

Layout mobile:

- H1 e descricao no topo.
- Formulario logo abaixo.
- Linha de confianca abaixo do formulario ou abaixo do subtitulo.
- Tudo em uma coluna.

Layout desktop:

- Grid com texto a esquerda e formulario a direita.
- Formulario visualmente dominante.
- Altura do hero mais compacta que a atual.

Estilo:

- Fundo limpo em `bg-background`.
- Card do formulario em `bg-surface`.
- Borda sutil `border-border`.
- Sombra leve, nao pesada.
- Raio entre `rounded-xl` e `rounded-2xl`.

## Nova secao 2: AdSlotTop

Objetivo: monetizar apos o usuario ver a ferramenta principal.

Posicao:

- Logo abaixo do hero.
- Nunca acima do formulario no mobile.

Formato:

- Mobile: bloco responsivo com altura reservada entre `250px` e `320px`.
- Tablet/desktop: leaderboard ou responsivo largo centralizado.

Regras visuais:

- Reservar altura fixa minima para evitar layout shift.
- Usar label discreta, como "Publicidade", se necessario.
- Fundo transparente ou muito sutil.
- Margem vertical moderada.

## Nova secao 3: CoreBenefits

Objetivo: explicar rapidamente por que usar o servico gratuito.

Quantidade recomendada:

- 3 beneficios principais.
- No maximo 4, se houver uma justificativa forte.

Beneficios sugeridos:

1. "Gratuito e rapido"
   - "Crie links curtos sem cadastro obrigatorio."
2. "QR Code automatico"
   - "Cada link pode ser compartilhado tambem por QR Code."
3. "Historico simples"
   - "Acesse os ultimos links criados no navegador."
4. Opcional: "Links seguros"
   - "URLs sao validadas antes da criacao."

Layout:

- Mobile: lista vertical com icone pequeno.
- Tablet: duas colunas.
- Desktop: tres colunas.

Estilo:

- Cards menores que os atuais.
- Menos icones grandes.
- Menos emojis.
- Texto curto.
- Hover discreto.

## Nova secao 4: HowItWorksCompact

Objetivo: mostrar o fluxo em tres passos sem ocupar muito espaco.

Passos recomendados:

1. "Cole sua URL"
2. "Clique em encurtar"
3. "Copie e compartilhe"

Layout:

- Mobile: lista numerada vertical.
- Tablet/desktop: tres colunas simples.

Estilo:

- Numeros pequenos ou badges.
- Sem setas grandes.
- Sem cards muito altos.
- Secao com `bg-surface` para alternar com o fundo anterior.

## Nova secao 5: UrlHistorySection

Objetivo: manter o historico perto da ferramenta, pois ele faz parte da experiencia de uso.

Posicao:

- Depois de "Como funciona", ou antes se o usuario acabou de gerar um link.

Regra:

- Renderizar somente se houver historico.

Layout:

- Container `max-w-4xl`.
- Header simples: "Seus links recentes".
- Cards compactos com:
  - URL curta em destaque.
  - URL original truncada.
  - Botoes: copiar e QR Code.
  - Data em texto secundario.

Melhorias futuras:

- Reduzir altura de cada `UrlCard`.
- Usar icones em botoes para mobile, com label quando houver espaco.
- Evitar que URLs longas quebrem a composicao.

## Nova secao 6: AdSlotMiddle

Objetivo: monetizar no meio da leitura, depois que o usuario ja entendeu o servico.

Posicao recomendada:

- Depois do historico, se houver.
- Caso nao haja historico, depois de `HowItWorksCompact`.

Formato:

- Mobile: rectangle ou responsivo.
- Desktop: in-article ou leaderboard.

Regra:

- Nao colocar anuncio entre o input e o resultado.
- Nao colocar anuncio dentro do card do formulario.

## Nova secao 7: FaqCompact

Objetivo: responder duvidas essenciais sem alongar a pagina.

Quantidade recomendada:

- 4 perguntas.

Perguntas sugeridas:

1. "O URLEncurta e gratuito?"
2. "Preciso criar conta?"
3. "Os links expiram?"
4. "Posso gerar QR Code?"

Perguntas que podem sair da home:

- Perguntas muito especificas sobre Instagram bio.
- Perguntas repetidas sobre seguranca, se ja houver mencao em beneficios.
- Perguntas sobre estatisticas avancadas, que podem ficar na pagina Premium.

Layout:

- Accordion simples.
- Container `max-w-3xl`.
- Padding vertical menor que o atual.

## Nova secao 8: PremiumMiniCta

Objetivo: apresentar Premium sem competir com o uso gratuito.

Posicao:

- Perto do final da pagina.
- Depois da FAQ.

Conteudo recomendado:

- Titulo curto: "Quer links com sua marca?"
- Texto: "No Premium voce usa alias personalizado, historico completo e estatisticas avancadas."
- CTA: "Ver Premium"

Layout:

- Bloco horizontal em desktop.
- Bloco vertical compacto em mobile.
- Sem modal de login dentro da home, se possivel.
- Checkout e login podem ficar na pagina `/premium`.

Estilo:

- Fundo `bg-surface`.
- Borda `border-border`.
- Pequeno destaque em amarelo/laranja somente no selo ou botao.
- Evitar card grande com muitos beneficios.

## Nova secao 9: AdSlotBottom

Objetivo: monetizacao adicional para usuarios que chegam ao final.

Posicao:

- Antes do footer global.

Uso:

- Opcional.
- Deve ser removido se deixar a pagina pesada ou se conflitar com politicas/experiencia do AdSense.

## Estrategia de Google AdSense

Criar um sistema de componentes de anuncio mais estruturado.

Componentes sugeridos:

- `AdSlot`
- `AdSlotTop`
- `AdSlotMiddle`
- `AdSlotBottom`
- `AdPlaceholder`, apenas para ambiente de desenvolvimento ou slots nao configurados

Props recomendadas:

- `slot`
- `format`
- `className`
- `minHeight`
- `label`
- `responsive`

Formatos sugeridos:

- Topo: responsivo horizontal ou rectangle em mobile.
- Meio: in-article ou rectangle.
- Fim: responsivo.

Boas praticas:

- Reservar espaco antes do carregamento.
- Nao inserir anuncios dentro de componentes de acao principal.
- Evitar excesso de anuncios em telas pequenas.
- Garantir espacamento vertical ao redor dos ads.
- Usar placeholders somente quando necessario.

Distribuicao recomendada:

- Mobile: 2 ads principais.
- Desktop: 2 ads principais e 1 opcional no final.

## Paleta de cores proposta

A paleta atual pode ser mantida, mas refinada para parecer mais limpa e menos carregada.

### Tokens principais

- Background: `#F8FAFC`
- Surface: `#FFFFFF`
- Surface muted: `#F1F5F9`
- Border: `#E2E8F0`
- Title: `#0F172A`
- Text: `#475569`
- Text muted: `#94A3B8`

### Marca

- Primary: `#4F46E5`
- Primary hover: `#4338CA`
- Primary soft: `#EEF2FF`

### Acao gratuita

- Success: `#16A34A`
- Success hover: `#15803D`
- Success soft: `#DCFCE7`

### Premium

- Premium: `#F59E0B`
- Premium hover: `#D97706`
- Premium soft: `#FEF3C7`

### Erro e alerta

- Error: `#DC2626`
- Error soft: `#FEE2E2`
- Warning: `#F97316`
- Warning soft: `#FFEDD5`

## Uso recomendado das cores

- Botao principal gratuito: verde (`Success`).
- Links e destaques de interface: indigo (`Primary`).
- Fundo geral: cinza muito claro (`Background`).
- Cards: branco (`Surface`).
- Bordas: cinza claro (`Border`).
- Premium: amarelo/laranja, apenas em contexto premium.
- Evitar usar gradiente como padrao em todos os CTAs.
- Usar gradiente somente em pequenos momentos de marca ou premium.

## Tema escuro

Manter suporte ao tema escuro, mas simplificar contrastes.

Tokens escuros sugeridos:

- Background: `#0F172A`
- Surface: `#111827` ou `#1E293B`
- Surface muted: `#1F2937`
- Border: `#334155`
- Title: `#F8FAFC`
- Text: `#CBD5E1`
- Text muted: `#94A3B8`
- Primary: `#818CF8`
- Success: `#22C55E`
- Premium: `#FBBF24`

Regras:

- Evitar textos cinza muito apagados em fundo escuro.
- Garantir contraste dos botoes.
- Testar o formulario e os cards de anuncio nos dois temas.

## Tipografia proposta

Manter Inter como fonte principal.

Escala recomendada:

- H1 mobile: `text-3xl`
- H1 desktop: `text-5xl`
- H2 mobile: `text-2xl`
- H2 desktop: `text-3xl`
- Body: `text-base`
- Texto auxiliar: `text-sm`
- Labels e metadados: `text-xs`

Direcao:

- Menos texto em negrito.
- Titulos curtos.
- Descricoes de ate duas linhas quando possivel.
- Evitar paragrafos longos na home.

## Espacamento proposto

Padding vertical por tipo de secao:

- Hero: `py-10 md:py-14 lg:py-16`
- Secoes simples: `py-10 md:py-14`
- FAQ/Premium: `py-10 md:py-16`
- Ads: margem vertical entre `my-6` e `my-10`

Cards:

- Mobile: `p-4`
- Desktop: `p-5` ou `p-6`
- Radius: `rounded-xl` como padrao
- Radius maior (`rounded-2xl`) somente para formulario principal ou blocos especiais

## Componentes e padroes visuais

### Botoes

Botao primario gratuito:

- Fundo verde.
- Texto branco.
- Altura minima de toque: `48px` a `52px`.
- Icone opcional.
- Texto direto: "Encurtar gratis".

Botao secundario:

- Fundo branco ou transparente.
- Borda cinza.
- Texto indigo ou slate.

Botao premium:

- Fundo premium ou borda premium.
- Usar com moderacao.

### Inputs

Padrao:

- Altura minima `52px`.
- Borda `border-border`.
- Fundo `bg-surface`.
- Foco com borda primary e ring suave.
- Placeholder curto: "Cole sua URL aqui".

### Cards

Padrao:

- Fundo `bg-surface`.
- Borda `border-border`.
- Radius `rounded-xl`.
- Sombra leve ou nenhuma sombra.
- Hover sutil apenas em desktop.

Evitar:

- Cards muito grandes para informacoes secundarias.
- Multiplos cards dentro de cards.
- Gradientes decorativos em excesso.

## Copy e conteudo

Tom recomendado:

- Direto.
- Simples.
- Focado na acao.
- Sem excesso de promessa comercial.

Exemplos de copy:

- "Encurte seu link gratis"
- "Cole uma URL e gere um link curto com QR Code em segundos."
- "Sem cadastro obrigatorio."
- "Copie, compartilhe e acompanhe seus links recentes."

Conteudos a reduzir:

- Listas extensas de casos de uso.
- Provas sociais ficticias ou nao auditadas.
- Depoimentos genericos.
- Textos repetidos sobre campanhas e vendas.
- CTAs premium repetidos em muitas secoes.

## SEO e conteudo minimo

Mesmo com layout mais enxuto, manter informacoes suficientes para SEO.

Elementos importantes:

- H1 claro com termo principal: "Encurte seu link gratis" ou "Encurtador de URL gratis".
- Um paragrafo curto explicando o servico.
- Secao de FAQ com perguntas relevantes.
- Texto suficiente para indexacao, sem cansar o usuario.
- Metadados existentes em `app/layout.tsx` e `Head` da home devem ser revisados para evitar duplicidade.

## Acessibilidade

Requisitos:

- Inputs com labels ou `aria-label`.
- Botoes com texto claro.
- Icones decorativos com tratamento adequado.
- Contraste suficiente nos dois temas.
- Estados de foco visiveis.
- Areas clicaveis com tamanho minimo confortavel.
- Accordions com estado claro de aberto/fechado.

## Performance visual

Pontos importantes:

- Reservar altura dos anuncios.
- Evitar grandes blocos que mudam a altura apos hidratacao.
- Manter formulario leve.
- Evitar animacoes excessivas.
- Reduzir sombras pesadas.
- Evitar imagens desnecessarias na home.

## Estado final esperado

A nova home deve parecer:

- Mais curta.
- Mais objetiva.
- Mais confiavel.
- Menos cansativa.
- Mais preparada para AdSense.
- Melhor no celular.
- Mais focada no uso gratuito.

Fluxo ideal do usuario:

1. Entra na pagina.
2. Ve imediatamente o campo para colar URL.
3. Encurta o link.
4. Copia ou abre QR Code.
5. Visualiza anuncio sem perder contexto.
6. Entende rapidamente os beneficios.
7. Consulta FAQ ou Premium apenas se precisar.

## Checklist para implementacao futura

- Criar ou adaptar `HeroShortener`.
- Simplificar `UrlForm` visualmente sem alterar comportamento principal.
- Reposicionar historico para perto da ferramenta.
- Criar sistema de `AdSlot` com alturas reservadas.
- Substituir secoes longas por `CoreBenefits`, `HowItWorksCompact` e `FaqCompact`.
- Remover `Testimonials` da home.
- Remover ou reduzir `ConversionBand`.
- Transformar `CTAPremium` em bloco compacto.
- Remover rodape local duplicado da home, se confirmado.
- Revisar tokens de cor em `globals.css` e `tailwind.config.ts`.
- Validar layout em mobile, tablet e desktop.
- Validar tema claro e escuro.
- Validar que anuncios nao interferem no formulario nem no resultado.
