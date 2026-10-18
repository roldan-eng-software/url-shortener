'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { getStoredCookieConsent, saveCookieConsent } from '@/lib/cookie-consent';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    setShowBanner(!getStoredCookieConsent());
  }, []);

  const persistPreferences = (preferences: { analytics: boolean; ads: boolean }) => {
    saveCookieConsent(preferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const openPreferences = useCallback(() => {
    const stored = getStoredCookieConsent();
    setAnalytics(Boolean(stored?.analytics));
    setAds(Boolean(stored?.ads));
    setShowPreferences(true);
    setShowBanner(true);
  }, []);

  useEffect(() => {
    const handleOpenPreferences = () => openPreferences();
    window.addEventListener('urlencurtaOpenCookiePreferences', handleOpenPreferences);
    return () => {
      window.removeEventListener('urlencurtaOpenCookiePreferences', handleOpenPreferences);
    };
  }, [openPreferences]);

  if (!showBanner) {
    return (
      <button
        type="button"
        onClick={openPreferences}
        className="fixed bottom-4 left-4 z-40 rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold text-text shadow-card transition-colors hover:text-title"
      >
        Preferências de cookies
      </button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface shadow-[0_-8px_24px_rgba(0,0,0,0.12)]">
      {!showPreferences ? (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-text">
                Usamos cookies necessários para operar o site. Cookies de analytics e publicidade só
                são ativados com sua escolha. Você pode aceitar, rejeitar ou configurar por
                categoria.
                <Link
                  href="/privacidade"
                  className="ml-1 font-semibold text-primary hover:underline"
                >
                  Ver Política de Privacidade
                </Link>
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => persistPreferences({ analytics: false, ads: false })}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text transition-colors hover:text-title"
              >
                Rejeitar não necessários
              </button>
              <button
                type="button"
                onClick={openPreferences}
                className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                Gerenciar
              </button>
              <button
                type="button"
                onClick={() => persistPreferences({ analytics: true, ads: true })}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Aceitar todos
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl px-4 py-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-title">Preferências de cookies</h2>
            <p className="mt-1 text-sm text-text">
              Cookies necessários ficam sempre ativos. Você controla analytics e publicidade.
            </p>
          </div>

          <div className="space-y-3">
            <CookieCategory
              checked
              description="Essenciais para autenticação, segurança, tema e operação básica do encurtador."
              disabled
              label="Necessários"
            />
            <CookieCategory
              checked={analytics}
              description="Ajudam a medir páginas visitadas, eventos de uso e desempenho do site."
              label="Analytics"
              onChange={setAnalytics}
            />
            <CookieCategory
              checked={ads}
              description="Permitem carregar publicidade e medir anúncios em páginas editoriais elegíveis."
              label="Publicidade"
              onChange={setAds}
            />
          </div>

          <div className="mt-5 flex flex-col justify-end gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => persistPreferences({ analytics: false, ads: false })}
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text transition-colors hover:text-title"
            >
              Rejeitar não necessários
            </button>
            <button
              type="button"
              onClick={() => persistPreferences({ analytics, ads })}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Salvar preferências
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CookieCategory({
  checked,
  description,
  disabled = false,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  disabled?: boolean;
  label: string;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background p-4">
      <span>
        <span className="block text-sm font-bold text-title">{label}</span>
        <span className="mt-1 block text-sm text-text">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        className="mt-1 h-5 w-5 accent-primary"
      />
    </label>
  );
}
