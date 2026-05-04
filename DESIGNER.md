# DESIGNER.md

Guia de arquitetura visual e layout da pagina principal do URLEncurta.

## Visao geral

A pagina principal fica em `app/page.tsx` e e montada com Next.js App Router. Ela e uma pagina client-side porque usa `useAuth`, `localStorage`, estado de historico e chamadas para buscar links do usuario.

O layout global vem de `app/layout.tsx`:

- `Navbar` fixa no topo com `sticky top-0 z-50`.
- `main` centralizado com `container mx-auto px-4 py-8 max-w-6xl flex-1`.
- `Footer` global no fim da aplicacao.
- `CookieBanner`, `ConversionTracker`, `GoogleAnalytics` e `JsonLd` ficam no layout raiz.
- O `body` usa `min-h-screen`, `flex flex-col`, fundo por variavel CSS e suporte a tema claro/escuro.

Na home, os blocos sao organizados como uma landing page de conversao, mas com o encurtador como experiencia principal logo no primeiro viewport.

## Ordem das secoes da home

A ordem atual em `app/page.tsx` e:

1. `Hero`
2. `UseCases`
3. `ConversionBand`
4. `AdRectangle`
5. `Benefits`
6. `HowItWorks`
7. `Testimonials`
8. Secao condicional de historico com `UrlCard`
9. `Stats`
10. `CTAPremium`
11. `FAQ`
12. Rodape simples local com credito da Roldan Eng Software

Importante: alem desse rodape local da home, tambem existe o `Footer` global renderizado por `app/layout.tsx`.

## Sistema de layout

O padrao dominante e:

- Secoes em largura cheia com padding vertical entre `py-14` e `py-24`.
- Conteudo interno sempre centralizado com `container mx-auto px-4`.
- Largura maxima comum: `max-w-6xl`.
- Blocos mais estreitos usam `max-w-4xl` ou `max-w-3xl`.
- Grids responsivos com Tailwind:
  - `grid lg:grid-cols-[1.02fr_0.98fr]` no hero.
  - `grid sm:grid-cols-2 lg:grid-cols-3` em cards de uso, beneficios, passos e depoimentos.
  - `grid lg:grid-cols-[1fr_420px]` na faixa de conversao.

O mobile e tratado principalmente por classes responsivas (`sm:`, `md:`, `lg:`). Em telas pequenas, os grids viram coluna unica ou duas colunas quando faz sentido.

## Arquitetura do Hero

Arquivo: `components/Hero.tsx`

O hero e a principal area funcional da home. Ele usa:

- `section.relative.overflow-hidden.py-12.md:py-20.aurora-bg`
- Container interno `max-w-6xl`.
- Grid de duas colunas em desktop:
  - Coluna esquerda: badge, H1, subtitulo, CTAs e sinais de confianca.
  - Coluna direita: card do encurtador com `UrlForm`.
- Em mobile, o conteudo fica empilhado e centralizado.

O card do encurtador tem:

- `id="encurtar"` para ancora dos CTAs.
- Fundo `bg-surface`, borda `border-border`, raio `rounded-2xl`, sombra `shadow-card-xl`.
- Header com icone, selo "Sem cadastro obrigatorio", titulo e descricao.
- `UrlForm` como formulario principal.
- Mini grade de atributos: Cliques, QR Code e Seguro.

Abaixo do grid principal existe uma faixa de prova social numerica com 4 itens em `grid-cols-2 md:grid-cols-4`.

## Formulario de URL

Arquivo: `components/UrlForm.tsx`

O formulario usa uma pilha vertical (`space-y-5`) com:

- Campo de URL dentro de um wrapper flex com borda, raio `rounded-xl`, `shadow-glow` e estado `focus-within`.
- Botao "Colar" visivel apenas em `sm` ou maior.
- Botao de submit verde (`bg-success`) com altura minima de `52px`.
- Chips de URLs de exemplo em `rounded-full`.
- Controle de alias premium com estado bloqueado para usuario gratuito.
- Resultado renderizado abaixo via `UrlResult`.

O resultado (`components/UrlResult.tsx`) expande a propria area do formulario com:

- Caixa de sucesso.
- Link curto e botao copiar.
- QR Code automatico.
- Link para pagina de previa.
- Templates de compartilhamento.
- Estatisticas recolhaveis.

## Secoes de conteudo e conversao

### UseCases

Arquivo: `components/UseCases.tsx`

Secao em `bg-background` com titulo alinhado a esquerda e grade de seis cards. Os cards usam:

- `rounded-xl`
- `border border-border`
- `bg-surface`
- `p-5`
- hover com `border-primary/40` e `shadow-glow`

### ConversionBand

Arquivo: `components/ConversionBand.tsx`

Faixa escura de conversao com `bg-title text-white`. Em desktop, usa duas colunas:

- Texto, headline e bullets a esquerda.
- `LeadCaptureForm` e CTAs a direita.

O formulario de lead (`LeadCaptureForm`) e um card branco com `rounded-2xl`, `p-5` e sombra forte. Ele usa inputs com icones, grid de empresa/WhatsApp e select de objetivo.

### Benefits

Arquivo: `components/Benefits.tsx`

Secao em `bg-surface`, com cabecalho centralizado e grade responsiva de cards. Os cards ficam sobre `bg-background`, criando alternancia visual com a secao.

### HowItWorks

Arquivo: `components/HowItWorks.tsx`

Secao com `aurora-bg`, titulo centralizado e tres cards de passos. Em desktop, setas aparecem entre os passos; em mobile, as setas giram para indicar fluxo vertical.

### Testimonials

Arquivo: `components/Testimonials.tsx`

Secao tambem com `aurora-bg`. Usa tres cards de depoimentos e uma faixa textual de segmentos atendidos. Cards seguem o padrao `bg-surface`, borda, `rounded-2xl` e `shadow-card-lg`.

### CTAPremium

Arquivo: `components/CTAPremium.tsx`

Secao em `bg-surface` com card central `max-w-4xl`. O card usa gradiente de `primary` para `primary-hover`, `rounded-3xl`, texto branco e uma grade interna de beneficios premium. Tambem controla um modal de login/cadastro antes do checkout.

### FAQ

Arquivo: `components/FAQ.tsx`

Secao em `bg-surface` com container mais estreito (`max-w-3xl`). Cada pergunta e um accordion com:

- `bg-background`
- `rounded-xl`
- `border border-border`
- `overflow-hidden`
- transicao de altura entre `max-h-0` e `max-h-40`

## Historico e estatisticas

A secao de historico aparece apenas quando `displayHistory.length > 0`.

Ela usa:

- `section.py-16.bg-surface`
- Container `max-w-4xl`
- Header com titulo e selo Premium quando aplicavel.
- Lista vertical com `space-y-3`.
- Cards renderizados por `UrlCard`.

Regras de exibicao:

- Usuario logado: combina links do banco (`/api/user/links`) com historico local.
- Usuario anonimo: usa apenas `localStorage`.
- Usuario premium: ve todos os links.
- Usuario gratuito: ve ate 10 links e recebe aviso de upgrade se houver mais.

`Stats` renderiza duas metricas em grade de duas colunas, dentro de container `max-w-6xl`.

## Design tokens

Os tokens principais estao em `app/globals.css` e tambem espelhados em `tailwind.config.ts`.

### Cores claras

- `--primary`: `#6366F1`
- `--primary-hover`: `#4F46E5`
- `--primary-light`: `#A5B4FC`
- `--background`: `#F8FAFC`
- `--surface`: `#FFFFFF`
- `--border`: `#E2E8F0`
- `--title`: `#334155`
- `--text`: `#64748B`
- `--text-secondary`: `#94A3B8`
- `--success`: `#22C55E`
- `--error`: `#EF4444`
- `--warning`: `#F59E0B`

### Cores escuras

Quando `.dark` esta no `html`, as variaveis mudam para:

- `--background`: `#0F172A`
- `--surface`: `#1E293B`
- `--border`: `#334155`
- `--title`: `#F1F5F9`
- `--text`: `#94A3B8`
- `--text-secondary`: `#64748B`
- `--primary`: `#818CF8`

### Gradientes

- `--gradient-magic`: `linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)`
- `--gradient-aurora`: `linear-gradient(135deg, #A5B4FC 0%, #67E8F9 100%)`

Use `gradient-text`, `bg-gradient-magic` ou estilos inline existentes quando quiser manter a identidade atual.

## Tipografia

A fonte global e Inter, importada em `app/globals.css`.

Padroes:

- H1 do hero: `text-4xl md:text-5xl lg:text-6xl`, `font-bold`, `leading-tight`.
- H2 de secoes: geralmente `text-3xl md:text-4xl`, `font-bold`.
- Texto de apoio: `text-lg` ou `text-xl`, com cor `text-text`.
- Cards: titulos entre `text-lg` e `text-2xl`; descricoes em `text-sm`, `text-base` ou `text-lg`.

## Componentes utilitarios globais

`app/globals.css` define classes reutilizaveis:

- `.btn-primary`
- `.btn-secondary`
- `.card`
- `.input-field`
- `.gradient-text`
- `.aurora-bg`
- `.animate-float`
- `.animate-pulse-glow`
- `.shadows`, `.shadows-lg`, `.shadows-xl`

Na home atual, muitos componentes usam classes Tailwind diretamente, mas esses utilitarios continuam sendo a base visual do projeto.

## Tema claro e escuro

O tema e controlado por classe `dark` no `html`.

Fluxo:

- `app/layout.tsx` injeta um script antes da hidratacao para ler `localStorage.theme`.
- Se nao houver tema salvo, usa `prefers-color-scheme`.
- `Navbar` usa `useTheme` para alternar entre claro, escuro e sistema.
- As cores dos componentes dependem de variaveis CSS e classes Tailwind configuradas.

Ao criar novos blocos, prefira `bg-background`, `bg-surface`, `border-border`, `text-title`, `text-text` e `text-text-secondary`.

## Responsividade

Breakpoints configurados em `tailwind.config.ts`:

- `xs`: `480px`
- `sm`: `640px`
- `md`: `768px`
- `lg`: `1024px`
- `xl`: `1280px`
- `2xl`: `1536px`

Padroes de comportamento:

- Mobile primeiro.
- Layouts de duas ou tres colunas so aparecem a partir de `sm`, `md` ou `lg`.
- CTAs frequentemente usam `w-full sm:w-auto` para ocupar a largura no mobile.
- Containers recebem `px-4`; existe regra global que reforca padding da `.container` abaixo de `768px`.

## Anuncios

Arquivo: `components/Adsense.tsx`

Na home, `AdRectangle` entra apos `ConversionBand`. Enquanto os slots forem placeholders (`123456...`) ou houver erro, o componente renderiza um bloco tracejado com texto "Espaco Publicitario".

Dimensoes relevantes:

- Rectangle: `300px x 250px`
- Leaderboard: `728px x 90px`
- Display: largura total

## Cuidados ao alterar o layout

- Manter o `id="encurtar"` no card do hero, pois varios CTAs apontam para essa ancora.
- Preservar o encurtador no primeiro viewport: ele e a acao principal da pagina.
- Usar containers `max-w-6xl` para novas secoes largas e `max-w-3xl` ou `max-w-4xl` para conteudo focado.
- Alternar fundos entre `bg-background`, `bg-surface`, `aurora-bg` e faixas escuras para manter ritmo visual.
- Validar claro e escuro ao mexer em cor, porque boa parte do tema depende de variaveis CSS.
- Evitar criar novos tokens inline quando ja existir variavel ou cor Tailwind equivalente.
- Se remover o rodape local da home, conferir se o credito da Roldan Eng Software ainda deve existir em outro lugar.
