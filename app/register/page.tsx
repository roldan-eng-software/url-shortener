'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  Eye,
  EyeOff,
  Link2,
  Loader2,
  Lock,
  Mail,
  QrCode,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function getRedirectPath() {
  if (typeof window === 'undefined') return '/';

  const redirect = new URLSearchParams(window.location.search).get('redirect') || '/';
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return '/';

  return redirect;
}

export default function RegisterPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const redirectTo = useMemo(() => getRedirectPath(), []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loginHref = `/login?redirect=${encodeURIComponent(redirectTo)}`;
  const passwordChecks = [
    { label: '8 caracteres ou mais', valid: password.length >= 8 },
    { label: 'Senhas iguais', valid: Boolean(confirmPassword) && password === confirmPassword },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Preencha email, senha e confirmação');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Digite um email válido');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao criar conta');
        return;
      }

      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
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
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-8 lg:grid-cols-[1fr_460px] lg:items-center">
        <section className="hidden lg:block">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-text hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Voltar para a home
          </Link>
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              <UserPlus className="h-4 w-4" />
              Comece em menos de um minuto
            </div>
            <h1 className="text-5xl font-bold leading-tight text-title">
              Crie sua conta e publique links com cara de campanha.
            </h1>
            <p className="mt-5 text-lg leading-8 text-text">
              Salve histórico, acompanhe cliques e desbloqueie um fluxo direto para o Premium quando estiver pronto para vender melhor.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Link2, title: 'Links curtos' },
                { icon: BarChart3, title: 'Métricas' },
                { icon: QrCode, title: 'QR Code' },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="rounded-2xl border border-border bg-surface p-4">
                    <Icon className="h-6 w-6 text-primary" />
                    <p className="mt-3 font-bold text-title">{item.title}</p>
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
                <UserPlus className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-title">Criar conta</h2>
              <p className="mt-2 text-text">
                {redirectTo === '/premium'
                  ? 'Crie sua conta para ativar o teste Premium.'
                  : 'Crie sua conta para salvar links e métricas.'}
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
                    placeholder="Crie uma senha"
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

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-title">Confirmar senha</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-title transition-all placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </label>

              <div className="grid gap-2 rounded-2xl bg-background p-3">
                {passwordChecks.map((check) => (
                  <div key={check.label} className="flex items-center gap-2 text-sm">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full ${check.valid ? 'bg-green-500 text-white' : 'bg-border text-text-secondary'}`}>
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className={check.valid ? 'text-title' : 'text-text'}>{check.label}</span>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                {loading ? 'Criando conta...' : 'Criar conta e continuar'}
              </button>
            </form>

            <div className="mt-6 rounded-2xl bg-background p-4 text-center">
              <p className="text-sm text-text">
                Já tem conta?{' '}
                <Link href={loginHref} className="font-bold text-primary hover:text-primary-hover">
                  Entrar
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-text-secondary">
            Ao criar uma conta, você concorda com nossos{' '}
            <Link href="/termos" className="text-primary hover:underline">Termos de Uso</Link>
            {' '}e{' '}
            <Link href="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>.
          </p>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-text-secondary">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Seus dados são usados apenas para autenticação e operação da conta.
          </div>
        </section>
      </div>
    </div>
  );
}
