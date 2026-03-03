'use client';

import Link from 'next/link';
import { UrlForm } from '@/components/UrlForm';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 aurora-bg">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-4 sm:mb-6">
              <span className="inline-block w-full max-w-xs sm:max-w-sm md:max-w-md px-3 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-success to-emerald-500 text-white font-bold text-xs sm:text-lg rounded-xl shadow-lg text-center">
                100% Grátis e Fácil de Usar
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-title mb-6 leading-tight">
              Encurtador de URL Grátis e Rápido
            </h1>
            <p className="text-lg md:text-xl font-semibold text-text mb-8 max-w-xl mx-auto lg:mx-0">
              Links curtos para WhatsApp, Instagram, TikTok
            </p>

            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 text-sm text-text">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="hidden xs:inline">Sem cadastro</span>
                <span className="xs:hidden">Sem cadastro</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="hidden xs:inline">Ilimitado</span>
                <span className="xs:hidden">Ilimitado</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="hidden xs:inline">Seguro</span>
                <span className="xs:hidden">Seguro</span>
              </div>
            </div>
          </div>
          
          <div id="encurtar" className="bg-surface rounded-2xl shadow-card-xl p-6 md:p-8 border border-border transition-all duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4" 
                   style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)' }}>
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div className="inline-block px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full mb-3">
                🚀 Sem cadastro obrigatório
              </div>
              <h2 className="text-xl font-bold text-title">Cole sua URL aqui</h2>
              <p className="text-text text-sm mt-1">Encurtamos em menos de 1 segundo</p>
            </div>
            <UrlForm />
          </div>
        </div>
        
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">50K+</div>
            <div className="text-text text-xs sm:text-sm">URLs Encurtadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">1M+</div>
            <div className="text-text text-xs sm:text-sm">Cliques Totais</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">99.9%</div>
            <div className="text-text text-xs sm:text-sm">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">100%</div>
            <div className="text-text text-xs sm:text-sm">Gratuito</div>
          </div>
        </div>
      </div>
    </section>
  );
}
