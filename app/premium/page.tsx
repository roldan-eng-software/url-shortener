'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const plans = [
  {
    name: 'Grátis',
    price: 'R$ 0',
    period: 'para sempre',
    description: 'Perfeito para começar',
    features: [
      'URLs ilimitadas',
      'Estatísticas básicas',
      'Links permanentes',
      'Suporte por email',
      '1 QR Code por dia'
    ],
    notIncluded: [
      'URLs customizadas',
      'Estatísticas avançadas',
      'Exportação de dados'
    ],
    cta: 'Atual',
    popular: false,
    action: 'current'
  },
  {
    name: 'Premium',
    price: 'R$ 29,90',
    period: '/mês',
    description: 'O mais popular',
    features: [
      'Tudo do Grátis',
      'URLs customizadas',
      'Estatísticas avançadas',
      'QR Codes ilimitados',
      'Exportação de dados',
      'Suporte prioritário',
      'Links com senha',
      'Data de expiração'
    ],
    notIncluded: [],
    cta: 'Começar Agora',
    popular: true,
    action: 'checkout'
  },
  {
    name: 'Empresarial',
    price: 'R$ 49,90',
    period: '/mês',
    description: 'Para equipes',
    features: [
      'Tudo do Premium',
      'Múltiplos usuários',
      'API acesso',
      'White label',
      'Relatórios customizados',
      'Gerente de conta',
      'SLA garantido',
      'Treinamento'
    ],
    notIncluded: [],
    cta: 'Falar com Consultor',
    popular: false,
    action: 'contact'
  }
];

export default function PremiumPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, isPremium } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/premium');
      return;
    }

    setLoading('checkout');
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
      setLoading(null);
    }
  };

  const handlePlanAction = (action: string) => {
    if (action === 'checkout') {
      handleCheckout();
    } else if (action === 'contact') {
      alert('Entre em contato pelo email: suporte@urlencurta.com.br');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
        {(success || canceled) && (
          <div className="container mx-auto px-4 max-w-6xl pt-4">
            {success && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-center">
                Pagamento iniciado com sucesso! Verifique seu email para confirmar a assinatura.
              </div>
            )}
            {canceled && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-yellow-700 dark:text-yellow-400 text-center">
                Pagamento cancelado. Tente novamente quando quiser.
              </div>
            )}
          </div>
        )}
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                Planos Premium
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Escolha o plano ideal para você
              </h1>
              <p className="text-lg text-secondary max-w-2xl mx-auto">
                Desbloqueie todo o poder do URLEncurta com nossos planos Premium. Recursos avançados para profissionais e empresas.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl p-8 border-2 ${plan.popular ? 'border-primary shadow-2xl scale-105' : 'border-border shadow-lg'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-secondary">{plan.period}</span>
                    </div>
                    <p className="text-secondary text-sm mt-2">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-secondary text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 opacity-50">
                        <svg className="w-5 h-5 text-secondary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-secondary text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handlePlanAction(plan.action)}
                    disabled={loading === 'checkout'}
                    className={`block w-full py-3 text-center font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.popular
                        ? 'bg-primary text-white hover:bg-primary-hover'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {loading === 'checkout' ? 'Processando...' : plan.cta}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-secondary">
                Precisa de um plano personalizado?{' '}
                <a href="mailto:suporte@urlencurta.com.br" className="text-primary font-medium hover:underline">
                  Fale conosco
                </a>
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Perguntas sobre planos
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">Posso cancelar a qualquer momento?</h3>
                <p className="text-secondary">Sim! Você pode cancelar seu plano Premium a qualquer momento. Continuará tendo acesso até o fim do período pago.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">Quais formas de pagamento?</h3>
                <p className="text-secondary">Aceitamos cartão de crédito (Visa, Mastercard, Amex), PIX e Boleto bancário.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">O que acontece com meus links se eu cancelar?</h3>
                <p className="text-secondary">Seus links continuarão funcionando mesmo após o cancelamento. Você apenas perderá acesso aos recursos Premium.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
