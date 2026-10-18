'use client';

import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface PaymentStatusProps {
  connected: boolean;
  loading: boolean;
}

export function PaymentStatus({ connected, loading }: PaymentStatusProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Status do Stripe</h3>

      <div className="flex items-center gap-4">
        {connected ? (
          <>
            <CheckCircle className="w-12 h-12 text-green-500" />
            <div>
              <p className="text-lg font-medium text-green-600">Conectado</p>
              <p className="text-sm text-gray-500">Stripe está configurado e funcionando</p>
            </div>
          </>
        ) : (
          <>
            <XCircle className="w-12 h-12 text-red-500" />
            <div>
              <p className="text-lg font-medium text-red-600">Desconectado</p>
              <p className="text-sm text-gray-500">
                Stripe não está configurado. Verifique as variáveis de ambiente:
              </p>
              <ul className="text-sm text-gray-500 mt-2 list-disc list-inside">
                <li>STRIPE_SECRET_KEY</li>
                <li>STRIPE_WEBHOOK_SECRET</li>
              </ul>
            </div>
          </>
        )}
      </div>

      {!connected && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Configuração Necessária</p>
              <p className="text-sm text-yellow-700 mt-1">
                Para habilitar os pagamentos, configure as variáveis de ambiente do Stripe no
                arquivo
                <code className="mx-1 px-1 bg-yellow-100 rounded">.env.local</code>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
