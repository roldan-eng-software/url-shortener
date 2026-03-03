'use client';

interface StatsProps {
  totalUrls: number;
  totalClicks: number;
}

export function Stats({ totalUrls, totalClicks }: StatsProps) {
  return (
    <div className="container mx-auto px-4 max-w-6xl py-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="p-3 sm:p-4 bg-surface border border-border rounded-xl text-center hover:shadow-glow transition-all duration-300">
          <p className="text-2xl sm:text-3xl font-bold text-primary">{totalUrls.toLocaleString('pt-BR')}</p>
          <p className="text-xs sm:text-sm text-text mt-1">URLs Criadas</p>
        </div>
        <div className="p-3 sm:p-4 bg-surface border border-border rounded-xl text-center hover:shadow-glow transition-all duration-300">
          <p className="text-2xl sm:text-3xl font-bold text-primary">{totalClicks.toLocaleString('pt-BR')}</p>
          <p className="text-xs sm:text-sm text-text mt-1">Total de Cliques</p>
        </div>
      </div>
    </div>
  );
}
