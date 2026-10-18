'use client';

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  interest: string;
  source: string;
  message: string | null;
  status: string;
  createdAt: string;
}

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  onStatusUpdate: (leadId: string, newStatus: string) => void;
}

const statusOptions = [
  { value: 'new', label: 'Novo', color: 'bg-blue-100 text-blue-800' },
  { value: 'contacted', label: 'Contactado', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'converted', label: 'Convertido', color: 'bg-green-100 text-green-800' },
  { value: 'lost', label: 'Perdido', color: 'bg-red-100 text-red-800' },
];

const interestLabels: Record<string, string> = {
  premium: 'Premium',
  enterprise: 'Enterprise',
  partnership: 'Parceria',
  other: 'Outro',
};

const sourceLabels: Record<string, string> = {
  home_conversion_band: 'Homepage',
  seo: 'SEO',
  social: 'Redes Sociais',
  referral: 'Indicação',
  other: 'Outra',
};

export function LeadsTable({ leads, loading, onStatusUpdate }: LeadsTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-t border-gray-200 bg-gray-50"></div>
          ))}
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Nenhum lead encontrado</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interesse
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fonte
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => {
              const currentStatus =
                statusOptions.find((s) => s.value === lead.status) || statusOptions[0];

              return (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{lead.email}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{lead.company || '-'}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {interestLabels[lead.interest] || lead.interest}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {sourceLabels[lead.source] || lead.source}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${currentStatus.color}`}
                    >
                      {currentStatus.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <select
                      value={lead.status}
                      onChange={(e) => onStatusUpdate(lead.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
