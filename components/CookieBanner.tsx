'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem('cookie_noticeAccepted');
    if (!hasAccepted) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    setIsClosing(true);
    localStorage.setItem('cookie_noticeAccepted', 'true');
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <>
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ${
          isClosing ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">
                Utilizamos cookies para melhorar sua experiência e exibir anúncios personalizados. 
                Ao continuar navegando, você concorda com o uso de cookies. 
                <Link href="/privacidade" className="text-blue-600 hover:underline ml-1 font-medium">
                  Leia nossa Política de Privacidade
                </Link>
              </p>
            </div>
            <button
              onClick={handleAccept}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
            >
              Entendi
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
