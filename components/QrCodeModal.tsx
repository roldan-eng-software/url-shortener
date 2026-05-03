'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Check,
  Clipboard,
  Copy,
  Download,
  ExternalLink,
  QrCode,
  X,
} from 'lucide-react';
import { generateQrCodeDataUrl } from '@/lib/qr';
import { cn } from '@/lib/utils';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export function QrCodeModal({ isOpen, onClose, url }: QrCodeModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (isOpen && url) {
      setLoading(true);
      generateQrCodeDataUrl(url)
        .then(setQrCodeUrl)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, url]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleDownload = async () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qrcode-${getQrFileName(url)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleCopyImage = async () => {
    if (!qrCodeUrl) return;
    
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = qrCodeUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }

    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md animate-in rounded-2xl bg-white shadow-2xl duration-200 fade-in zoom-in-95 dark:bg-slate-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-800 dark:hover:text-gray-200"
          aria-label="Fechar QR Code"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-4">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Código QR</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Pronto para aulas, PDFs, blogs, grupos e materiais impressos.
            </p>
          </div>

          <div className="flex justify-center mb-6">
            {loading ? (
              <div className="w-[260px] h-[260px] flex items-center justify-center bg-gray-50 rounded-xl">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="p-4 bg-white border-2 border-gray-100 rounded-xl">
                <Image
                  src={qrCodeUrl}
                  alt="QR Code"
                  width={260}
                  height={260}
                  unoptimized
                  className="w-[260px] h-[260px] rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-800">
            <p className="mb-1 text-center text-xs font-bold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
              Link do QR Code
            </p>
            <p className="break-all text-center text-sm font-medium text-gray-900 dark:text-gray-100">{url}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={handleDownload}
              disabled={loading || !qrCodeUrl}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all',
                downloaded
                  ? 'bg-success text-white'
                  : 'bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {downloaded ? (
                <>
                  <Check className="h-5 w-5" />
                  Baixado!
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Baixar PNG
                </>
              )}
            </button>
            <button
              onClick={handleCopyImage}
              disabled={loading || !qrCodeUrl}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all',
                copied
                  ? 'bg-success text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  Copiar imagem
                </>
              )}
            </button>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button
              onClick={handleCopyLink}
              className={cn(
                'flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium transition-all',
                linkCopied
                  ? 'bg-success text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700'
              )}
            >
              {linkCopied ? <Check className="h-5 w-5" /> : <Clipboard className="h-5 w-5" />}
              {linkCopied ? 'Link copiado' : 'Copiar link'}
            </button>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 font-medium text-gray-700 transition-all hover:border-primary/50 hover:text-primary dark:border-slate-700 dark:text-gray-200 dark:hover:border-primary/50"
            >
              <ExternalLink className="h-5 w-5" />
              Abrir link
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function getQrFileName(url: string) {
  try {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname.replace(/^\/+/, '').replace(/[^a-z0-9-]/gi, '-');
    return path || 'urlencurta';
  } catch {
    return 'urlencurta';
  }
}
