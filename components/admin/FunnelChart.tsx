'use client';

export type FunnelStepEntry = {
  step: string;
  source?: string;
  count: number;
  uniqueUsers?: number;
};

export type FunnelData = {
  period: { from: string; to: string };
  totals: { steps: number; users: number };
  steps: FunnelStepEntry[];
  conversionRates: {
    visitorToAccount: number;
    accountToTrial: number;
    trialToPaid: number;
    paidToCanceled: number;
  };
  unknownSourceShare: number;
};

const STEP_LABELS: Record<string, string> = {
  result_viewed: 'Resultado visto',
  offer_viewed: 'Oferta Premium vista',
  account_creation_started: 'Cadastro iniciado',
  account_created: 'Conta criada',
  trial_started: 'Trial iniciado',
  subscription_active: 'Assinatura ativa',
  payment_failed: 'Pagamento falhou',
  subscription_canceled: 'Assinatura cancelada',
};

const RATE_LABELS: Array<{ key: keyof FunnelData['conversionRates']; label: string }> = [
  { key: 'visitorToAccount', label: 'Anônimo → conta' },
  { key: 'accountToTrial', label: 'Conta → trial' },
  { key: 'trialToPaid', label: 'Trial → pago' },
  { key: 'paidToCanceled', label: 'Pago → cancelado' },
];

function stepLabel(step: string): string {
  return STEP_LABELS[step] ?? step;
}

export function FunnelChart({
  data,
  loading,
  groupBySource,
}: {
  data: FunnelData | null;
  loading: boolean;
  groupBySource: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-white p-12 shadow-md">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg bg-white p-6 text-sm text-gray-500 shadow-md">
        Sem dados para exibir.
      </div>
    );
  }

  const maxCount = Math.max(1, ...data.steps.map((entry) => entry.count));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow-md">
          <p className="text-sm text-gray-500">Eventos no período</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">
            {data.totals.steps.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-md">
          <p className="text-sm text-gray-500">Etapas do funil</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{data.steps.length}</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-md">
          <p className="text-sm text-gray-500">Origem desconhecida</p>
          <p
            className={`mt-1 text-3xl font-bold ${
              data.unknownSourceShare > 0.1 ? 'text-amber-600' : 'text-green-600'
            }`}
          >
            {(data.unknownSourceShare * 100).toFixed(1)}%
          </p>
          <p className="mt-1 text-xs text-gray-500">Meta: até 10% sem origem atribuída</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Taxas de conversão</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RATE_LABELS.map((rate) => (
            <div key={rate.key} className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">{rate.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {data.conversionRates[rate.key].toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Etapas {groupBySource ? 'por origem' : 'do funil'}
        </h3>

        <div className="space-y-3">
          {data.steps.map((entry) => (
            <div key={`${entry.step}-${entry.source ?? 'all'}`}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-800">
                  {stepLabel(entry.step)}
                  {entry.source !== undefined && (
                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                      {entry.source}
                    </span>
                  )}
                </span>
                <span className="text-gray-600">
                  {entry.count.toLocaleString('pt-BR')}
                  {typeof entry.uniqueUsers === 'number' && entry.uniqueUsers > 0 && (
                    <span className="ml-2 text-xs text-gray-400">
                      {entry.uniqueUsers.toLocaleString('pt-BR')} usuários
                    </span>
                  )}
                </span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${Math.max(2, (entry.count / maxCount) * 100)}%` }}
                />
              </div>
            </div>
          ))}

          {data.steps.length === 0 && (
            <p className="text-sm text-gray-500">
              Nenhuma etapa registrada no período selecionado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
