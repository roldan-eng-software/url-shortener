'use client';

import { useState, useEffect } from 'react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkId: string;
}

interface LinkStats {
  totalClicks: number;
  createdAt: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  topCountries: { country: string; clicks: number }[];
  topDevices: { device: string; clicks: number }[];
  topReferrers: { referrer: string; clicks: number }[];
}

export function StatsModal({ isOpen, onClose, linkId }: StatsModalProps) {
  const [stats, setStats] = useState<LinkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && linkId) {
      setLoading(true);
      setError(null);
      
      fetch(`/api/user/links/${linkId}/stats`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
          } else {
            setStats(data.stats);
          }
        })
        .catch(() => setError('Erro ao carregar estatísticas'))
        .finally(() => setLoading(false));
    }
  }, [isOpen, linkId]);

  if (!isOpen) return null;

  const getDeviceIcon = (device: string) => {
    const d = device.toLowerCase();
    if (d.includes('mobile') || d.includes('phone')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    if (d.includes('tablet') || d.includes('ipad')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  };

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-lg font-bold text-title">Estatísticas do Link</h3>
          <button
            onClick={onClose}
            className="p-2 text-text hover:text-title hover:bg-border/50 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-center">
              {error}
            </div>
          )}

          {stats && !loading && (
            <div className="space-y-6">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{stats.totalClicks}</span>
                  </div>
                  <div>
                    <p className="text-sm text-text">Total de cliques</p>
                    <p className="text-xs text-text/70">
                      Criado em {new Date(stats.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-surface border border-border rounded-xl">
                  <h4 className="text-sm font-semibold text-title mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                    Por País
                  </h4>
                  {stats.topCountries.length > 0 ? (
                    <div className="space-y-2">
                      {stats.topCountries.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getCountryFlag(item.country)}</span>
                            <span className="text-sm text-text">{item.country}</span>
                          </div>
                          <span className="text-sm font-semibold text-title">{item.clicks}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-text/70">Nenhum dado disponível</p>
                  )}
                </div>

                <div className="p-4 bg-surface border border-border rounded-xl">
                  <h4 className="text-sm font-semibold text-title mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Por Dispositivo
                  </h4>
                  {stats.topDevices.length > 0 ? (
                    <div className="space-y-2">
                      {stats.topDevices.map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(item.device)}
                            <span className="text-sm text-text capitalize">{item.device}</span>
                          </div>
                          <span className="text-sm font-semibold text-title">{item.clicks}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-text/70">Nenhum dado disponível</p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-surface border border-border rounded-xl">
                <h4 className="text-sm font-semibold text-title mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Referências
                </h4>
                {stats.topReferrers.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {stats.topReferrers.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-text truncate max-w-[200px]" title={item.referrer}>
                          {item.referrer === '(direct)' ? 'Acesso direto' : item.referrer}
                        </span>
                        <span className="text-sm font-semibold text-title">{item.clicks}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text/70">Nenhum dado disponível</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
