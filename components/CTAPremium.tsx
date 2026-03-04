'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CTAPremium() {
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check-premium');
        const data = await res.json();
        setIsLoggedIn(!!data.userId);
      } catch (err) {
        console.error('Error checking auth:', err);
      }
    };
    checkAuth();
  }, []);

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }

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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    if (modalTab === 'register') {
      if (password !== confirmPassword) {
        setError('As senhas não coincidem');
        return;
      }
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return;
      }
    }

    setAuthLoading(true);

    try {
      const endpoint = modalTab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `Erro ao ${modalTab === 'login' ? 'entrar' : 'criar conta'}`);
        return;
      }

      setIsLoggedIn(true);
      setShowModal(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      handleCheckout();
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <>
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
              R$ 29,90/mês
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          
          <div className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-md p-6 border border-border">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-text hover:text-title"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3" 
                   style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-title">
                {modalTab === 'login' ? 'Entrar para continuar' : 'Criar conta'}
              </h3>
              <p className="text-text text-sm mt-1">
                {modalTab === 'login' ? 'Entre com sua conta para assinar' : 'Crie uma conta para assinar'}
              </p>
            </div>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => { setModalTab('login'); setError(''); }}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                  modalTab === 'login'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text hover:bg-gray-200'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => { setModalTab('register'); setError(''); }}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                  modalTab === 'register'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text hover:bg-gray-200'
                }`}
              >
                Criar Conta
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-title placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-title placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>

              {modalTab === 'register' && (
                <div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar senha"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-title placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processando...
                  </>
                ) : (
                  modalTab === 'login' ? 'Entrar e Assinar' : 'Criar Conta e Assinar'
                )}
              </button>
            </form>

            {modalTab === 'login' && (
              <div className="mt-4 text-center">
                <Link 
                  href="/login?redirect=/premium" 
                  className="text-sm text-primary hover:underline"
                  onClick={() => setShowModal(false)}
                >
                  Esqueceu a senha?
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
