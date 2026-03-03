'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AdRectangle, AdLeaderboard } from '@/components/Adsense';
import { Shield, Clock, AlertTriangle, CheckCircle, Info, Lock, Globe, FileText } from 'lucide-react';

interface UrlData {
  originalUrl: string;
  shortCode: string;
}

export default function RedirectPage() {
  const params = useParams();
  const shortCode = params.shortCode as string;
  
  const [countdown, setCountdown] = useState(8);
  const [urlData, setUrlData] = useState<UrlData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const fetchUrlData = async () => {
      try {
        const response = await fetch(`/api/redirect/${shortCode}`, {
          method: 'POST',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'URL not found');
        }
        
        const data = await response.json();
        setUrlData({
          originalUrl: data.originalUrl,
          shortCode: shortCode,
        });
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load URL');
        setIsLoading(false);
      }
    };

    if (shortCode) {
      fetchUrlData();
    }
  }, [shortCode]);

  useEffect(() => {
    if (!urlData || error) return;

    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 3000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const redirectTimer = setTimeout(() => {
      if (urlData?.originalUrl) {
        window.location.href = urlData.originalUrl;
      }
    }, 8000);

    return () => {
      clearTimeout(skipTimer);
      clearInterval(countdownInterval);
      clearTimeout(redirectTimer);
    };
  }, [urlData, error]);

  const handleSkip = () => {
    if (urlData?.originalUrl) {
      window.location.href = urlData.originalUrl;
    }
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const getUrlProtocol = (url: string) => {
    try {
      return new URL(url).protocol;
    } catch {
      return 'https:';
    }
  };

  const isSecure = (url: string) => {
    return getUrlProtocol(url) === 'https:';
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">
            Link não encontrado
          </h1>
          <p className="text-red-600 dark:text-red-300 mb-4">
            {error === 'URL not found' 
              ? 'Este link encurtado não existe ou foi removido.' 
              : error}
          </p>
          <Link 
            href="/" 
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Criar novo link
          </Link>
        </div>
      </div>
    );
  }

  const destinationDomain = getDomain(urlData?.originalUrl || '');
  const isHttps = isSecure(urlData?.originalUrl || '');
  const countdownProgress = ((8 - countdown) / 8) * 100;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-4">
          <Globe className="w-4 h-4" />
          <span>Página de Redirecionamento Seguro</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Você está sendo redirecionado para:
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          <span className="font-semibold text-blue-600 dark:text-blue-400">{destinationDomain}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Destination Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${isHttps ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                <Lock className={`w-7 h-7 ${isHttps ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Destino do Link
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  URL: <span className="font-mono text-xs break-all">{urlData?.originalUrl}</span>
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${isHttps ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                    <CheckCircle className="w-3 h-3" />
                    {isHttps ? 'HTTPS Seguro' : 'HTTP Não Seguro'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <Shield className="w-3 h-3" />
                    Verificado
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Redirecionamento em:
                  </span>
                </div>
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {countdown}s
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${countdownProgress}%` }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  disabled={!canSkip}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${canSkip ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  {canSkip ? 'Acessar agora' : `Aguarde ${countdown}s`}
                </button>
                <Link href="/" className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
                  Voltar
                </Link>
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600" />
              Como verificar se um link é seguro?
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center text-sm font-bold text-indigo-600">1</div>
                <div>
                  <h4 className="font-medium text-sm">Verifique o domínio</h4>
                  <p className="text-xs text-gray-600 mt-1">Confirme se o site é conhecido e confiável.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center text-sm font-bold text-indigo-600">2</div>
                <div>
                  <h4 className="font-medium text-sm">Procure por HTTPS</h4>
                  <p className="text-xs text-gray-600 mt-1">Sites seguros exibem um cadeado no navegador.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center text-sm font-bold text-indigo-600">3</div>
                <div>
                  <h4 className="font-medium text-sm">Desconfie de ofertas</h4>
                  <p className="text-xs text-gray-600 mt-1">Promessas de ganhos fáceis são golpes.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center text-sm font-bold text-indigo-600">4</div>
                <div>
                  <h4 className="font-medium text-sm">Use antivírus</h4>
                  <p className="text-xs text-gray-600 mt-1">Mantenha seu software sempre atualizado.</p>
                </div>
              </div>
            </div>
          </div>

          {/* About URL Shortener */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              O que é um encurtador de URL?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Um encurtador de URL transforma links longos em endereços curtos e fáceis de compartilhar. 
              Por exemplo: <code className="bg-gray-100 px-1 rounded text-xs">loja.com/produto/12345</code> vira <code className="bg-gray-100 px-1 rounded text-xs">urle.io/Ab3x9</code>.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Benefícios:</strong> Links mais fáceis de compartilhar, estatísticas de cliques, 
              QR Codes automáticos e personalização para campanhas de marketing.
            </p>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Ad */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-center text-gray-500 mb-2">Publicidade</p>
            <AdRectangle />
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-4">Sobre este link</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-white/20">
                <span className="text-blue-100">Código:</span>
                <span className="font-mono">{shortCode}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/20">
                <span className="text-blue-100">Verificado:</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Sim</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-blue-100">Protocolo:</span>
                <span className="uppercase">{getUrlProtocol(urlData?.originalUrl || '').replace(':', '')}</span>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Perguntas frequentes</h3>
            <div className="space-y-3 text-sm">
              <details className="group">
                <summary className="flex justify-between cursor-pointer font-medium text-gray-700 hover:text-blue-600">
                  Por que preciso esperar?
                  <span className="group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="mt-2 text-xs text-gray-600">
                  A pausa permite verificar o destino e evitar acessos automáticos a sites maliciosos.
                </p>
              </details>
              <details className="group">
                <summary className="flex justify-between cursor-pointer font-medium text-gray-700 hover:text-blue-600">
                  Este link é seguro?
                  <span className="group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="mt-2 text-xs text-gray-600">
                  Verificamos links contra bancos de dados de sites maliciosos.
                </p>
              </details>
              <details className="group">
                <summary className="flex justify-between cursor-pointer font-medium text-gray-700 hover:text-blue-600">
                  Como encurtar meus links?
                  <span className="group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="mt-2 text-xs text-gray-600">
                  <Link href="/" className="text-blue-600 hover:underline">Clique aqui</Link> para criar links gratuitos!
                </p>
              </details>
            </div>
          </div>

          {/* Second Ad */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-xs text-center text-gray-500 mb-2">Patrocinado</p>
            <AdLeaderboard />
          </div>

          {/* Trust Badges */}
          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
            <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Protegido por:
            </h4>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Verificação automática</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> HTTPS obrigatório</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Anti-phishing</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Monitoramento 24/7</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          Protegido pelo <Link href="/" className="text-blue-600 hover:underline font-medium">URLEncurta</Link>
        </p>
        <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
          <Link href="/termos" className="hover:text-gray-600">Termos</Link>
          <span>•</span>
          <Link href="/privacidade" className="hover:text-gray-600">Privacidade</Link>
          <span>•</span>
          <Link href="/" className="hover:text-gray-600">Criar link</Link>
        </div>
      </div>
    </div>
  );
}
