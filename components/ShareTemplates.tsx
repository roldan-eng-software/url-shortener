'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, MessageCircle, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareTemplatesProps {
  shortUrl: string;
}

interface ShareTemplate {
  id: string;
  label: string;
  text: string;
  recommended?: boolean;
}

function getShareTemplates(shortUrl: string): ShareTemplate[] {
  return [
    {
      id: 'branded',
      label: 'Recomendado',
      text: `Confira este link encurtado: ${shortUrl} feito com URLencurta!`,
      recommended: true,
    },
    {
      id: 'simple',
      label: 'Simples',
      text: `Confira este link: ${shortUrl}`,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      text: `Oi! Separei este link para você: ${shortUrl}`,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      text: `Link disponível aqui: ${shortUrl}`,
    },
    {
      id: 'offer',
      label: 'Oferta',
      text: `Acesse aqui a novidade/oferta: ${shortUrl}`,
    },
  ];
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}

export function ShareTemplates({ shortUrl }: ShareTemplatesProps) {
  const [copiedTemplate, setCopiedTemplate] = useState('');
  const templates = useMemo(() => getShareTemplates(shortUrl), [shortUrl]);
  const recommendedTemplate = templates.find((template) => template.recommended) || templates[0];
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(recommendedTemplate.text)}`;

  const handleCopy = async (template: ShareTemplate) => {
    await copyToClipboard(template.text);
    setCopiedTemplate(template.id);
    setTimeout(() => setCopiedTemplate(''), 2200);
  };

  return (
    <div className="rounded-xl border border-success/20 bg-white/60 p-3 dark:bg-slate-900/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-text-secondary">
            <Share2 className="h-4 w-4 text-primary" />
            Textos prontos para compartilhar
          </p>
          <p className="mt-2 text-sm text-text">
            Copie uma mensagem e cole direto em WhatsApp, Instagram, X, email ou grupos.
          </p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-green-700"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>

      <div className="mt-4 grid gap-3">
        {templates.map((template) => {
          const isCopied = copiedTemplate === template.id;

          return (
            <div
              key={template.id}
              className={cn(
                'rounded-xl border bg-background p-3 transition',
                template.recommended ? 'border-primary/30' : 'border-border/70'
              )}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-bold',
                    template.recommended
                      ? 'bg-primary/10 text-primary'
                      : 'bg-border/50 text-text'
                  )}
                >
                  {template.label}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(template)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition',
                    isCopied
                      ? 'bg-success text-white'
                      : 'bg-surface text-title hover:bg-primary hover:text-white'
                  )}
                >
                  {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {isCopied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <p className="break-words text-sm font-medium leading-relaxed text-title">
                {template.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
