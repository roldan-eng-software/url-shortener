'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Mail, Phone, UserRound } from 'lucide-react';
import { trackConversionEvent } from './GoogleAnalytics';

const interestOptions = [
  { value: 'premium', label: 'Quero assinar o Premium' },
  { value: 'analytics', label: 'Quero métricas melhores' },
  { value: 'campaigns', label: 'Vou divulgar campanhas' },
  { value: 'agency', label: 'Uso em agência/time comercial' },
];

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  interest: string;
};

const initialState: FormState = {
  name: '',
  email: '',
  company: '',
  phone: '',
  interest: 'premium',
};

export function LeadCaptureForm() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          source: 'home_conversion_band',
          message: 'Lead capturado na faixa de conversão da home.',
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Não foi possível enviar seus dados agora.');
        return;
      }

      setSuccess(data.message || 'Recebemos seus dados.');
      trackConversionEvent('lead_created', {
        lead_interest: form.interest,
        lead_source: 'home_conversion_band',
      });
      setForm(initialState);
    } catch {
      setError('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-5 text-title shadow-2xl shadow-black/20">
      <div className="mb-5">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
          Quer vender com links?
        </span>
        <h3 className="mt-2 text-2xl font-bold leading-tight">
          Receba um plano rápido para sua campanha
        </h3>
      </div>

      {success && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Nome</span>
          <span className="relative block">
            <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 text-title outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Seu nome"
              required
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Email comercial</span>
          <span className="relative block">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 text-title outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="voce@empresa.com"
              required
            />
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold">Empresa</span>
            <input
              value={form.company}
              onChange={(event) => updateField('company', event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-3 text-title outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Opcional"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold">WhatsApp</span>
            <span className="relative block">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
              <input
                value={form.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 text-title outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Opcional"
              />
            </span>
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Objetivo</span>
          <select
            value={form.interest}
            onChange={(event) => updateField('interest', event.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-3 text-title outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {interestOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        data-track="form_submit"
        data-track-category="lead"
        data-track-label="home_conversion_band"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
        {loading ? 'Enviando...' : 'Quero receber o plano'}
      </button>
    </form>
  );
}
