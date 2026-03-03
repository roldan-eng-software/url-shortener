# Plano Completo de LGPD para URL Shortener
## Compatível com Google AdSense

---

## 1. Resumo Executivo

Este documento apresenta um plano de conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) para o URL Shortener, desenvolvido para:
- Manter total compatibilidade com Google AdSense
- Não impactar a monetização do site
- Cumprir com as obrigações legais brasileiras

### Ponto Crítico: LGPD vs GDPR
A LGPD brasileira é **menos restritiva** que o GDPR europeu:
- **LGPD**: Requer transparência e informação ao titular (não exige consentimento prévio explícito)
- **GDPR**: Exige consentimento prévio antes de qualquer coleta de dados

O Google AdSense já foi atualizado para LGPD e fornece opções de anúncios não personalizados automaticamente para usuários brasileiros.

---

## 2. Dados Coletados pelo Site

### 2.1 Dados do Usuário (coletados automaticamente)

| Dado | Finalidade | Base Legal | Retenção |
|------|------------|------------|-----------|
| Endereço IP (anonimizado) | Estatísticas, segurança, combate a abuso | Legítimo interesse | 12 meses |
| User-Agent (navegador) | Compatibilidade técnica | Legítimo interesse | Sessão |
| Cookies de sessão | Funcionamento do site | Legítimo interesse | Sessão |
| URL original submetida | Serviço de redirecionamento | Execução contractual | Até exclusão do link |
| Código curto gerado | Serviço de redirecionamento | Execução contractual | Até exclusão do link |
| Contador de cliques | Estatísticas do link | Legítimo interesse | Até exclusão do link |
| Data/hora do acesso | Estatísticas e segurança | Legítimo interesse | 12 meses |
| Referrer (URL de origem) | Estatísticas | Legítimo interesse | 12 meses |

### 2.2 Dados do Google AdSense (terceiros)

O Google AdSense coleta automaticamente:
- Cookies de publicidade (para anúncios personalizados ou não)
- Identificador de dispositivo
- Dados de navegação para segmentação de anúncios

**Importante**: O Google, como controlador, já possui termos de privacidade próprios e tratamento de dados para LGPD.

---

## 3. Base Legal para Tratamento

Conforme Art. 7º da LGPD, utilizaremos as seguintes bases:

1. **Execução de contrato** (Art. 7º, V)
   - Armazenamento da URL submetida para prestação do serviço de redirecionamento

2. **Legítimo interesse** (Art. 7º, IX)
   - Estatísticas de uso
   - Segurança e prevenção de fraudes
   - Melhoria do serviço

3. **Cumprimento de obrigação legal** (Art. 7º, II)
   - Obrigações fiscais e jurídicas

---

## 4. Implementação Técnica

### 4.1 Arquivos Necessários a Criar

```
/public
  /legal
    /privacy-policy.html    (Política de Privacidade)
    /terms-of-service.html  (Termos de Uso)
    /cookie-policy.html     (Política de Cookies)
    /lgpd-notice.html       (Aviso LGPD simplificado)

/app
  /privacy-policy
    /page.tsx              (Página de Política de Privacidade)
  /termos
    /page.tsx              (Página de Termos de Uso)
  /api
    /consent
      /route.ts            (API para registrar preferências de consentimento)
```

### 4.2 Componente de Banner de Cookies (Opcional)

Para Conformidade total, criar `/components/CookieBanner.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('lgpd_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const newPreferences = { necessary: true, analytics: true, marketing: true };
    setPreferences(newPreferences);
    localStorage.setItem('lgpd_consent', JSON.stringify({
      ...newPreferences,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    const newPreferences = { necessary: true, analytics: false, marketing: false };
    setPreferences(newPreferences);
    localStorage.setItem('lgpd_consent', JSON.stringify({
      ...newPreferences,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700 flex-1">
          <p>
            Utilizamos cookies para melhorar sua experiência. 
            <a href="/privacy-policy" className="text-blue-600 underline ml-1">Política de Privacidade</a>
            {' '}e
            <a href="/cookie-policy" className="text-blue-600 underline ml-1">Política de Cookies</a>.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={acceptNecessary}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Apenas necessários
          </button>
          <button
            onClick={acceptAll}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 4.3 Configuração do Google AdSense

O componente Adsense atual não precisa de alterações para LGPD. O Google trata automaticamente:

- Usuários do Brasil → Pode servir anúncios personalizados ou não
- A configuração de `data-npa-on-unknown-consent` não é necessária para Brasil

**NÃO ALTERE** o código do AdSense para non-personalized ads, pois isso reduzirá significativamente a monetização. O Google já faz isso automaticamente quando necessário.

### 4.4 Anonimização de IP no Google Analytics

Atualizar `/components/GoogleAnalytics.tsx` para anonimizar IPs:

```typescript
'use client';

import { useEffect } from 'react';

export function GoogleAnalytics() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
      // Configurar anonimização de IP para LGPD
      window.dataLayer = window.dataLayer || [];
      function gtag(){ window.dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        'anonymize_ip': true, // Anonimizar IP
        'ads_data_redaction': true, // Reduzir dados de anúncios
      });
    }
  }, []);

  return null;
}
```

---

## 5. Políticas Legais

### 5.1 Política de Privacidade

Criar `/public/legal/privacy-policy.html` com:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Política de Privacidade - URLEncurta</title>
</head>
<body>
    <h1>Política de Privacidade</h1>
    <p><strong>Última atualização:</strong> [DATA]</p>
    
    <h2>1. Introdução</h2>
    <p>A URLEncurta ("nós", "nosso") respeita sua privacidade e está comprometida em proteger seus dados pessoais.</p>
    
    <h2>2. Dados que Coletamos</h2>
    <ul>
        <li>URL submetida para encurtamento</li>
        <li>Dados de acesso (IP anonimizado, navegador, dispositivo)</li>
        <li>Cookies técnicos e de análise</li>
    </ul>
    
    <h2>3. Como Usamos Seus Dados</h2>
    <ul>
        <li>Fornecer o serviço de encurtamento de URLs</li>
        <li>Estatísticas de uso dos links</li>
        <li>Melhoria do serviço</li>
        <li>Segurança e prevenção de fraudes</li>
    </ul>
    
    <h2>4. Compartilhamento de Dados</h2>
    <p>Compartilhamos dados com:</p>
    <ul>
        <li><strong>Google AdSense</strong>: Para exibição de anúncios publicitários. O Google atua como controlador independente.</li>
        <li><strong>Google Analytics</strong>: Para análise de tráfego.</li>
    </ul>
    
    <h2>5. Seus Direitos (LGPD)</h2>
    <p>Você tem direito a:</p>
    <ul>
        <li>Confirmação da existência de tratamento</li>
        <li>Acesso aos dados</li>
        <li>Correção de dados incompletos ou desatualizados</li>
        <li>Anonimização, bloqueio ou eliminação de dados</li>
        <li>Portabilidade dos dados</li>
        <li>Eliminação dos dados tratados com consentimento</li>
        <li>Informação sobre compartilhamento</li>
        <li>Revogação do consentimento</li>
    </ul>
    
    <h2>6. Tempo de Retenção</h2>
    <p>Os dados são mantidos pelo tempo necessário para prestação do serviço, respeitando os prazos legais.</p>
    
    <h2>7. Contato</h2>
    <p>Para exercer seus direitos ou tirar dúvidas: [EMAIL]</p>
</body>
</html>
```

### 5.2 Termos de Uso

Criar `/public/legal/terms-of-service.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Termos de Uso - URLEncurta</title>
</head>
<body>
    <h1>Termos de Uso</h1>
    <p><strong>Última atualização:</strong> [DATA]</p>
    
    <h2>1. Aceitação dos Termos</h2>
    <p>Ao usar o URLEncurta, você concorda com estes termos.</p>
    
    <h2>2. Descrição do Serviço</h2>
    <p>Oferecemos serviço de encurtamento de URLs gratuito.</p>
    
    <h2>3. Uso Proibido</h2>
    <ul>
        <li>Links para conteúdo ilegal, violento ou pornográfico</li>
        <li>Spam ou phishing</li>
        <li>Conteúdo que viole direitos de terceiros</li>
        <li>Atividades maliciousas ou fraudulentas</li>
    </ul>
    
    <h2>4. Isenção de Responsabilidade</h2>
    <p>Não somos responsáveis pelo conteúdo das URLs compartilhadas.</p>
    
    <h2>5. Limitação de Uso</h2>
    <p>Reservamo-nos o direito de remover links que violem estes termos.</p>
</body>
</html>
```

### 5.3 Política de Cookies

Criar `/public/legal/cookie-policy.html`:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Política de Cookies - URLEncurta</title>
</head>
<body>
    <h1>Política de Cookies</h1>
    <p><strong>Última atualização:</strong> [DATA]</p>
    
    <h2>O que são cookies?</h2>
    <p>Cookies são pequenos arquivos de texto armazenados no seu dispositivo.</p>
    
    <h2>Cookies que Utilizamos</h2>
    
    <h3>Cookies Necessários</h3>
    <ul>
        <li><strong>Sessão</strong>: Necessários para funcionamento básico do site</li>
        <li><strong>Segurança</strong>: Protegem contra acessos não autorizados</li>
    </ul>
    
    <h3>Cookies de Terceiros</h3>
    <ul>
        <li><strong>Google AdSense</strong>: Para exibir anúncios. <a href="https://policies.google.com/technologies/ads">Política do Google</a></li>
        <li><strong>Google Analytics</strong>: Para análise de tráfego. <a href="https://policies.google.com/privacy">Política do Google</a></li>
    </ul>
    
    <h2>Gerenciando Cookies</h2>
    <p>Você pode configurar seu navegador para recusar cookies. Note que isso pode afetar funcionalidades do site.</p>
</body>
</html>
```

---

## 6. Atualização do Layout

Adicionar links no Footer/Navbar:

```typescript
// No componente Navbar ou Footer, adicionar:
<footer className="border-t py-4 mt-8">
  <div className="container mx-auto px-4 text-center text-sm text-gray-600">
    <p>&copy; {new Date().getFullYear()} URLEncurta. Todos os direitos reservados.</p>
    <div className="flex justify-center gap-4 mt-2">
      <a href="/privacy-policy" className="hover:underline">Política de Privacidade</a>
      <a href="/termos" className="hover:underline">Termos de Uso</a>
      <a href="/cookie-policy" className="hover:underline">Cookies</a>
    </div>
  </div>
</footer>
```

---

## 7. Direitos do Titular (LGPD)

### 7.1 Como Exercer

Criar página ou API para solicitações:

**Rota**: `/app/api/privacy/request/route.ts`

```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { type, email, data } = body;
  
  // Tipos de solicitação:
  // - access: Solicitar acesso aos dados
  // - correction: Solicitar correção
  // - deletion: Solicitar exclusão
  // - portability: Solicitar portabilidade
  
  // Registrar solicitação (em produção, salvar no banco)
  console.log('LGPD Request:', { type, email, data, timestamp: new Date() });
  
  // Responder em 15 dias (conforme LGPD)
  return NextResponse.json({
    success: true,
    message: 'Solicitação registrada. Responderemos em até 15 dias.',
    requestId: crypto.randomUUID(),
  });
}
```

### 7.2 Contato do Encarregado (DPO)

Incluir na Política de Privacidade:

```
Encarregado de Proteção de Dados (DPO)
Email: dpo@urlencurta.com
```

---

## 8. Cronograma de Implementação

| Fase | Tarefa | Prazo |
|------|--------|--------|
| 1 | Criar Política de Privacidade | 1 dia |
| 2 | Criar Termos de Uso | 1 dia |
| 3 | Criar Política de Cookies | 1 dia |
| 4 | Criar página de requisição de dados | 1 dia |
| 5 | Adicionar links no footer | 1 dia |
| 6 | Configurar GA para anonimização | 1 dia |
| 7 | (Opcional) Banner de cookies | 2 dias |
| 8 | Testes e validação | 1 dia |

---

## 9. Impacto no Google AdSense

### 9.1 O QUE FAZER:

- ✅ Manter o AdSense como está (funciona com LGPD)
- ✅ Publicar Política de Privacidade com link no site
- ✅ Configurar GA para anonimização de IP
- ✅ Incluir divulgação de uso de cookies de terceiros

### 9.2 O QUE NÃO FAZER:

- ❌ Não bloquear cookies do Google AdSense
- ❌ Não implementar consent mode para Brasil (desnecessário)
- ❌ Não forçar non-personalized ads (reduz receita)
- ❌ Não criar barreiras que atrapalhem carregamento dos anúncios

### 9.3 Por que isso funciona:

O Google AdSense já foi atualizado para LGPD em agosto de 2020. O Google:
- Oferece automaticamente opções de non-personalized ads para Brasil
- Trata dados conforme LGPD como controlador
- Não exige consentimento prévio do publisher para Brasil

---

## 10. Checklist de Conformidade

- [ ] Política de Privacidade publicada
- [ ] Termos de Uso publicados
- [ ] Política de Cookies publicada
- [ ] Links para políticas no rodapé
- [ ] Email de contato para LGPD visível
- [ ] Google Analytics com IP anonimizado
- [ ] Banco de dados com política de retenção
- [ ] Processo de exclusão de dados documentado

---

## 11. Referências

- LGPD: Lei nº 13.709/2018
- Google AdSense LGPD: https://support.google.com/adsense/answer/9928203
- Não-personalized ads: https://support.google.com/adsense/answer/9956024

---

**Nota importante**: Este plano foi elaborado para um URL Shortener sem autenticação de usuários. Se futuramente for implementada autenticação, será necessário expandir as medidas de conformidade.
