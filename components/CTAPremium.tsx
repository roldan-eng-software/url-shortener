'use client';

import { useState } from 'react';
import Link from 'next/link';

export function CTAPremium() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erro ao processar pagamento');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-gradient-to-br from-primary to-primary-hover rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              Plano Premium
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              R$29/mês
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Desbloqueie todo o poder do URLEncurta com recursos exclusivos
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-10 text-left max-w-2xl mx-auto">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">🔗</div>
                <div className="font-bold text-white">Links Customizados</div>
                <div className="text-white/70 text-sm">Crie aliases personalizados para sua marca</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-bold text-white">Estatísticas Avançadas</div>
                <div className="text-white/70 text-sm">Geo, dispositivo e referenciadores</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">💾</div>
                <div className="font-bold text-white">Histórico Ilimitado</div>
                <div className="text-white/70 text-sm">Todos os seus links salvos para sempre</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl mb-2">🔑</div>
                <div className="font-bold text-white">API Key</div>
                <div className="text-white/70 text-sm">Acesso programático aos seus links</div>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-bold rounded-xl hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processando...
                </>
              ) : (
                <>
                  🚀 Assinar Premium
                </>
              )}
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            
            <p className="text-white/60 text-sm mt-6">
              Pagamento único. Acesso imediato.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
