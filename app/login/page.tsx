'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ArrowLeft, ArrowRight, BarChart3, Eye, EyeOff, Link2, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function getRedirectPath() {
  if (typeof window === 'undefined') return '/';

  const redirect = new URLSearchParams(window.location.search).get('redirect') || '/';
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return '/';

  return redirect;
}

export default function LoginPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const redirectTo = useMemo(() => getRedirectPath(), []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const registerHref = `/register?redirect=${encodeURIComponent(redirectTo)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha email e senha para continuar');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Digite um email válido');
      return;
    }

    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Email ou senha inválidos');
        return;
      }

      await checkAuth();
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-8 lg:grid-cols-[1fr_440px] lg:items-center">
        <section className="hidden lg:block">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-text hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Voltar para a home
          </Link>
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              <ShieldCheck className="h-4 w-4" />
              Acesso seguro
            </div>
            <h1 className="text-5xl font-bold leading-tight text-title">
              Entre e continue sua campanha.
            </h1>
            <p className="mt-5 text-lg leading-8 text-text">
              Acesse seus links, métricas, QR Codes e checkout Premium sem perder o caminho de onde você veio.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                { icon: Link2, text: 'Links com alias de marca' },
                { icon: BarChart3, text: 'Dashboard de performance' },
                { icon: Lock, text: 'Sessão protegida com autenticação segura' },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.text} className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-semibold text-title">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-text hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 shadow-card-xl md:p-8">
            <div className="mb-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-title">Entrar</h2>
              <p className="mt-2 text-text">
                {redirectTo === '/premium'
                  ? 'Entre para iniciar seu teste Premium.'
                  : 'Entre para continuar usando o URLEncurta.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-title">Email</span>
                <span className="relative block">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full rounded-xl border border-border bg-background py-3.5 pl-12 pr-4 text-title transition-all placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-title">Senha</span>
                <span className="relative block">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="w-full rounded-xl border border-border bg-background py-3.5 pl-12 pr-12 text-title transition-all placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 rounded-lg p-2 text-text-secondary transition hover:text-primary"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                {loading ? 'Entrando...' : 'Entrar e continuar'}
              </button>
            </form>

            <div className="mt-6 rounded-2xl bg-background p-4 text-center">
              <p className="text-sm text-text">
                Ainda não tem conta?{' '}
                <Link href={registerHref} className="font-bold text-primary hover:text-primary-hover">
                  Criar conta grátis
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
