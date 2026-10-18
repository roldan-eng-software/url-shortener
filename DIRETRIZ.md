# Sistema de URL Shortener (Encurtador de URLs)

> **Status:** documento original de concepção do projeto. Para o estado atual da
> stack, das rotas e do banco, consulte [`README.md`](README.md),
> [`docs/architecture.md`](docs/architecture.md) e
> [`specs/README.md`](specs/README.md). O schema definitivo de dados é
> [`lib/db/schema.ts`](lib/db/schema.ts).

## 1. Visão Geral do Projeto

Desenvolver um sistema de encurtamento de URLs (URL Shortener) como MicroSaaS, utilizando as seguintes tecnologias:

- **Frontend e Backend**: Next.js 16 com App Router
- **Hospedagem**: Vercel
- **Banco de Dados**: Neon (PostgreSQL serverless)
- **ORM**: Drizzle ORM
- **Estilização**: Tailwind CSS
- **Linguagem**: TypeScript

O sistema deve permitir que usuários encurtem URLs longas em códigos curtos e únicos, com redirecionamento rápido e estatísticas básicas de cliques.

### 1.1. Constituição de Monetização e Crescimento

A direção futura do produto é definida pela constituição em
`.specify/memory/constitution.md`: o encurtador gratuito é o motor de
viralização e aquisição; páginas editoriais e informativas podem monetizar via
Adsterra; rotas privadas, legais, transacionais, APIs, preview e
redirecionamentos não devem exibir anúncios. Qualquer planejamento futuro deve
preservar o fluxo gratuito, validar LGPD/segurança, proteger performance e
explicitar como contribui para SEO, compartilhamento, retenção ou receita.

## 2. Requisitos Funcionais

### 2.1. Funcionalidades Obrigatórias (MVP)

1. **Criação de URL Encurtada**
   - Campo de entrada para URL original (validação de URL válida obrigatória)
   - Geração automática de código curto único (6 caracteres alfanuméricos)
   - Exibição da URL encurtada após criação
   - Botão de copiar para área de transferência

2. **Redirecionamento**
   - Rota dinâmica `/[shortCode]` para capturar códigos curtos
   - Redirecionamento 301 (permanente) para URL original
   - Incremento do contador de cliques a cada acesso
   - Tratamento de erros para códigos inválidos ou expirados

3. **Página Inicial**
   - Design limpo e responsivo
   - Formulário central para entrada de URL
   - Histórico das últimas 5 URLs criadas (armazenado em localStorage)
   - Estatísticas simples (total de URLs criadas, total de cliques)

### 2.2. Funcionalidades Opcionais (Versão Premium Futura)

- Autenticação de usuários (próxima fase)
- Dashboard pessoal com histórico completo
- URLs customizadas (código personalizado)
- Links com data de expiração
- Geração de QR Code
- Bio links (mini Linktree)

## 3. Requisitos Técnicos

### 3.1. Estrutura do Banco de Dados (Neon/Drizzle)

```typescript
// Schema para o banco de dados PostgreSQL

// Tabela: urls
table.urls {
  id: uuid (primary key, default: uuid_generate_v4())
  originalUrl: text (not null)
  shortCode: varchar(10) (unique, not null)
  clicks: integer (default: 0)
  createdAt: timestamp (default: now())
  expiresAt: timestamp (nullable, opcional para futura implementação)
  userId: uuid (nullable, para futura autenticação)
}

3.2. Estrutura de Pastas do Projeto

/app
  /api
    /urls
      /route.ts          (POST - criar nova URL)
      /[shortCode]
        /route.ts        (GET - redirecionar)
        /stats
          /route.ts      (GET - estatísticas)
  /page.tsx              (Página inicial)
  /layout.tsx            (Layout principal)
  /globals.css           (Estilos globais)

/components
  /UrlForm.tsx           (Formulário de encurtamento)
  /UrlResult.tsx         (Exibição do resultado + cópia)
  /QrCodeModal.tsx       (Modal de QR Code)
  /ShareTemplates.tsx    (Modelos de mensagem para compartilhamento)
  /Navbar.tsx            (Navegação)
  /Adsterra.tsx          (Slots de anúncio com classificação de rota)
  /admin/ /bio/ /dashboard/  (componentes por área)

/lib
  /db.ts                 (Configuração do banco)
  /url.ts                (Funções utilitárias para URLs)
  /utils.ts              (Funções auxiliares)

/types
  /index.ts              (TypeScript interfaces)

3.3. API Endpoints
Método	Rota	Descrição	Retorno
POST	/api/urls	Criar nova URL encurtada	{ shortCode, shortUrl, originalUrl }
GET	/api/urls/[shortCode]	Obter info da URL	{ originalUrl, clicks } ou 404
GET	/[shortCode]	Redirecionar para URL original	Redirect 301
3.4. Regras de Negócio
Validação de URL: Accept apenas URLs válidas com http:// ou https://
Código único: Usar nanoid ou crypto para gerar códigos de 6 caracteres
Código único no banco: Verificar duplicata antes de inserir
Redirecionamento: Usar Response.redirect() com status 301
Limite de URL: Máximo de 2048 caracteres para URL original
4. Requisitos Não Funcionais
4.1. Performance
Tempo de carregamento da página inicial: < 2 segundos
Redirecionamento: < 100ms de latência
Tempo de resposta da API: < 500ms
4.2. Responsividade
Design Mobile-First
Compatibilidade com: Chrome, Firefox, Safari, Edge
Layout responsivo: Mobile (< 640px), Tablet (640-1024px), Desktop (> 1024px)
4.3. SEO
Meta tags adequadas para compartilhamento
Open Graph tags para preview em redes sociais
sitemap.xml e robots.txt básicos
4.4. Segurança
Sanitização de inputs para prevenir XSS
Validação rigorosa de URLs no servidor
Rate limiting básico (máx. 10 requisições por minuto por IP)
5. Design e UI/UX
5.1. Paleta de Cores

--primary: #2563eb        (Azul - cor principal)
--primary-hover: #1d4ed8  (Azul escuro - hover)
--secondary: #64748b       (Cinza - texto secundário)
--background: #f8fafc      (Fundo claro)
--surface: #ffffff        (Superfície branca)
--success: #22c55e        (Verde - sucesso)
--error: #ef4444          (Vermelho - erro)
--border: #e2e8f0         (Bordas)

5.2. Tipografia
Fonte principal: Inter (Google Fonts)
Headings: font-weight 700
Body: font-weight 400
Tamanhos: h1 (2.5rem), h2 (1.875rem), body (1rem), small (0.875rem)
5.3. Componentes UI
UrlForm: Input grande e destacado com botão de submit
UrlResult: Card mostrando URL curta com botões de copiar, QR Code e compartilhar
QrCodeModal: Modal com o QR Code gerado para o link
ShareTemplates: Sugestões de mensagem para WhatsApp/redes
6. Configuração de Ambiente
6.1. Variáveis de Ambiente (.env.local)
# Banco de dados Neon
DATABASE_URL="postgresql://usuario:senha@host.neon.tech/db?sslmode=require"

# URL base do aplicativo
NEXT_PUBLIC_APP_URL="http://localhost:3000"

6.2. Dependencies Principais
{
  "dependencies": {
    "next": "^16.2.4",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "next-auth": "^5.0.0-beta.31",
    "drizzle-orm": "^0.45.1",
    "@neondatabase/serverless": "^1.0.2",
    "stripe": "^17.5.0",
    "zod": "^4.4.1",
    "nanoid": "^5.1.6",
    "qrcode": "^1.5.4",
    "lucide-react": "^0.576.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.5.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.31.10",
    "typescript": "^5.9.3",
    "@types/node": "^25.3.3",
    "@playwright/test": "^1.58.2",
    "eslint": "^9.39.4",
    "autoprefixer": "^10.4.27",
    "postcss": "^8.5.12",
    "tailwindcss": "^3.4.19"
  }
}

7. Critérios de Aceitação
7.1. Funcionalidade
 Usuário consegue criar uma URL encurtada inserir uma URL válida
 Sistema gera código curto único de 6 caracteres
 Usuário consegue copiar a URL encurtada com um clique
 Ao acessar a URL encurtada, ocorre redirecionamento para URL original
 Contador de cliques incrementa corretamente
 URL inválida mostra mensagem de erro clara
7.2. Technical
 Deploy na Vercel funciona sem erros
 Conexão com Neon está funcionando
 Não há erros de TypeScript ou warnings críticos
 Lighthouse score > 90 em Performance, Accessibility, Best Practices, SEO
7.3. UI/UX
 Design responsivo funciona em mobile, tablet e desktop
 Animações suaves de transição
 Feedback visual claro para todas as ações do usuário
 Loading states apropriados durante carregamentos
8. Observações Importantes
Este é um MVP (Minimum Viable Product) focado em simplicidade
O código deve ser limpo, modularizado e bem comentado
Usar Server Actions do App Router (Next.js 16) em vez de API routes onde apropriado
Implementar tratamento de erros adequado em todas as operações
O projeto deve estar pronto para扩展 (escalabilidade) futuras


---

## Instruções Adicionais para o Agente
Para executar este projeto, siga os passos:

1.
Criar projeto Next.js:

npx create-next-app@latest url-shortener --typescript --tailwind --eslint
2.
Instalar dependências:

npm install drizzle-orm @neondatabase/serverless nanoid clsx tailwind-merge

npm install -D drizzle-kit
3.
Configurar banco de dados:
Criar projeto no Neon.tech
Copiar connection string
Adicionar ao .env.local
4.
Configurar Drizzle:
Criar drizzle.config.ts
Criar schema em /lib/db/schema.ts
Executar: npx drizzle-kit push
5.
Executar desenvolvimento:

npm run dev
6.
Deploy na Vercel:
Conectar repositório GitHub
Adicionar variáveis de ambiente
Fazer deploy automático
```
