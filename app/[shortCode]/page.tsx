'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdRectangle } from '@/components/Adsense';
import { ExternalLink, Shield, Clock, AlertTriangle } from 'lucide-react';

interface UrlData {
  originalUrl: string;
  shortCode: string;
}

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const shortCode = params.shortCode as string;
  
  const [countdown, setCountdown] = useState(5);
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

    // Enable skip button after 2 seconds
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 2000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-redirect after countdown
    const redirectTimer = setTimeout(() => {
      if (urlData?.originalUrl) {
        window.location.href = urlData.originalUrl;
      }
    }, 5000);

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

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Você está sendo redirecionado
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Aguarde alguns segundos para acessar o destino
        </p>
      </div>

      {/* Destination Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <ExternalLink className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Destino do link:
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {getDomain(urlData?.originalUrl || '')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
              {urlData?.originalUrl}
            </p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Verificamos que este link é seguro</span>
          </div>
        </div>
      </div>

      {/* AdSense Banner */}
      <div className="mb-6">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-2">
          Patrocinado
        </p>
        <AdRectangle />
      </div>

      {/* Countdown & Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-lg font-semibold text-blue-800 dark:text-blue-200">
            Redirecionando em {countdown} segundos...
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
          />
        </div>

        <button
          onClick={handleSkip}
          disabled={!canSkip}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${
            canSkip
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {canSkip ? 'Ir agora →' : 'Aguarde...'}
        </button>

        {!canSkip && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Botão liberado em breve
          </p>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Este redirecionamento é protegido pelo{' '}
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            URLEncurta
          </Link>
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Código: <span className="font-mono">{shortCode}</span>
        </p>
      </div>
    </div>
  );
}
