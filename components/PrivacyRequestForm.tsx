'use client';

import { FormEvent, useState } from 'react';

const requestTypes = [
  { value: 'access', label: 'Acesso aos dados' },
  { value: 'correction', label: 'Correção de dados' },
  { value: 'deletion', label: 'Eliminação de dados' },
  { value: 'portability', label: 'Portabilidade' },
  { value: 'opposition', label: 'Oposição ao tratamento' },
  { value: 'consent_revocation', label: 'Revogação de consentimento' },
  { value: 'information', label: 'Informações sobre compartilhamento' },
];

export function PrivacyRequestForm() {
  const [requestType, setRequestType] = useState(requestTypes[0].value);
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/privacy/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestType, email, details }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível enviar sua solicitação.');
      }

      setStatus('success');
      setMessage(data.message || 'Solicitação registrada.');
      setDetails('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Não foi possível enviar sua solicitação.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-title">Tipo de solicitação</span>
          <select
            value={requestType}
            onChange={(event) => setRequestType(event.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
          >
            {requestTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-title">Email para resposta</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            maxLength={254}
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
            placeholder="voce@exemplo.com"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-title">Detalhes</span>
        <textarea
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          maxLength={1000}
          rows={4}
          className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
          placeholder="Informe dados que ajudem a localizar sua conta, link ou solicitação."
        />
      </label>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-text-secondary">
          Responderemos em prazo compatível com a LGPD pelo email informado.
        </p>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar solicitação'}
        </button>
      </div>

      {message && (
        <p
          className={`mt-4 rounded-lg px-3 py-2 text-sm ${
            status === 'success'
              ? 'bg-success/10 text-success'
              : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
